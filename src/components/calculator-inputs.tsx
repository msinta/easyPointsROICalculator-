import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Industry, GrossMargin } from "@/lib/calculator";
import { INDUSTRIES, MARGINS } from "@/lib/calculator";
import { useT } from "@/lib/i18n";

interface SliderInputProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  prefix?: string;
  suffix?: string;
  onChange: (v: number) => void;
}

function SliderInput({ label, value, min, max, step, prefix, suffix, onChange }: SliderInputProps) {
  const progress = max > min ? ((value - min) / (max - min)) * 100 : 0;

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-2">
        <label className="text-sm" style={{ color: "#6B7280" }}>
          {label}
        </label>
        <span className="text-sm font-semibold" style={{ color: "#5936E3" }}>
          {prefix}
          {value.toLocaleString("ja-JP")}
          {suffix}
        </span>
      </div>
      <div className="flex items-center gap-3">
        <div className="relative flex items-center" style={{ flex: "0 0 100px" }}>
          {prefix && (
            <span
              className="absolute left-3 text-sm pointer-events-none"
              style={{ color: "#6B7280" }}
            >
              {prefix}
            </span>
          )}
          <input
            type="number"
            value={value || ""}
            min={min}
            max={max}
            step={step}
            placeholder="0"
            onChange={(e) => {
              const v = Number(e.target.value);
              if (e.target.value === "") {
                onChange(0);
              } else if (!isNaN(v) && v >= 0 && v <= max) {
                onChange(v);
              }
            }}
            className="w-full rounded-lg border text-sm text-right"
            style={{
              borderColor: "#E5E7EB",
              padding: "8px 12px",
              paddingLeft: prefix ? 28 : 12,
              color: "#1A1A1A",
              outline: "none",
            }}
          />
          {suffix && (
            <span
              className="absolute right-3 text-sm pointer-events-none"
              style={{ color: "#6B7280" }}
            >
              {suffix}
            </span>
          )}
        </div>
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="flex-1"
          style={{ "--range-progress": `${progress}%` } as React.CSSProperties}
        />
      </div>
    </div>
  );
}

interface CalculatorInputsProps {
  monthlyOrders: number;
  aov: number;
  repeatRate: number;
  industry: Industry | "";
  margin: GrossMargin | "";
  email: string;
  onMonthlyOrdersChange: (v: number) => void;
  onAovChange: (v: number) => void;
  onRepeatRateChange: (v: number) => void;
  onIndustryChange: (v: Industry) => void;
  onMarginChange: (v: GrossMargin) => void;
  onEmailChange: (v: string) => void;
  isValid: boolean;
  onCalculate: () => void;
}

export function CalculatorInputs({
  monthlyOrders,
  aov,
  repeatRate,
  industry,
  margin,
  email,
  onMonthlyOrdersChange,
  onAovChange,
  onRepeatRateChange,
  onIndustryChange,
  onMarginChange,
  onEmailChange,
  isValid,
  onCalculate,
}: CalculatorInputsProps) {
  const { lang, tr } = useT();

  return (
    <div
      className="bg-white"
      style={{
        borderRadius: 16,
        boxShadow: "0 2px 20px rgba(0,0,0,0.06)",
        padding: 40,
        width: "100%",
      }}
    >
      <p
        className="font-semibold uppercase mb-6"
        style={{ fontSize: 12, letterSpacing: "0.1em", color: "#5936E3" }}
      >
        {tr.inputs.yourStore[lang]}
      </p>

      <SliderInput
        label={tr.inputs.monthlyOrders[lang]}
        value={monthlyOrders}
        min={0}
        max={5000}
        step={10}
        onChange={onMonthlyOrdersChange}
      />

      <SliderInput
        label={tr.inputs.aov[lang]}
        value={aov}
        min={0}
        max={100000}
        step={500}
        prefix="¥"
        onChange={onAovChange}
      />

      <SliderInput
        label={tr.inputs.repeatRate[lang]}
        value={repeatRate}
        min={0}
        max={60}
        step={1}
        suffix="%"
        onChange={onRepeatRateChange}
      />

      <div className="mb-6">
        <label className="block text-sm mb-2" style={{ color: "#6B7280" }}>
          {tr.inputs.industry[lang]}
        </label>
        <Select
          value={industry || undefined}
          onValueChange={(v) => onIndustryChange(v as Industry)}
        >
          <SelectTrigger
            className="w-full"
            style={{
              borderColor: "#E5E7EB",
              borderRadius: 8,
              padding: "12px 16px",
              height: "auto",
              fontSize: 14,
            }}
          >
            <SelectValue placeholder={tr.inputs.selectIndustry[lang]} />
          </SelectTrigger>
          <SelectContent>
            {INDUSTRIES.map((ind) => (
              <SelectItem key={ind} value={ind}>
                {tr.industries[ind][lang]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="mb-8">
        <label className="block text-sm mb-2" style={{ color: "#6B7280" }}>
          {tr.inputs.grossMargin[lang]}
        </label>
        <Select
          value={margin || undefined}
          onValueChange={(v) => onMarginChange(v as GrossMargin)}
        >
          <SelectTrigger
            className="w-full"
            style={{
              borderColor: "#E5E7EB",
              borderRadius: 8,
              padding: "12px 16px",
              height: "auto",
              fontSize: 14,
            }}
          >
            <SelectValue placeholder={tr.inputs.selectMargin[lang]} />
          </SelectTrigger>
          <SelectContent>
            {MARGINS.map((m) => (
              <SelectItem key={m} value={m}>
                {tr.margins[m][lang]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="mb-6">
        <label className="block text-sm mb-2" style={{ color: "#6B7280" }}>
          {tr.inputs.email[lang]}
        </label>
        <input
          type="email"
          value={email}
          onChange={(e) => onEmailChange(e.target.value)}
          placeholder={tr.inputs.emailPlaceholder[lang]}
          className="w-full rounded-lg border text-sm"
          style={{
            borderColor: "#E5E7EB",
            padding: "12px 16px",
            color: "#1A1A1A",
            outline: "none",
          }}
        />
        <p className="mt-1.5" style={{ fontSize: 12, color: "#9CA3AF" }}>
          {tr.inputs.emailHint[lang]}
        </p>
      </div>

      <button
        onClick={onCalculate}
        disabled={!isValid}
        className="w-full font-semibold text-white rounded-lg transition-all"
        style={{
          background: isValid ? "#5936E3" : "#C4B5FD",
          padding: "14px 28px",
          fontSize: 16,
          borderRadius: 8,
          cursor: isValid ? "pointer" : "not-allowed",
          opacity: isValid ? 1 : 0.7,
        }}
      >
        {tr.inputs.calculate[lang]}
      </button>

      {!isValid && (
        <p className="text-center mt-3" style={{ fontSize: 13, color: "#9CA3AF" }}>
          {tr.inputs.fillAll[lang]}
        </p>
      )}
    </div>
  );
}
