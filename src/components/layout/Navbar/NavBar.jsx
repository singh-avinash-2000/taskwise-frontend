import React, { useEffect, useRef, useState } from "react";
import { Popover, Tooltip, message, Badge, notification } from "antd";
import { MenuFoldOutlined, MenuUnfoldOutlined, BellOutlined, HeatMapOutlined } from "@ant-design/icons";
import { TbLogout } from "react-icons/tb";
import { useNavigate } from "react-router-dom";
import './Navbar.css';
import axios from "axios";
import Notification from "../../ui/Notification/Notification";
import Socket from "../../../config/socket";

const NavBar = ({ navIconDisabled, collapsed, setCollapsed }) =>
{
	const navigate = useNavigate();
	const [notificationCount, setNotificationCount] = useState(0);
	const [popOverOpen, setPopOverOpen] = useState(false);
	const popOverRef = useRef(null);

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

	useEffect(() =>
	{
		Socket.on("collaboration-invite", (data, callback) =>
		{

			console.log(data);
			message.info({ content: "You are invited to collaborate", icon: <BellOutlined /> });
			setNotificationCount(notificationCount + 1);
			callback("success");
		});

		Socket.on("reached-here", (data) =>
		{
			console.log(data);
			message.info({ content: "Your code reached there", icon: <BellOutlined /> });
		});

		return () =>
		{
			Socket.off();
		};
	}, [Socket]);

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
				<Popover placement="bottomRight" content={Notification} trigger="click" popupVisible={popOverOpen}>
					<Badge count={notificationCount} className="navbar-belloutlined-icon">
						<BellOutlined ref={popOverRef} />
					</Badge>
				</Popover>
			</div>
		</div>
	);
};

export default NavBar;
