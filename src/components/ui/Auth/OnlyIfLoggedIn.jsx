import React from 'react';
import { Outlet, useNavigate } from "react-router-dom";

const OnlyIfLoggedIn = () =>
{
	const navigate = useNavigate();
	const token = localStorage.getItem("accessToken");

	if (!token)
	{
		navigate("/login");
	}

	return (
		<Outlet />
	);
};

export default OnlyIfLoggedIn;
