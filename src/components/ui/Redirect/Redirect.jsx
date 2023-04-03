import React, { useEffect } from 'react';
import { useNavigate } from "react-router-dom";

const Redirect = (props) =>
{
	let navigate = useNavigate();

	useEffect(() =>
	{
		if (props.restricted)
		{
			navigate(props.to);
		}

		const accessToken = localStorage.getItem("accessToken");

		if (accessToken)
		{
			navigate(-1);
		}

	}, []);

	return (
		<props.component />
	);
};

export default Redirect;
