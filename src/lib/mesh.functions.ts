import { createServerFn } from "@tanstack/react-start";
import { decodeInputSchema } from "@/features/decoder/schema";

export const decodeIngredients = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => decodeInputSchema.parse(data))
  .handler(async ({ data }) => {
    const { decodeIngredientsServer, MeshError } = await import("./mesh.server");
    try {
      return { ok: true as const, data: await decodeIngredientsServer(data) };
    } catch (err) {
      const code =
        err instanceof MeshError ? err.code : "network";
      const message =
        err instanceof Error ? err.message : "Something went wrong.";
      console.error("[mesh] decode failed:", message);
      return { ok: false as const, code, message };
    }
  });
