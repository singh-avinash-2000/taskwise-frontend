import React, { useEffect, useRef, useState } from "react";
import { Popover, Tooltip, message, Badge, notification, Divider } from "antd";
import { MenuFoldOutlined, MenuUnfoldOutlined, BellOutlined, HeatMapOutlined } from "@ant-design/icons";
import { TbLogout } from "react-icons/tb";
import { BsThreeDotsVertical } from "react-icons/bs";
import { CgProfile } from "react-icons/cg";
import { useNavigate } from "react-router-dom";
import './Navbar.css';
import axios from "axios";
import Notification from "../../ui/Notification/Notification";
import { getSocketInstance } from "../../../config/socket";
import { axiosClient } from "../../../config/axios";

const NavBar = ({ navIconDisabled, collapsed, setCollapsed }) =>
{
	const navigate = useNavigate();
	const [notificationCount, setNotificationCount] = useState(0);
	const [notifications, setNotifications] = useState([]);
	const [skip, setSkip] = useState(0);
	const popOverRef = useRef(null);
	const [settingsPopover, setSettingsPopover] = useState(false);
	const [newNotifications, setNewNotifications] = useState(true);
	const socket = getSocketInstance();
	const handleLogout = async () =>
	{
		try
		{
			socket.disconnect();
			const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/auth/logout`);
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

	const fetchNotifications = async () =>
	{
		try
		{
			const response = await axiosClient(`/user/notifications?skip=${skip}`);
			if (response.data?.result?.notifications.length)
			{
				setNewNotifications(true);
				setNotifications([...response.data.result?.notifications, ...response.data.result?.notifications, ...response.data.result?.notifications] || []);
				setNotificationCount(response.data.result?.unReadCount);
			}
			else
			{
				setNewNotifications(false);
			}
		} catch (error)
		{
			console.log(error);
			message.error("Something went wrong");
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

	useEffect(() =>
	{
		fetchNotifications();
	}, [skip]);

	useEffect(() =>
	{
		socket.on("new-notification", (data) =>
		{
			message.info({ content: data.message, icon: <BellOutlined /> });
			setNotificationCount(notificationCount + 1);
			setSkip(0);
		});

		return () =>
		{
			socket.off();
		};
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
						<span className="ping-typography" onClick={() => navigate("/")}>PING</span>
					</div>
			}

			<div className="navbar-notification-wrapper">
				<Popover placement="bottomRight" content={<Notification notifications={notifications} setSkip={setSkip} skip={skip} newNotifications={newNotifications} />} trigger="click" onClick={() => setSkip(0)}>
					<Badge count={notificationCount} className="navbar-belloutlined-icon">
						<BellOutlined ref={popOverRef} />
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
