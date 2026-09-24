export type Camera = readonly [number, number, number];
export type DeviceId = "inbox" | "plan" | "prep";

export const scenes: {
  title: string;
  caption: string;
  motion: string;
  duration: number;
  camera: Camera;
  stars: readonly DeviceId[];
}[] = [
  {
    title: "依頼を開く",
    caption: "届いたメールとFAXの依頼が並びます。",
    motion: "依頼を開く",
    duration: 5000,
    camera: [264, 175, 1.02],
    stars: ["inbox"],
  },
  {
    title: "案へ",
    caption: "開くと、取り込んだ内容と段取り案が出ます。",
    motion: "案へ",
    duration: 4500,
    camera: [516, 175, 0.9],
    stars: ["inbox", "plan"],
  },
  {
    title: "日付を見る",
    caption: "依頼文の日付を、根拠で確認します。",
    motion: "日付を見る",
    duration: 5500,
    camera: [768, 175, 1.0],
    stars: ["plan"],
  },
  {
    title: "原文を見る",
    caption: "原文と、取り込んだ日付を突き合わせます。",
    motion: "原文を見る",
    duration: 5500,
    camera: [768, 175, 1.0],
    stars: ["plan"],
  },
  {
    title: "準備へ",
    caption: "確定すると、申請と人員の準備が並びます。",
    motion: "準備へ",
    duration: 4500,
    camera: [1020, 175, 0.9],
    stars: ["plan", "prep"],
  },
  {
    title: "書類をそろえる",
    caption: "書類をそろえます。提出はしません。",
    motion: "書類をそろえる",
    duration: 5500,
    camera: [1272, 175, 0.98],
    stars: ["prep"],
  },
];

export const totalDuration = scenes.reduce((sum, scene) => sum + scene.duration, 0);

export function storyFrame(time: number) {
  let elapsed = ((time % totalDuration) + totalDuration) % totalDuration;
  let index = 0;
  while (index < scenes.length - 1 && elapsed >= scenes[index].duration) {
    elapsed -= scenes[index++].duration;
  }
  const previous = scenes[index === 0 ? 0 : index - 1];
  const next = scenes[index];
  const t = Math.min(1, elapsed / 1200);
  const ease = t * t * (3 - 2 * t);
  const camera = next.camera.map(
    (value, i) => previous.camera[i] + (value - previous.camera[i]) * ease,
  ) as unknown as Camera;
  return { index, elapsed, camera, stars: next.stars, previousStars: previous.stars, ease };
}
