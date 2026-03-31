// Strategy Pattern: Tax calculation with bracket-based strategy
// Separated from UI for testability and reuse

interface TaxBracket {
  limit: number;
  rate: number;
}

const THAI_TAX_BRACKETS: TaxBracket[] = [
  { limit: 150000, rate: 0 },
  { limit: 300000, rate: 0.05 },
  { limit: 500000, rate: 0.1 },
  { limit: 750000, rate: 0.15 },
  { limit: 1000000, rate: 0.2 },
  { limit: 2000000, rate: 0.25 },
  { limit: 5000000, rate: 0.3 },
  { limit: Infinity, rate: 0.35 },
];

export const TAX_BRACKETS_DISPLAY = [
  { income: "1 - 150,000", rate: "ยกเว้น" },
  { income: "150,001 - 300,000", rate: "5%" },
  { income: "300,001 - 500,000", rate: "10%" },
  { income: "500,001 - 750,000", rate: "15%" },
  { income: "750,001 - 1,000,000", rate: "20%" },
  { income: "1,000,001 - 2,000,000", rate: "25%" },
  { income: "2,000,001 - 5,000,000", rate: "30%" },
  { income: "5,000,001+", rate: "35%" },
];

export function calculateTax(income: number): { tax: number; effectiveRate: number } {
  let tax = 0;
  let remaining = income;
  let prev = 0;

  for (const bracket of THAI_TAX_BRACKETS) {
    const taxable = Math.min(remaining, bracket.limit - prev);
    if (taxable <= 0) break;
    tax += taxable * bracket.rate;
    remaining -= taxable;
    prev = bracket.limit;
  }

  const effectiveRate = income > 0 ? (tax / income) * 100 : 0;
  return { tax, effectiveRate };
}
