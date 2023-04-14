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
import Socket from "../../../config/socket";
import { useStateContext } from "../../../context/ContextProvider";

const NavBar = ({ navIconDisabled, collapsed, setCollapsed }) =>
{
	const navigate = useNavigate();
	const [notificationCount, setNotificationCount] = useState(0);
	const [popOverOpen, setPopOverOpen] = useState(false);
	const popOverRef = useRef(null);
	const [settingsPopover, setSettingsPopover] = useState(false);
	const { userDetails } = useStateContext();


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

	const handleAccountNavigate = () =>
	{
		navigate(`/user/profile`);
		setSettingsPopover(false);
	};

	const handleOpenChange = (newOpen) =>
	{
		setSettingsPopover(newOpen);
	};

	const settingsContent = (
		<div className="settings-content">
			{/* <Tooltip title="Account"> */}
			<div className="account-wrapper" onClick={handleAccountNavigate}>
				<CgProfile size={30} />
				<span>Account</span>
			</div>
			{/* </Tooltip> */}
			<Divider className="settings-divider" />
			{/* <Tooltip title="Logout"> */}
			<div className="logout-wrapper" onClick={handleLogout}>
				<TbLogout size={30} />
				<span>Logout</span>
			</div>
			{/* </Tooltip> */}
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
				<Tooltip title="Notifications" placement="top">
					<Popover placement="bottomRight" content={Notification} trigger="click" popupVisible={popOverOpen}>
						<Badge count={notificationCount} className="navbar-belloutlined-icon">
							<BellOutlined ref={popOverRef} />
						</Badge>
					</Popover>
				</Tooltip>
				<Tooltip title="Settings">
					<Popover placement="bottomRight" content={settingsContent} trigger="click" open={settingsPopover} onOpenChange={handleOpenChange}>
						<BsThreeDotsVertical size={20} />
					</Popover>
				</Tooltip>
			</div>
		</div>
	);
};

export default NavBar;
