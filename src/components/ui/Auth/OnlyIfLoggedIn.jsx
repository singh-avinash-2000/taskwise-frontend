import React, { useEffect } from 'react';
import { Outlet, useNavigate } from "react-router-dom";
import Socket from "../../../config/socket";
import { useStateContext } from "../../../context/ContextProvider";

const OnlyIfLoggedIn = () =>
{
	const navigate = useNavigate();
	const { userDetails, loading } = useStateContext();

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
