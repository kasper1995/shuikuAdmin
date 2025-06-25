/**
 * 脱敏处理：显示前三和后四位，中间用*号隐藏
 * @param value 需要脱敏的字符串
 * @returns 脱敏后的字符串
 */
export function maskValue(value: string | number): string {
  const str = String(value);
  if (str.length <= 7) return str; // 长度不足时不处理
  return str.slice(0, 3) + '*'.repeat(str.length - 7) + str.slice(-4);
} 