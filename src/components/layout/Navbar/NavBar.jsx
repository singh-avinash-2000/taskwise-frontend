import React from "react";
import { Popover, Tooltip, message, Button } from "antd";
import { MenuFoldOutlined, MenuUnfoldOutlined, BellOutlined, HeatMapOutlined } from "@ant-design/icons";
import { TbLogout } from "react-icons/tb";
import { useNavigate } from "react-router-dom";
import './Navbar.css';
import axios from "axios";

const NavBar = ({ navIconDisabled, collapsed, setCollapsed }) =>
{
	const navigate = useNavigate();
	const handleLogout = async () =>
	{
		try
		{
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
					<BellOutlined className="navbar-belloutlined-icon" />
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
