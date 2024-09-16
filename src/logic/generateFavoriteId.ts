export function generateFavoriteId(userId: string, teamId: string): string {
  return `${userId}:${teamId}`;
}
