import React, { useEffect, useState } from 'react';
import { Outlet, useNavigate } from "react-router-dom";
import { getSocketInstance, setAuthToken } from "../../../config/socket";
import { Skeleton } from 'antd';
import { ContextProvider } from "../../../context/ContextProvider";
import { axiosClient } from "../../../config/axios";

const OnlyIfLoggedIn = () =>
{
	const navigate = useNavigate();
	const socket = getSocketInstance();
	const path = window.location.pathname;

	const establishSocketConnection = () =>
	{
		const token = localStorage.getItem("accessToken");

		if (!token)
		{
			navigate("/login?redirect=" + path);
			return;
		}
		console.log("socket connection started...");
		setAuthToken(token);
		console.log("socket auth token set");
		socket.connect();
	};

	useEffect(() =>
	{
		establishSocketConnection();

		socket.on("connect", () =>
		{
			console.log("socket connected");
		});

		socket.on('connect_error', async (error) =>
		{
			try
			{
				if (error.message === "TokenExpiredError: jwt expired")
				{
					console.log("socket");
					const responseFromRefresh = await axiosClient.get('/auth/refresh');
					localStorage.setItem("accessToken", responseFromRefresh.data?.result?.accessToken);
					establishSocketConnection();
				}
				else
				{
					localStorage.removeItem("accessToken");
					navigate("/login?redirect_url=" + path);
				}
			} catch (error)
			{
				localStorage.removeItem("accessToken");
				navigate("/login?redirect_url=" + path);
			}
		});

		return () =>
		{
			socket.disconnect();
		};
	}, [socket]);

	return (
		<ContextProvider><Outlet /></ContextProvider>
	);
};

export default OnlyIfLoggedIn;
