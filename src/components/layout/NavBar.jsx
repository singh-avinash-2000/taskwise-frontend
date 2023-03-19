import React from "react";
import { Popover } from "antd";
import { MenuFoldOutlined, MenuUnfoldOutlined, UserOutlined, BellOutlined } from "@ant-design/icons";
import { useThemeContext } from "../../context/ThemeProvider";

const styles = {
	menuIcon: {
		fontSize: "25px",
		padding: "20px",
		cursor: "pointer",
		marginLeft: "25px"
	},
	icon: {
		fontSize: "25px",
		padding: "20px",
		cursor: "pointer"
	},
	navBar: {
		display: "flex",
		justifyContent: "space-between"
	}
};

const NavBar = () =>
{
	const { collapsed, setCollapsed } = useThemeContext();

	return (
		<div style={styles.navBar}>
			<div onClick={() => setCollapsed(!collapsed)} >
				{collapsed ? <MenuUnfoldOutlined style={styles.menuIcon} /> : <MenuFoldOutlined style={styles.menuIcon} />}
			</div>
			<div style={{ marginRight: "25px" }}>
				<Popover placement="bottomRight" title={"Notification"} content={Notification} trigger="click">
					<BellOutlined style={styles.icon} />
				</Popover>
			</div>
		</div>

	);
};

const Notification = () =>
{
	return (
		<div style={{ height: "50%", width: "30%" }}>
		</div>
	);
};

export default NavBar;
