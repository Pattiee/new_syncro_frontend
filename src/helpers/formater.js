export const currencyFormater = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    currencySign: 'accounting',
    maximumFractionDigits: 2,
});

export const percentageFormater = new Intl.NumberFormat('en-US', {
    style: 'percent',
});