import React, { useEffect } from 'react';
import { useNavigate } from "react-router-dom";

const Redirect = (props) =>
{
	let navigate = useNavigate();

	useEffect(() =>
	{
		const accessToken = localStorage.getItem("accessToken");

		if (props.restricted && !accessToken)
		{
			navigate(props.redirect);
		}

		// if (accessToken)
		// {
		// 	navigate(-1);
		// }

	}, []);

	return (
		<props.component />
	);
};

export default Redirect;
