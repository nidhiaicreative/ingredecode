import { buildSystemPrompt, buildUserPrompt } from "@/features/decoder/prompt";
import { decodeResultSchema, type DecodeInput, type DecodeResult } from "@/features/decoder/schema";

export class MeshError extends Error {
  constructor(
    message: string,
    public code: "config" | "network" | "rate_limited" | "upstream" | "parse",
    public status?: number,
  ) {
    super(message);
    this.name = "MeshError";
  }
}

function extractJson(text: string): unknown {
  const trimmed = text.trim();
  // Strip common code fences the model might slip in.
  const fenced = trimmed.match(/```(?:json)?\s*([\s\S]*?)\s*```/i);
  const candidate = fenced ? fenced[1] : trimmed;
  try {
    return JSON.parse(candidate);
  } catch {
    // Try to find first {...} block
    const start = candidate.indexOf("{");
    const end = candidate.lastIndexOf("}");
    if (start >= 0 && end > start) {
      return JSON.parse(candidate.slice(start, end + 1));
    }
    throw new MeshError("Model returned non-JSON output.", "parse");
  }
}

async function callMesh(input: DecodeInput, stricter = false): Promise<string> {
  const apiKey = process.env.MESH_API_KEY;
  const baseUrl = process.env.MESH_API_BASE_URL;
  const model = process.env.MESH_MODEL;

  if (!apiKey || !baseUrl || !model) {
    throw new MeshError(
      "Mesh API is not configured. Set MESH_API_KEY, MESH_API_BASE_URL, and MESH_MODEL.",
      "config",
    );
  }

  const endpoint = baseUrl.replace(/\/+$/, "") + "/chat/completions";
  const userPrompt = buildUserPrompt(input);
  const systemPrompt =
    buildSystemPrompt() +
    (stricter
      ? " Your previous response was not valid JSON. This time return ONLY the JSON object, nothing else."
      : "");

  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      temperature: 0.2,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
    }),
  });

  if (response.status === 429) {
    throw new MeshError("Rate limited by Mesh API.", "rate_limited", 429);
  }
  if (!response.ok) {
    const bodyText = await response.text().catch(() => "");
    throw new MeshError(
      `Mesh API responded ${response.status}: ${bodyText.slice(0, 200)}`,
      "upstream",
      response.status,
    );
  }

  const body = (await response.json()) as {
    choices?: Array<{ message?: { content?: string } }>;
  };
  const content = body.choices?.[0]?.message?.content;
  if (!content) throw new MeshError("Mesh API returned an empty response.", "upstream");
  return content;
}

export async function decodeIngredientsServer(input: DecodeInput): Promise<DecodeResult> {
  let raw: string;
  try {
    raw = await callMesh(input, false);
  } catch (err) {
    if (err instanceof MeshError) throw err;
    throw new MeshError(
      err instanceof Error ? err.message : "Unknown network error.",
      "network",
    );
  }

  try {
    const parsed = decodeResultSchema.parse(extractJson(raw));
    return parsed;
  } catch {
    // One retry with a stricter system prompt.
    const retry = await callMesh(input, true);
    try {
      return decodeResultSchema.parse(extractJson(retry));
    } catch {
      throw new MeshError("Model returned a response that didn't match the expected shape.", "parse");
    }
  }
}
