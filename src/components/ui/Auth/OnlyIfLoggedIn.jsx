import React, { useEffect } from 'react';
import { Outlet, useNavigate } from "react-router-dom";
import Socket from "../../../config/socket";
import { useStateContext } from "../../../context/ContextProvider";
import { Skeleton } from 'antd';

const OnlyIfLoggedIn = () =>
{
	const navigate = useNavigate();
	const { userDetails, loading } = useStateContext();

	useEffect(() =>
	{
		const token = localStorage.getItem("accessToken");

		if (!token)
		{
			const path = window.location.pathname;
			navigate("/login?redirect=" + path);
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

	if (loading)
	{
		return <Skeleton active />;
	}
	else 
	{
		return (
			<Outlet />
		);
	}
};

export default OnlyIfLoggedIn;
