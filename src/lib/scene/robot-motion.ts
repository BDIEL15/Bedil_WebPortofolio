/** A slow observational sweep, not a physics or pick-and-place simulation. */
const poses = [
  { time: 0, yaw: 0, shoulder: 0, elbow: 0, wrist: 0, grip: 0 },
  { time: 4, yaw: .10, shoulder: -.13, elbow: .22, wrist: -.05, grip: .025 },
  { time: 8, yaw: -.12, shoulder: .10, elbow: -.18, wrist: .06, grip: .004 },
  { time: 12, yaw: .04, shoulder: -.06, elbow: .12, wrist: .03, grip: .018 },
  { time: 16, yaw: 0, shoulder: 0, elbow: 0, wrist: 0, grip: 0 },
] as const;

export function robotPose(seconds: number) {
  const time = ((seconds % 16) + 16) % 16;
  const index = Math.min(3, Math.floor(time / 4));
  const a = poses[index], b = poses[index + 1];
  const t = (time - a.time) / (b.time - a.time);
  const ease = Math.min(1, Math.max(0, t * t * t * (t * (6 * t - 15) + 10)));
  return {
    yaw: a.yaw + (b.yaw - a.yaw) * ease,
    shoulder: a.shoulder + (b.shoulder - a.shoulder) * ease,
    elbow: a.elbow + (b.elbow - a.elbow) * ease,
    wrist: a.wrist + (b.wrist - a.wrist) * ease,
    grip: a.grip + (b.grip - a.grip) * ease,
  };
}
