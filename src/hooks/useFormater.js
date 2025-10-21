import React, { useState } from 'react'

export const useFormater = () => {
    const [lang, setLang] = useState('en-KE');
    const [currency, setCurrency] = useState('KES');
    
    const currencyFormater = new Intl.NumberFormat(lang, {
        style: 'currency',
        currency: currency,
        currencySign: 'accounting',
        maximumFractionDigits: 2,
    });
    
    const percentageFormater = new Intl.NumberFormat(lang, {
        style: 'percent',
    });

    return { currencyFormater, percentageFormater }
}
