import React, { useEffect, useState } from 'react';
import { debounce } from "lodash";
import { Outlet } from "react-router-dom";

import NavBar from "./components/layout/NavBar";
import SideBar from "./components/layout/SideBar";
import CustomFooter from "./components/layout/Footer";

import { useThemeContext } from "./context/ThemeProvider";

const App = () =>
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

			console.log(window.innerHeight);
			setScreenHeight(window.innerHeight - 65);
			setScreenWidth(window.innerWidth);

		}, 500);
		handleResize();

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
						<SideBar />
					}

					<div style={{ overflow: 'auto', width: '100%', position: position }}>
						<div style={{ width: '100%', backgroundColor: 'var(--lightgreen)', zIndex: -1, paddingTop: "25px" }}>
							<div style={{ padding: "10px" }}>
								<Outlet />
							</div>
							<div style={{ backgroundColor: 'var(--darkgreen)' }}>
								<CustomFooter />
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	);
};

export default App;
