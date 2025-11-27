import { useState } from "react";

export const useFormater = () => {
  const [lang, setLang] = useState("en-KE");
  const [currency, setCurrency] = useState("KES");

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
