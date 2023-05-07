export const formatRelativeTime = (createdAt) =>
{
	const now = new Date();
	const createdAtDate = new Date(createdAt);
	const timeDiff = now.getTime() - createdAtDate.getTime();
	const seconds = Math.round(timeDiff / 1000);
	const minutes = Math.round(seconds / 60);
	const hours = Math.round(minutes / 60);
	const days = Math.round(hours / 24);
	const months = Math.round(days / 30);
	const years = Math.round(months / 12);

	if (seconds < 60)
	{
		return `${seconds}s`;
	} else if (minutes < 60)
	{
		return `${minutes}m`;
	} else if (hours < 24)
	{
		return `${hours}h`;
	} else if (days < 30)
	{
		return `${days}d`;
	} else if (months < 12)
	{
		return `${months}mo`;
	} else
	{
		return `${years}y`;
	}
}

