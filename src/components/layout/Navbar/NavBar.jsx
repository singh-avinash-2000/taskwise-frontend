import React from "react";
import { Popover } from "antd";
import { MenuFoldOutlined, MenuUnfoldOutlined, UserOutlined, BellOutlined } from "@ant-design/icons";
import { useThemeContext } from "../../../context/ThemeProvider";

import './Navbar.css'

const NavBar = () => {
	const { collapsed, setCollapsed } = useThemeContext();

	return (
		<div className="navbar-notification-main-wrapper">
			<div onClick={() => setCollapsed(!collapsed)} >
				{collapsed ? <MenuUnfoldOutlined className="navbar-menu-icon" /> : <MenuFoldOutlined className="navbar-menu-icon" />}
			</div>
			<div className="navbar-notification-wrapper">
				<Popover placement="bottomRight" title={"Notification"} content={Notification} trigger="click">
					<BellOutlined className="navbar-belloutlined-icon" />
				</Popover>
			</div>
		</div>

	);
};

const Notification = () => {
	return (
		<div className="navbar-notification-content">
		</div>
	);
};

export default NavBar;
