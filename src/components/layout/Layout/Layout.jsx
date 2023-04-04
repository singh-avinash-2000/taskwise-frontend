import React, { useEffect, useState } from 'react';
import { debounce } from "lodash";
import { Outlet } from "react-router-dom";

import NavBar from "../Navbar/NavBar";

import './Layout.css';

import { useThemeContext } from "../../../context/ThemeProvider";

// import initializeInterceptor from '../../../config/axios';

const MainLayout = (props) =>
{
	const [position, setPosition] = useState('relative');
	const { collapsed, setScreenHeight, setScreenWidth, setCollapsed } = useThemeContext();

	useEffect(() =>
	{
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

			setScreenHeight(window.innerHeight - 65);
			setScreenWidth(window.innerWidth);

		}, 500);

		handleResize();
		// initializeInterceptor();

		window.addEventListener("resize", handleResize);

		return () => window.removeEventListener("resize", handleResize);
	}, []);  // eslint-disable-line react-hooks/exhaustive-deps

	return (
		<>
			<div>
				<NavBar navIconDisabled={props.navIconDisabled} />
				<div className="sidebar-layout">
					{
						!collapsed && !props.sidebarDisabled &&
						<props.sidebar data={props.sidebarData} />
					}

					<div style={{ position: position }} className="layout-outlet-wrapper">
						<div className="layout-outlet-div">  {/* Better class names can be given */}
							<div className="layout-outlet-div">
								<Outlet />
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	);
};

export default MainLayout;

