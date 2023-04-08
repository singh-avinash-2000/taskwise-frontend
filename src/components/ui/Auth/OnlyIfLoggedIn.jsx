import React, { useEffect } from 'react';
import { Outlet, useNavigate } from "react-router-dom";
import Socket from "../../../config/socket";

const OnlyIfLoggedIn = () =>
{
	const navigate = useNavigate();
	useEffect(() =>
	{
		const token = localStorage.getItem("accessToken");
		if (!token)
		{
			navigate("/login");
		}
		else
		{
			Socket.connect();
		}

		return () =>
		{
			Socket.disconnect();
		};
	}, []);

	return (
		<Outlet />
	);
};

export default OnlyIfLoggedIn;
