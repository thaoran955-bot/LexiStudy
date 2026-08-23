export function calculateRoundedPercentage(completed: number, target: number): number {
  if (!Number.isFinite(completed) || !Number.isFinite(target) || target <= 0) return 0;

  const boundedCompleted = Math.min(Math.max(completed, 0), target);
  return Math.round((boundedCompleted / target) * 100);
}
