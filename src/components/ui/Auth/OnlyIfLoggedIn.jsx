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
			if (!loading)
			{
				console.log(userDetails);
				Socket.connect();
				Socket.emit("user-connected", userDetails._id);
			}
		}

		return () =>
		{
			Socket.disconnect();
		};
	}, [loading]);

	return (
		<Outlet />
	);
};

export default OnlyIfLoggedIn;
