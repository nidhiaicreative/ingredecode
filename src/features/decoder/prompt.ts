import type { DecodeInput } from "./schema";

const SCHEMA_HINT = `{
  "overall_summary": string,
  "buying_recommendation": string (one sentence, context-aware: for food frame around who it's suitable for and how often; for skincare frame around skin type/usage; for medicine frame around usage caution),
  "health_meter": { "score": number (0-100), "category": "safe"|"moderate"|"caution"|"avoid" },
  "flagged_ingredients": string[],
  "ingredients": [
    { "name": string, "common_name": string, "purpose": string, "safety_note": string, "evidence_level": "strong"|"moderate"|"limited"|"unclear", "kitchen_familiarity": "common_kitchen"|"processed" }
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
    "For each ingredient, set kitchen_familiarity to 'common_kitchen' if it would be recognized in a traditional Indian kitchen (e.g. sugar, salt, atta, ghee, haldi, jeera, milk, water, besan) and 'processed' for additives, E-numbers, INS codes, emulsifiers, preservatives, synthetic actives, or unfamiliar chemical names.",
    "Always include a one-sentence buying_recommendation tailored to product_type.",
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
