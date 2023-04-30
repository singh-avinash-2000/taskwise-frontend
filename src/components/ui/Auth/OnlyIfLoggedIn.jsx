import React, { useEffect, useState } from 'react';
import { Outlet, useNavigate } from "react-router-dom";
import { getSocketInstance, setAuthToken } from "../../../config/socket";
import { Skeleton } from 'antd';
import { ContextProvider } from "../../../context/ContextProvider";

const OnlyIfLoggedIn = () =>
{
	const navigate = useNavigate();
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
		});

		socket.connect();

		return () =>
		{
			socket.disconnect();
		};
	}, []);

	return (
		<ContextProvider><Outlet /></ContextProvider>
	);
};

export default OnlyIfLoggedIn;
