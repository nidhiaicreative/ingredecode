import { createFileRoute } from "@tanstack/react-router";
import { DecoderPage } from "@/features/decoder/DecoderPage";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "IngreDecode - AI Ingredient Translator" },
      {
        name: "description",
        content:
          "Paste any ingredient list and get an instant, evidence-based breakdown. Built by a molecular biologist.",
      },
      { property: "og:title", content: "IngreDecode - AI Ingredient Translator" },
      {
        property: "og:description",
        content:
          "Paste any ingredient list and get an instant, evidence-based breakdown. Built by a molecular biologist.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: DecoderPage,
});
