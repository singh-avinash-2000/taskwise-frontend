import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export const Home = () =>
{
	const navigate = useNavigate();

	useEffect(() =>
	{
		navigate(-1);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<></>
	);
};

export default Home;
