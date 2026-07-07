import { GrandmaTest } from "./GrandmaTest";
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
  const productType = data.mode_used.product_type;
  const isFood = productType === "food";

  return (
    <div className="space-y-6 sm:space-y-8">
      <Reveal delay={0}>
        <OverallSummary
          summary={data.overall_summary}
          recommendation={data.buying_recommendation}
        />
      </Reveal>
      <Reveal delay={80}>
        <HealthMeter
          score={data.health_meter.score}
          category={data.health_meter.category}
        />
      </Reveal>
      {isFood ? (
        <Reveal delay={120}>
          <GrandmaTest items={data.ingredients} />
        </Reveal>
      ) : null}
      <Reveal delay={160}>
        <FlaggedIngredients items={data.flagged_ingredients} />
      </Reveal>
      <Reveal delay={240}>
        <IngredientList items={data.ingredients} />
      </Reveal>
      <Reveal delay={320}>
        <PlainLanguageExplanation
          text={data.plain_language_explanation}
          productType={productType}
        />
      </Reveal>
    </div>
  );
}
