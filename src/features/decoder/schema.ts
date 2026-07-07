import { z } from "zod";

export const languageEnum = z.enum(["en", "hinglish"]);
export const styleEnum = z.enum(["simple", "detailed"]);
export const productTypeEnum = z.enum(["food", "skincare", "medicine"]);
export const categoryEnum = z.enum(["safe", "moderate", "caution", "avoid"]);
export const evidenceEnum = z.enum(["strong", "moderate", "limited", "unclear"]);

export const kitchenFamiliarityEnum = z.enum(["common_kitchen", "processed"]);

export const decodeResultSchema = z.object({
  overall_summary: z.string(),
  buying_recommendation: z.string().optional().default(""),
  health_meter: z.object({
    score: z.number().min(0).max(100),
    category: categoryEnum,
  }),
  flagged_ingredients: z.array(z.string()),
  ingredients: z.array(
    z.object({
      name: z.string(),
      common_name: z.string(),
      purpose: z.string(),
      safety_note: z.string(),
      evidence_level: evidenceEnum,
      kitchen_familiarity: kitchenFamiliarityEnum.optional().default("processed"),
    }),
  ),
  plain_language_explanation: z.string(),
  mode_used: z.object({
    language: languageEnum,
    explanation_style: styleEnum,
    product_type: productTypeEnum,
  }),
});

export type DecodeResult = z.infer<typeof decodeResultSchema>;
export type Language = z.infer<typeof languageEnum>;
export type ExplanationStyle = z.infer<typeof styleEnum>;
export type ProductType = z.infer<typeof productTypeEnum>;
export type HealthCategory = z.infer<typeof categoryEnum>;
export type EvidenceLevel = z.infer<typeof evidenceEnum>;

export const decodeInputSchema = z.object({
  input: z.string().trim().min(3).max(4000),
  toggles: z.object({
    language: languageEnum,
    style: styleEnum,
    productType: productTypeEnum,
  }),
});

export type DecodeInput = z.infer<typeof decodeInputSchema>;
