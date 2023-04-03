import React from "react";
import { Popover, Tooltip, message } from "antd";
import { MenuFoldOutlined, MenuUnfoldOutlined, UserOutlined, BellOutlined } from "@ant-design/icons";
import { AiOutlineLogout } from "react-icons/ai";
import { useThemeContext } from "../../../context/ThemeProvider";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import './Navbar.css';

const NavBar = () =>
{
	const { collapsed, setCollapsed } = useThemeContext();
	const routes = useNavigate();

	const handleLogout = async () =>
	{
		try
		{
			const response = await axios.post(process.env.REACT_APP_BASE_URL + "/auth/logout");
			localStorage.removeItem("accessToken");
			message.success(response.data.message);
			routes("/login");
		}
		catch (error)
		{
			message.error(error.response.data.message);
		}


	};

	async function testRefresh()
	{
		try
		{
			const response = await axios.get(process.env.REACT_APP_BASE_URL + "/projects");

		} catch (error)
		{
			console.log("error: ", error);
		}
	}


	return (
		<div className="navbar-notification-main-wrapper">
			<div onClick={() => setCollapsed(!collapsed)} >
				{collapsed ? <MenuUnfoldOutlined className="navbar-menu-icon" /> : <MenuFoldOutlined className="navbar-menu-icon" />}
			</div>
			<div className="navbar-notification-wrapper">
				<button onClick={testRefresh}>Project data</button>
				<Tooltip title="Logout" className="logout-btn">
					<AiOutlineLogout size={30} onClick={handleLogout} />
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
