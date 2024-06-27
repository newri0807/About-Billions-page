export function formatNetWorth(netWorth: number): string {
    const billion = Math.round(netWorth / 1000);
    return `${billion} Billion`;
}
