export default function (timestamp: string): string {
  const now: Date = new Date();
  const diff: number = Math.floor((now.getTime() - new Date(timestamp).getTime()) / 1000);

  if (diff < 60) {
    return `${diff} second${diff === 1 ? '' : 's'} ago`;
  } else if (diff < 3600) {
    const minutes: number = Math.floor(diff / 60);
    return `${minutes} minute${minutes === 1 ? '' : 's'} ago`;
  } else if (diff < 86400) {
    const hours: number = Math.floor(diff / 3600);
    return `${hours} hour${hours === 1 ? '' : 's'} ago`;
  } else if (diff < 2592000) {
    const days: number = Math.floor(diff / 86400);
    return `${days} day${days === 1 ? '' : 's'} ago`;
  } else if (diff < 31536000) {
    const months: number = Math.floor(diff / 2592000);
    return `${months} month${months === 1 ? '' : 's'} ago`;
  } else {
    const years: number = Math.floor(diff / 31536000);
    return `${years} year${years === 1 ? '' : 's'} ago`;
  }
}
