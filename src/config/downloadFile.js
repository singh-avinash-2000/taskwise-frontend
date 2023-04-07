import { axiosClient } from "./axios";

export const downloadFile = async (fileName) =>
{
	try
	{
		const response = await axiosClient.get(`/misc/download/${fileName}`, {
			responseType: 'blob'
		});
		const url = window.URL.createObjectURL(new Blob([response.data]));
		const link = document.createElement('a');
		link.href = url;
		link.setAttribute('download', fileName);
		document.body.appendChild(link);
		link.click();
	} catch (error)
	{
		console.log(error);
	}
};
