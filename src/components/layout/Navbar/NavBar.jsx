import React, { useEffect, useState } from "react";
import { Popover, message, Badge, Divider } from "antd";
import { MenuFoldOutlined, MenuUnfoldOutlined, BellOutlined, HeatMapOutlined } from "@ant-design/icons";
import { TbLogout } from "react-icons/tb";
import { BsThreeDotsVertical } from "react-icons/bs";
import { CgProfile } from "react-icons/cg";
import { useNavigate } from "react-router-dom";
import './Navbar.css';

import Notification from "../../ui/Notification/Notification";
import { getSocketInstance } from "../../../config/socket";
import { axiosClient } from "../../../config/axios";

const NavBar = ({ navIconDisabled, collapsed, setCollapsed }) =>
{
	const navigate = useNavigate();
	const [settingsPopover, setSettingsPopover] = useState(false);
	const [notificationPopover, setNotificationPopover] = useState(false);
	const [unReadCount, setUnReadCount] = useState(0);
	const [notifications, setNotifications] = useState([]);
	const socket = getSocketInstance();

	const handleLogout = async () =>
	{
		try
		{
			socket.disconnect();
			const response = await axiosClient.get(`${process.env.REACT_APP_BASE_URL}/auth/logout`);
			localStorage.removeItem("accessToken");
			message.success(response.data.message);
			navigate("/login", {
				state: { loggedOut: true }
			});
		}
		catch (error)
		{
			message.error(error.response.data.message);
		}
	};

	const handleAccountNavigate = () =>
	{
		navigate(`/user/profile`);
		setSettingsPopover(false);
	};

	const handleOpenChange = (newOpen) =>
	{
		setSettingsPopover(newOpen);
	};

	const handleNotificationOpenChange = (newOpen) =>
	{
		setNotificationPopover(newOpen);
	};

	const fetchNotifications = async () =>
	{
		const response = await axiosClient.get(`/user/notifications`);
		const notifications = response.data.result.notifications;
		setUnReadCount(response.data.result.unReadCount);
		setNotifications(notifications);
	};


	useEffect(() =>
	{
		fetchNotifications();
		socket.on("new-notification", (data) =>
		{
			message.info({ content: data.message, icon: <BellOutlined /> });
			fetchNotifications();
		});

		socket.on("chat-message", (data) =>
		{
			console.log('sa');
			message.info({ content: `New Chat message from ${data.project_name}`, icon: <BellOutlined /> });
		});

		return () =>
		{
			socket.off();
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const settingsContent = (
		<div className="settings-content">
			<div className="account-wrapper" onClick={handleAccountNavigate}>
				<CgProfile size={30} />
				<span style={{ fontWeight: "bold" }}>Profile</span>
			</div>
			<Divider className="settings-divider" />
			<div className="logout-wrapper" onClick={handleLogout}>
				<TbLogout size={30} />
				<span style={{ fontWeight: "bold" }}>Logout</span>
			</div>
		</div>
	);

	return (
		<div className="navbar-notification-main-wrapper">
			{
				!navIconDisabled ? <div onClick={() => setCollapsed(!collapsed)} >
					{collapsed ? <MenuUnfoldOutlined className="navbar-menu-icon" /> : <MenuFoldOutlined className="navbar-menu-icon" />}
				</div>
					:
					<div className="logo-container" >
						<HeatMapOutlined className="logo" onClick={() => navigate("/")} />
						<span className="ping-typography" onClick={() => navigate("/")}>Task Wise</span>
					</div>
			}

			<div className="navbar-notification-wrapper">
				<Popover placement="bottomRight" open={notificationPopover} onOpenChange={handleNotificationOpenChange} content={<Notification setNotificationPopover={setNotificationPopover} notifications={notifications} setUnReadCount={setUnReadCount} unReadCount={unReadCount} setNotifications={setNotifications} />} trigger="click">
					<Badge count={unReadCount} className="navbar-belloutlined-icon">
						<BellOutlined />
					</Badge>
				</Popover>
				<Popover placement="bottomRight" content={settingsContent} trigger="click" open={settingsPopover} onOpenChange={handleOpenChange}>
					<BsThreeDotsVertical size={20} />
				</Popover>
			</div >
		</div >
	);
};

export default NavBar;
