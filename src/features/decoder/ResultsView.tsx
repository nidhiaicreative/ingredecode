import { OverallSummary } from "./OverallSummary";
import { HealthMeter } from "./HealthMeter";
import { FlaggedIngredients } from "./FlaggedIngredients";
import { IngredientList } from "./IngredientList";
import { PlainLanguageExplanation } from "./PlainLanguageExplanation";
import type { DecodeResult } from "./schema";

type Props = { data: DecodeResult };

function Reveal({
  delay,
  children,
}: {
  delay: number;
  children: React.ReactNode;
}) {
  return (
    <div
      className="motion-safe:animate-fade-in"
      style={{ animationDelay: `${delay}ms`, animationFillMode: "both" }}
    >
      {children}
    </div>
  );
}

export function ResultsView({ data }: Props) {
  return (
    <div className="space-y-6 sm:space-y-8">
      <Reveal delay={0}>
        <OverallSummary summary={data.overall_summary} />
      </Reveal>
      <Reveal delay={80}>
        <HealthMeter
          score={data.health_meter.score}
          category={data.health_meter.category}
        />
      </Reveal>
      <Reveal delay={160}>
        <FlaggedIngredients items={data.flagged_ingredients} />
      </Reveal>
      <Reveal delay={240}>
        <IngredientList items={data.ingredients} />
      </Reveal>
      <Reveal delay={320}>
        <PlainLanguageExplanation text={data.plain_language_explanation} />
      </Reveal>
    </div>
  );
}
