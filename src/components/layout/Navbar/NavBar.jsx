import React, { useEffect, useState } from "react";
import { Popover, Tooltip, message, Badge } from "antd";
import { MenuFoldOutlined, MenuUnfoldOutlined, BellOutlined, HeatMapOutlined } from "@ant-design/icons";
import { TbLogout } from "react-icons/tb";
import { useNavigate } from "react-router-dom";
import './Navbar.css';
import axios from "axios";
import Socket from "../../../config/socket";

const NavBar = ({ navIconDisabled, collapsed, setCollapsed }) =>
{
	const navigate = useNavigate();
	const [notificationCount, setNotificationCount] = useState(0);

	const handleLogout = async () =>
	{
		try
		{
			Socket.disconnect();
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

	const handleAddToProject = data =>
	{
		setNotificationCount(data.count);
	};

	useEffect(() =>
	{
		Socket.on("add-to-project", handleAddToProject);

		return () =>
		{
			Socket.off("add-to-project", handleAddToProject);
		};
	});

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
				<Tooltip title="Logout" className="logout-btn">
					<TbLogout size={30} onClick={handleLogout} />
				</Tooltip>
				<Popover placement="bottomRight" title={"Notification"} content={Notification} trigger="click">
					<Badge count={notificationCount} className="navbar-belloutlined-icon">
						<BellOutlined />
					</Badge>
				</Popover>
			</div>
		</div>
	);
};

const Notification = () =>
{
	return (
		<div className="navbar-notification-content">
		</div>
	);
};

export default NavBar;
