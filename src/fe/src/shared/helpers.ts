const minPropertyValue = 0;
const maxPropertyValue = 10;
const deltaPropertyValue = maxPropertyValue - minPropertyValue;

export const getPercentageValue = (value: number): number => {
  return value * 100 / deltaPropertyValue;
}
