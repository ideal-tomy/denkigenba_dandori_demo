export function fmtDate(d: Date): string {
  const w = ["日", "月", "火", "水", "木", "金", "土"];
  return `${d.getMonth() + 1}月${d.getDate()}日（${w[d.getDay()]}）`;
}

export function parseWorkDate(iso: string): Date {
  return new Date(`${iso}T00:00:00`);
}
