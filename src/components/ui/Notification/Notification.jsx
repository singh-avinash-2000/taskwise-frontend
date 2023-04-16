import React, { useEffect, useState, useRef } from 'react';
import "./Notification.css";
import { Avatar, Button } from "antd";
import { CheckOutlined, CloseOutlined } from "@ant-design/icons";
import Socket from "../../../config/socket";
import { debounce } from "lodash";
import { axiosClient } from "../../../config/axios";

const Notification = (popOverOpen) =>
{
	const [callApi, setCallApi] = useState(false);
	const [skip, setSkip] = useState(0);
	const [unReadCount, setUnReadCount] = useState(0);
	const [notifications, setNotifications] = useState([]);

	const handleScroll = (event) =>
	{
		const { scrollTop, scrollHeight, clientHeight } = event.target;

		if (scrollTop === 0)
		{
			console.log("TOP");
			setSkip(0);
			setCallApi(!callApi);
			return;
		}

		if (scrollTop + clientHeight === scrollHeight)
		{
			console.log("load more");
			setSkip(skip + 15);
			setCallApi(!callApi);
			return;
		}
	};

	const fetchNotifications = async () =>
	{
		const response = await axiosClient(`/user/notifications?skip=${skip}`);
		setNotifications(response.data.result?.notifications || []);
		setUnReadCount(response.data.result?.unReadCount || []);
	};

	useEffect(() =>
	{
		fetchNotifications();
	}, [callApi]);

	useEffect(() =>
	{
		fetchNotifications();
	}, []);

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
