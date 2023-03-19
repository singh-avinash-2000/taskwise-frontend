import { NavLink } from "react-router-dom";
import * as rdd from 'react-device-detect';
import { HeatMapOutlined } from '@ant-design/icons';
import { useThemeContext } from "../../context/ThemeProvider";

import "./css/sidebar.css";


const SideBar = (props) =>
{
	return (
		< div id="sidebar" >
			{
				window.location.pathname != "/projects/new-project" && <div style={{ width: '250px', height: '100%', borderRight: '1px solid lightGray', overflow: "auto" }}>
					<div style={{ 'paddingTop': '30px', marginLeft: '55px' }}>
						<HeatMapOutlined className="logo" />
						<span style={{ fontSize: '24px', fontWeight: '700' }}>PING</span>
					</div>
					<div style={{ marginTop: '35px' }}>
						{
							Object.entries(props.data).map(([key, value]) =>
							{
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

const NavHeader = ({ title, children }) =>
{
	return (
		<div style={{ margin: '0px 20px', backgroundColor: 'inherit' }}>
			<span style={{ fontSize: '20px', fontWeight: '600', color: '#BABABA' }}>{title}</span>
			{
				children.map((child) =>
				{
					return (
						<NavItem title={child.title} to={child.to} key={child.title} />
					);
				})
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

		<NavLink to={to}
			style={{ color: 'inherit', textDecoration: "none" }}
			className={
				({ isActive }) => isActive ? "nav-item-active" : ""
			}
			onClick={handleClick}>
			<div id="nav-item-custom">
				<span style={{ fontSize: '16px', fontWeight: '600', color: '#000' }}>{title}</span>
			</div>
		</NavLink>
	);
};
export default SideBar;
