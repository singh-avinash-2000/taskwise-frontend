import React from 'react';
import "./Notification.css";
import { Avatar, message } from "antd";
import { List } from "react-virtualized";
import { axiosClient } from "../../../config/axios";
import { useNavigate } from "react-router-dom";
import { formatRelativeTime } from "../../../config/formatTime";

const Notification = ({ notifications, setUnReadCount, unReadCount, setNotificationPopover, setNotifications }) =>
{
	const navigate = useNavigate();
	const markAsRead = async (notification) =>
	{
		try
		{
			await axiosClient.patch(`/user/notifications/${notification._id}`);
			if (unReadCount > 0)
			{
				setUnReadCount(unReadCount - 1);
			}
			setNotifications(notifications.map((item) => item._id === notification._id ? { ...item, is_read: true } : item));
			navigate(notification.payload.redirect_url);
			setNotificationPopover(false);
		}
		catch (error)
		{
			message.error(error.response.data.message);
		}
	};


	const markAllAsRead = async (_, notifications) =>
	{
		try
		{
			await axiosClient.patch(`/user/notifications/mark-all`);
			setNotifications(notifications.map((notification) => ({ ...notification, is_read: true })));
			setUnReadCount(0);
		}
		catch (error)
		{
			message.error(error.response.data.message);
		}
	};

	const rowRenderer = ({ key, index, style }) =>
	{
		const notification = notifications[index];
		const time_ago = formatRelativeTime(notification.created_at);
		return (
			<div className={notification.is_read ? "notification-card" : "notification-card un-read"} key={key} style={style} onClick={(e) => markAsRead(notification)}>
				<Avatar className="notification-avatar" shape="square" src={notification.payload.initiator_profile} />
				<div className="notification-content">
					<span className="mention-title">{notification.payload.initiator_name}</span>
					<br />
					<span className="notification-body">{notification.payload.message}</span>
					{
						notification.payload.is_actionable &&
						<div className="additional-card">
							<span className="action-title">{notification.payload.action_title}</span>
						</div>
					}
				</div>
				<div className="notification-time">
					<span className="time-ago">{time_ago}</span>
				</div>

			</div>
		);
	};

	return (
		<div className="navbar-notification-content">
			<div className="notification-header">
				<span className="notification-typography">Notifications</span>
				<span className="mark-read" onClick={(e) => markAllAsRead(e, notifications)}>Mark all as read</span>
			</div>
			<hr />
			<div >
				<List
					width={300}
					height={400}
					className="notification-container"
					rowCount={notifications.length}
					rowHeight={100}
					rowRenderer={rowRenderer}
				/>
			</div>
		</div>
	);
};

export default Notification;
