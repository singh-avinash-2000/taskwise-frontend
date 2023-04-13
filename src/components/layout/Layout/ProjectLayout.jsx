import React, { useEffect, useState } from 'react';
import { debounce } from "lodash";
import { Outlet } from "react-router-dom";
import NavBar from "../Navbar/NavBar";
import SideBar from "../Sidebar/SideBar";
import './ProjectLayout.css';

const MainLayout = ({ onDashboard }) =>
{
	const [position, setPosition] = useState('relative');
	const [screenHeight, setScreenHeight] = useState(700);
	const [collapsed, setCollapsed] = useState(false);

	const handleResize = debounce(() =>
	{
		if (window.innerWidth <= 950)
		{
			setPosition('absolute');
			setCollapsed(true);
		}
		else
		{
			setPosition('relative');
			setCollapsed(false);
		}

		setScreenHeight(window.innerHeight - 70);
	}, 500);

	useEffect(() =>
	{
		handleResize();
		window.addEventListener("resize", handleResize);

		return () => window.removeEventListener("resize", handleResize);
	}, []);

	return (
		<>
			<div>
				<NavBar navIconDisabled={onDashboard} setCollapsed={setCollapsed} collapsed={collapsed} />
				<div className="sidebar-layout" style={{ height: screenHeight }}>
					{
						!collapsed && !onDashboard &&
						<SideBar setCollapsed={setCollapsed} />
					}

					<div style={{ position: position }} className="layout-outlet-wrapper">
						<div className="layout-outlet-div">
							<Outlet />
						</div>
					</div>
				</div>
			</div>
		</>
	);
};

export default MainLayout;

