import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { decodeIngredients } from "@/lib/mesh.functions";
import type {
  DecodeResult,
  ExplanationStyle,
  Language,
  ProductType,
} from "./schema";

export type Toggles = {
  language: Language;
  style: ExplanationStyle;
  productType: ProductType;
};

export const defaultToggles: Toggles = {
  language: "en",
  style: "simple",
  productType: "food",
};

export type DecoderState =
  | { kind: "idle" }
  | { kind: "loading" }
  | { kind: "success"; data: DecodeResult }
  | { kind: "error"; code: string; message: string };

export function useDecoder() {
  const [input, setInput] = useState("");
  const [toggles, setToggles] = useState<Toggles>(defaultToggles);

  const mutation = useMutation({
    mutationFn: async (payload: { input: string; toggles: Toggles }) => {
      const result = await decodeIngredients({ data: payload });
      if (!result.ok) {
        throw Object.assign(new Error(result.message), { code: result.code });
      }
      return result.data;
    },
  });

  const state: DecoderState = mutation.isPending
    ? { kind: "loading" }
    : mutation.isError
      ? {
          kind: "error",
          code: (mutation.error as { code?: string })?.code ?? "network",
          message: (mutation.error as Error)?.message ?? "Something went wrong.",
        }
      : mutation.isSuccess && mutation.data
        ? { kind: "success", data: mutation.data }
        : { kind: "idle" };

  const submit = () => {
    const trimmed = input.trim();
    if (trimmed.length < 3) return;
    mutation.mutate({ input: trimmed, toggles });
  };

  const reset = () => {
    setInput("");
    mutation.reset();
  };

  return {
    input,
    setInput,
    toggles,
    setToggles,
    state,
    submit,
    retry: () => mutation.mutate({ input: input.trim(), toggles }),
    reset,
  };
}
