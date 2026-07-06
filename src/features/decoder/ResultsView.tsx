import { OverallSummary } from "./OverallSummary";
import { HealthMeter } from "./HealthMeter";
import { FlaggedIngredients } from "./FlaggedIngredients";
import { IngredientList } from "./IngredientList";
import { PlainLanguageExplanation } from "./PlainLanguageExplanation";
import type { DecodeResult } from "./schema";

type Props = { data: DecodeResult };

export function ResultsView({ data }: Props) {
  return (
    <div className="space-y-3 motion-safe:animate-in motion-safe:fade-in motion-safe:duration-500">
      <OverallSummary summary={data.overall_summary} />
      <HealthMeter score={data.health_meter.score} category={data.health_meter.category} />
      <FlaggedIngredients items={data.flagged_ingredients} />
      <IngredientList items={data.ingredients} />
      <PlainLanguageExplanation text={data.plain_language_explanation} />
    </div>
  );
}
