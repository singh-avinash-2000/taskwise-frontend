import React, { useEffect, useState } from 'react';
import { Outlet, useNavigate } from "react-router-dom";
import { getSocketInstance, setAuthToken } from "../../../config/socket";
import { Skeleton } from 'antd';
import { ContextProvider } from "../../../context/ContextProvider";

const OnlyIfLoggedIn = () =>
{
	const navigate = useNavigate();
	const [loading, setLoading] = useState(true);
	const socket = getSocketInstance();

	useEffect(() =>
	{
		const token = localStorage.getItem("accessToken");

		if (!token)
		{
			const path = window.location.pathname;
			navigate("/login?redirect=" + path);
		}

		setAuthToken(token);
		console.log("socket connection started...");

		socket.on("connect", () =>
		{
			console.log("socket connected");
			setLoading(false);
		});

		socket.connect();

		return () =>
		{
			socket.disconnect();
		};
	}, []);

	if (loading)
	{
		return <Skeleton active />;
	}
	else 
	{
		return (
			<ContextProvider><Outlet /></ContextProvider>
		);
	}
};

export default OnlyIfLoggedIn;
