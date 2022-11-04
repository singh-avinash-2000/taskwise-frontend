import { NavLink } from "react-router-dom";
import * as rdd from 'react-device-detect';

import { useThemeContext } from "../../context/ThemeProvider";
import data from "../../config/sidebar.json";
import "./css/sidebar.css";


const SideBar = () =>
{
	return (
		<div id="sidebar">
			<div style={{ width: '250px', height: '100%', borderRight: '1px solid lightGray', overflow: "auto" }}>
				<div style={{ textAlign: 'center', 'paddingTop': '50px' }}>
					<span style={{ fontSize: '24px', fontWeight: '700' }}>Kheera</span>
				</div>
				<div style={{ marginTop: '75px' }}>
					{
						Object.entries(data).map(([key, value]) =>
						{
							return (
								<NavHeader title={key} children={value} key={key} />
							);
						})
					}
				</div>
			</div>
		</div>
	);
};

const NavHeader = ({ title, children }) =>
{
	return (
		<div style={{ margin: '0px 20px', backgroundColor: 'inherit' }}>
			<span style={{ fontSize: '20px', fontWeight: '600', color: '#BABABA' }}>{title}</span>
			{
				children.map((child) => (
					<NavItem title={child.title} to={child.to} key={child.title} />
				))
			}
		</div>
	);
};

const NavItem = ({ title, to }) =>
{

	const { screenWidth, setCollapsed } = useThemeContext();

	const handleClick = () =>
	{
		if (screenWidth < 950 || rdd.isMobile)
		{
			setCollapsed(true);
		}
	};

	return (

		<NavLink to={to} style={{ color: 'inherit' }} className={({ isActive }) =>
			isActive ? "nav-item-active" : ""
		} onClick={handleClick}>
			<div id="nav-item-custom">
				<span style={{ fontSize: '16px', fontWeight: '600', color: '#000' }}>{title}</span>
			</div>
		</NavLink>
	);
};
export default SideBar;
