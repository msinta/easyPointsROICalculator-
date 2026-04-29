import { useState, useMemo } from "react";
import { Nav } from "@/components/nav";
import { Hero } from "@/components/hero";
import { CalculatorInputs } from "@/components/calculator-inputs";
import { CalculatorResults } from "@/components/calculator-results";
import { EmptyState } from "@/components/empty-state";
import { SocialProof } from "@/components/social-proof";
import { Recommendation } from "@/components/recommendation";
import { Cta } from "@/components/cta";
import { Footer } from "@/components/footer";
import { calculate } from "@/lib/calculator";
import type { Industry, GrossMargin } from "@/lib/calculator";

export function App() {
  const [monthlyOrders, setMonthlyOrders] = useState(0);
  const [aov, setAov] = useState(0);
  const [repeatRate, setRepeatRate] = useState(0);
  const [industry, setIndustry] = useState<Industry | "">("");
  const [margin, setMargin] = useState<GrossMargin | "">("");
  const [email, setEmail] = useState("");
  const [showResults, setShowResults] = useState(false);
  const [hasCalculated, setHasCalculated] = useState(false);

  const isValid =
    monthlyOrders > 0 &&
    aov > 0 &&
    repeatRate > 0 &&
    industry !== "" &&
    margin !== "";

  const result = useMemo(
    () =>
      isValid
        ? calculate(monthlyOrders, aov, repeatRate / 100, industry as Industry)
        : null,
    [monthlyOrders, aov, repeatRate, industry, isValid]
  );

  function handleCalculate() {
    if (!isValid || !result) return;
    setHasCalculated(true);
    setShowResults(true);
  }

  return (
    <div className="min-h-screen bg-white font-sans">
      <Nav />
      <Hero />

      <section className="px-6 pb-20">
        <div className="mx-auto flex flex-col lg:flex-row items-start max-w-[1200px] gap-10">
          <div className="w-full max-w-[420px] shrink-0 mx-auto lg:mx-0">
            <CalculatorInputs
              monthlyOrders={monthlyOrders}
              aov={aov}
              repeatRate={repeatRate}
              industry={industry}
              margin={margin}
              email={email}
              onMonthlyOrdersChange={setMonthlyOrders}
              onAovChange={setAov}
              onRepeatRateChange={setRepeatRate}
              onIndustryChange={(v) => setIndustry(v)}
              onMarginChange={(v) => setMargin(v)}
              onEmailChange={setEmail}
              isValid={isValid}
              onCalculate={handleCalculate}
            />
          </div>
          <div className="flex-1 min-w-0 w-full">
            {hasCalculated && result ? (
              <CalculatorResults
                result={result}
                currentRepeatRate={repeatRate}
                animate={showResults}
              />
            ) : (
              <EmptyState />
            )}
          </div>
        </div>
      </section>

      <SocialProof />
      {hasCalculated && result && (
        <Recommendation
          aov={aov}
          monthlyOrders={monthlyOrders}
          repeatRate={repeatRate}
          industry={industry as Industry}
        />
      )}
      <Cta />
      <Footer />
    </div>
  );
}

export default App;
