import { NavLink } from "react-router-dom";
import * as rdd from 'react-device-detect';
import { HeatMapOutlined } from '@ant-design/icons';
import { useThemeContext } from "../../../context/ThemeProvider";

import "./Sidebar.css";


const SideBar = (props) => {
	return (
		<div id="sidebar" >
			{
				window.location.pathname != "/projects/new-project" && <div className="sidebar-wrapper">
					<div className="sidebar-logo-wrapper">
						<HeatMapOutlined className="logo" />
						<span className="ping-typography">PING</span>
					</div>
					<div className="nav-entries">
						{
							Object.entries(props.data).map(([key, value]) => {
								return (
									<NavHeader title={key} children={value} key={key} />
								);
							})
						}
					</div>
				</div>
			}

		</div >
	);
};

const NavHeader = ({ title, children }) => {
	return (
		<div className="nav-header-wrapper">
			<span className="nav-header-title">{title}</span>
			{
				children.map((child) => {
					return (
						<NavItem title={child.title} to={child.to} key={child.title} />
					);
				})
			}
		</div>
	);
};

const NavItem = ({ title, to }) => {

	const { screenWidth, setCollapsed } = useThemeContext();

	const handleClick = () => {
		if (screenWidth < 950 || rdd.isMobile) {
			setCollapsed(true);
		}
	};

	return (

		<NavLink to={to}
			className={
				({ isActive }) => isActive ? "nav-item-active nav-item-fixed-style" : "nav-item-fixed-style"
			}
			onClick={handleClick}>
			<div id="nav-item-custom">
				<span className="nav-item-custom-span">{title}</span>
			</div>
		</NavLink>
	);
};
export default SideBar;
