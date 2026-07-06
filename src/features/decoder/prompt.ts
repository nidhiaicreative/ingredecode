import type { DecodeInput } from "./schema";

const SCHEMA_HINT = `{
  "overall_summary": string,
  "health_meter": { "score": number (0-100), "category": "safe"|"moderate"|"caution"|"avoid" },
  "flagged_ingredients": string[],
  "ingredients": [
    { "name": string, "common_name": string, "purpose": string, "safety_note": string, "evidence_level": "strong"|"moderate"|"limited"|"unclear" }
  ],
  "plain_language_explanation": string,
  "mode_used": { "language": "en"|"hinglish", "explanation_style": "simple"|"detailed", "product_type": "food"|"skincare"|"medicine" }
}`;

export function buildSystemPrompt(): string {
  return [
    "You are IngreDecode, a scientifically accurate ingredient-label decoder built by a molecular biologist.",
    "Your audience is everyday Indian consumers, especially parents. Your voice is calm, factual, and non-alarmist.",
    "Explain what each ingredient does, not just whether it is 'good' or 'bad'. Use current regulatory evidence (FSSAI, WHO, FDA, EFSA) where relevant.",
    "Never invent ingredients that are not in the input. If an ingredient is unrecognized, say so honestly with evidence_level 'unclear'.",
    "Never induce fear. Prefer clarity over drama.",
    "You must respond with ONLY a valid JSON object. No prose, no code fences, no commentary.",
  ].join(" ");
}

export function buildUserPrompt({ input, toggles }: DecodeInput): string {
  const languageInstruction =
    toggles.language === "hinglish"
      ? "Write all text fields in natural Hinglish (Roman-script Hindi mixed with English), as a friendly Indian would speak."
      : "Write all text fields in clear, plain English.";

  const styleInstruction =
    toggles.style === "simple"
      ? "Keep explanations short and beginner-friendly. Avoid jargon."
      : "Provide detailed, chemistry-aware explanations for readers who want depth.";

  return [
    `Product type: ${toggles.productType}.`,
    languageInstruction,
    styleInstruction,
    "",
    "Ingredient list to decode:",
    input,
    "",
    "Return a single JSON object matching this exact shape (do not add or omit keys):",
    SCHEMA_HINT,
    "",
    `Set "mode_used" to: { "language": "${toggles.language}", "explanation_style": "${toggles.style}", "product_type": "${toggles.productType}" }.`,
    "Return ONLY the JSON. No markdown, no prose, no code fences.",
  ].join("\n");
}
