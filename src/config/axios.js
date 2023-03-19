import axios from "axios";

function initializeInterceptor()
{
	axios.defaults.baseURL = process.env.REACT_APP_BASE_URL;

	axios.interceptors.request.use((request) =>
	{
		if (!request.headers["Content-Type"])
		{
			request.headers["Content-Type"] = "application/json";
		}

		const token = localStorage.getItem("token");

		if (token)
		{
			request.headers["Authorization"] = "Bearer " + token;
		}

		return request;
	});
}

export default initializeInterceptor;
