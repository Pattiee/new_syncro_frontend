import { useState } from "react";

// Define a structured return contract interface for the formatter instances
export interface FormaterResult {
  currencyFormater: Intl.NumberFormat;
  percentageFormater: Intl.NumberFormat;
  dateFormater: Intl.DateTimeFormat;
}

export const useFormater = (): FormaterResult => {
  const [lang] = useState<string>("en-KE");
  const [currency] = useState<string>("KES");

  const currencyFormater = new Intl.NumberFormat(lang, {
    style: "currency",
    currency: currency,
    currencySign: "accounting",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });

  const percentageFormater = new Intl.NumberFormat(lang, {
    style: "percent",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });

  const dateFormater = new Intl.DateTimeFormat(lang, {
    dateStyle: "full",
    formatMatcher: "best fit",
  });

  return { currencyFormater, percentageFormater, dateFormater };
};