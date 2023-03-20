import React, { useEffect, useState } from 'react';
import { debounce } from "lodash";
import { Outlet } from "react-router-dom";

import NavBar from "./NavBar";

import { useThemeContext } from "../../context/ThemeProvider";

import initializeInterceptor from '../../config/axios';

const MainLayout = (props) =>
{
	const [position, setPosition] = useState('relative');
	const { collapsed, screenHeight, setScreenHeight, setScreenWidth, setCollapsed } = useThemeContext();

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
		initializeInterceptor();

		window.addEventListener("resize", handleResize);

		return () => window.removeEventListener("resize", handleResize);
	}, []);  // eslint-disable-line react-hooks/exhaustive-deps

	return (
		<>
			<div>
				<NavBar />
				<div style={{ display: 'flex', height: screenHeight, marginTop: '2px' }}>
					{
						!collapsed &&
						<props.sidebar data={props.sidebarData} />
					}

					<div style={{ overflow: 'auto', width: '100%', position: position }}>
						<div style={{ width: '100%', backgroundColor: 'var(--lightgreen)', zIndex: -1, paddingTop: "15px" }}>
							<div style={{ padding: "0px 30px" }}>
								<Outlet />
							</div>
							{/* <div style={{ backgroundColor: 'var(--darkblue)' }}>
								<props.footer />
							</div> */}
						</div>
					</div>
				</div>
			</div>
		</>
	);
};

export default MainLayout;

