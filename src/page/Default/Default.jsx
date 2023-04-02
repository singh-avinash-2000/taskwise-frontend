import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export const Home = () =>
{
	const navigate = useNavigate();

	useEffect(() =>
	{
		navigate(-1);
	}, []);

	return (
		<></>
	);
};

export default Home;
