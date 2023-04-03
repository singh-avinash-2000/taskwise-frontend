import axios from "axios";

function initializeInterceptor()
{
	axios.defaults.baseURL = process.env.REACT_APP_BASE_URL;
	axios.defaults.withCredentials = true;

	axios.interceptors.request.use((request) =>
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

	axios.interceptors.response.use(
		(response) =>
		{
			if (response && response.data.result)
			{
				return response;
			}
		},
		async (error) =>
		{
			const originalRequest = error.config;
			const statusCode = error.response.status;
			const responseError = error.response.data.error;

			//Refresh token and Access Token both expired
			if (statusCode === 401 && originalRequest.url === `${process.env.REACT_APP_BASE_URL}/auth/refresh`) 
			{
				localStorage.removeItem("accessToken");
				window.location.replace('/auth/login', '_self');
			}

			//Only Access token expired
			if (statusCode === 401 && responseError.message === "jwt expired")
			{
				const responseFromRefresh = await axios.create({
					withCredentials: true
				}).get(`${process.env.REACT_APP_BASE_URL}/auth/refresh`);

				if (responseFromRefresh.status === 200)
				{
					localStorage.setItem("accessToken", responseFromRefresh.data.result.accessToken);
					originalRequest.headers['Authorization'] = `Bearer ${responseFromRefresh.data.result.accessToken}`;
					return axios(originalRequest);
				}
				else
				{
					localStorage.removeItem("accessToken");
					window.location.replace('/auth/login', '_self');
					return Promise.reject(responseError);
				}
			}

			return Promise.reject(error);
		});
}

export default initializeInterceptor;
