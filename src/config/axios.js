import axios from "axios";


export const axiosClient = axios.create({
	baseURL: process.env.REACT_APP_BASE_URL,
	withCredentials: true,
});

axiosClient.interceptors.request.use((request) =>
{
	if (!request.headers["Content-Type"])
	{
		request.headers["Content-Type"] = "application/json";
	}

	const accessToken = localStorage.getItem("accessToken");

	if (accessToken)
	{
		request.headers["Authorization"] = "Bearer " + accessToken;
	}

	return request;
});

axiosClient.interceptors.response.use(
	(response) =>
	{
		if (response && response.data)
		{
			return response;
		}
	},
	async (error) =>
	{
		const originalRequest = error.config;
		const statusCode = error.response.status;
		const responseError = error.response.data;

		//Refresh token and Access Token both expired
		if (statusCode === 401 && originalRequest.url === '/auth/refresh') 
		{
			localStorage.removeItem("accessToken");
			window.location.replace(`/login?redirect=${window.location.pathname}`, '_self');
		}
		//Only Access token expired
		if (statusCode === 401 && responseError.message === "jwt expired")
		{
			const responseFromRefresh = await axiosClient.get('/auth/refresh');

			if (responseFromRefresh.status === 200)
			{
				localStorage.setItem("accessToken", responseFromRefresh.data.result.accessToken);
				originalRequest.headers['Authorization'] = `Bearer ${responseFromRefresh.data.result.accessToken}`;

				return axiosClient(originalRequest);
			}
			else
			{
				localStorage.removeItem("accessToken");
				window.location.replace(`/login?redirect=${window.location.pathname}`, '_self');
				return Promise.reject(responseError);
			}
		}

		return Promise.reject(error);
	}
);
