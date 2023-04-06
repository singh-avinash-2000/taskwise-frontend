import React from 'react';
import NavBar from "../Navbar/NavBar";
import { Outlet } from "react-router-dom";

const DashboardLayout = () =>
{
	return (
		<div>
			<NavBar navIconDisabled={true} />
			<div className="layout-outlet-div">
				<Outlet />
			</div>
		</div>
	);
};

export default DashboardLayout;
