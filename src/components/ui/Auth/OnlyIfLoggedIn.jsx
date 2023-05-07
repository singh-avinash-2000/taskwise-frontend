import React, { useEffect, useState } from 'react';
import { Outlet, useNavigate } from "react-router-dom";
import { getSocketInstance, setAuthToken } from "../../../config/socket";
import { ContextProvider } from "../../../context/ContextProvider";
import { axiosClient } from "../../../config/axios";

const OnlyIfLoggedIn = () =>
{
	const [socketState, setSocketState] = useState(null);
	const navigate = useNavigate();

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
		socketState.connect();
	};

	useEffect(() =>
	{
		const socket = getSocketInstance();
		setSocketState(socket);

		return () => socket.close();
	}, []);

	useEffect(() =>
	{
		if (socketState)
		{
			establishSocketConnection();
			socketState.on("connect", () =>
			{
				console.log("socket connected");
			});

			socketState.on("reconnect", () =>
			{
				console.log("socket reconnected");
			});

			socketState.on('connect_error', async (error) =>
			{
				try
				{
					if (error.message === "TokenExpiredError: jwt expired")
					{
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
		}
	}, [socketState]);

	return (
		<ContextProvider><Outlet /></ContextProvider>
	);
};

export default OnlyIfLoggedIn;
