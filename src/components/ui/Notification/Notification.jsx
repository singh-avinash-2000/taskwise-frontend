import React, { useEffect, useState } from 'react';
import "./Notification.css";
import { Avatar } from "antd";
import { List } from "react-virtualized";
import { axiosClient } from "../../../config/axios";

const Notification = ({ notifications }) =>
{
	const rowRenderer = ({ key, index, style }) =>
	{
		const notification = notifications[index];
		return (
			<div className={!notification.is_read ? "notification-card" : "notification-card un-read"} key={key} style={style}>
				<Avatar className="notification-avatar" shape="square" src={notification.type == "USER" ? notification.payload.initiator_profile : ""} />
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
			</div>
		);
	};

	return (
		<div className="navbar-notification-content">
			<div className="notification-header">
				<span className="notification-typography">Notifications</span>
				<span className="mark-read">Mark all as read</span>
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
