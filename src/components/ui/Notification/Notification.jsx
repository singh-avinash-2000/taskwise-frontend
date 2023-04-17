import React, { useEffect } from 'react';
import "./Notification.css";
import { Avatar } from "antd";

const Notification = ({ notifications, setSkip, skip, newNotifications }) =>
{
	const handleScroll = (event) =>
	{
		const { scrollTop, scrollHeight, clientHeight } = event.target;

		if (scrollTop + clientHeight === scrollHeight && newNotifications)
		{
			setSkip(skip + 15);
		}
	};

	return (
		<div className="navbar-notification-content">
			<div className="notification-header">
				<span className="notification-typography">Notifications</span>
				<span className="mark-read">Mark all as read</span>
			</div>
			<hr />
			<div className="notification-container" onScroll={handleScroll}>
				{
					notifications.map((notification, idx) => (
						<div className={!notification.is_read ? "notification-card" : "notification-card un-read"} key={idx}>
							<Avatar className="notification-avatar" shape="square" src={notification.type == "USER" ? notification.payload.initiator_profile : ""} />
							<div className="notification-content">
								<span className="mention-title">{notification.payload.initiator_name}</span>
								<br />
								<span className="notification-body">{notification.payload.message}</span>
								{notification.payload.is_actionable &&
									<div className="additional-card">
										<span className="action-title">{notification.payload.action_title}</span>
									</div>
								}
							</div>
						</div>
					))
				}
			</div>
		</div>
	);
};

export default Notification;
