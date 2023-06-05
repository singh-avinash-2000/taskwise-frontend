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
		return `${seconds}s ago`;
	} else if (minutes < 60)
	{
		return `${minutes}m ago`;
	} else if (hours < 24)
	{
		return `${hours}h ago`;
	} else if (days < 30)
	{
		return `${days}d ago`;
	} else if (months < 12)
	{
		return `${months}mo ago`;
	} else
	{
		return `${years}y ago`;
	}
};

export const formatTimeForChat = (time) =>
{
	const date = new Date(time);
	const hours = date.getHours();
	const minutes = date.getMinutes();
	const amOrPm = hours >= 12 ? 'PM' : 'AM';
	const formattedHours = hours % 12 || 12;
	const month = date.toLocaleString('default', { month: 'short' });
	const day = date.getDate();

	return `${formattedHours}:${padZero(minutes)} ${amOrPm} | ${month} ${day}`;
};

const padZero = (number) =>
{
	return number.toString().padStart(2, '0');
};

