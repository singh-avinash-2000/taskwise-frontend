import React, { useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from "react-router-dom";
// import axios from "axios";

const OnlyIfNotLoggedIn = () =>
{
	const navigate = useNavigate();
	// const location = useLocation();/

	// const fetchRefreshToken = async () =>
	// {
	// 	const response = await axios.create({
	// 		withCredentials: true
	// 	}).get(process.env.REACT_APP_BASE_URL + "/auth/refresh");

	// 	let newToken = response.data.result.accessToken;
	// 	localStorage.setItem("accessToken", newToken);

	// 	navigate("/");
	// };

	useEffect(() =>
	{
		let token = localStorage.getItem("accessToken");
		// const loggedOut = location.state?.loggedOut || false;

		if (token)
		{
			navigate("/");
		}
	}, []);

	return (
		<Outlet />
	);
};

export default OnlyIfNotLoggedIn;
