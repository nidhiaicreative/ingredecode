import { createFileRoute } from "@tanstack/react-router";
import { DecoderPage } from "@/features/decoder/DecoderPage";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "IngreDecode — Know what's inside, before it's inside you" },
      {
        name: "description",
        content:
          "Paste any ingredient list — food, skincare, or medicine — and get a calm, scientifically accurate, plain-language breakdown in English or Hinglish.",
      },
      { property: "og:title", content: "IngreDecode — Decode any ingredient label" },
      {
        property: "og:description",
        content:
          "A calm, evidence-based decoder for confusing ingredient labels. Built for Indian consumers by a molecular biologist.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: DecoderPage,
});
