import React, { createContext, useContext, useEffect, useState } from "react";
import { axiosClient } from "../config/axios";

const StateContext = createContext();

export const ContextProvider = ({ children }) =>
{
	const [userDetails, setUserDetails] = useState({});
	const [projects, setProjects] = useState([]);
	const [projectMembers, setProjectMembers] = useState({});
	const [activeProjectName, setActiveProjectName] = useState("");
	const [loading, setLoading] = useState(true);

	const fetchData = async () =>
	{
		setLoading(true);
		const Userresponse = await axiosClient.get("/user");
		setUserDetails(Userresponse.data.result);
		const Projectresponse = await axiosClient.get("/projects");
		setProjects(Projectresponse.data.result);
		setLoading(false);
	};

	useEffect(() =>
	{
		fetchData();
	}, []);

	return (
		<StateContext.Provider
			value={
				{
					userDetails, setUserDetails,
					projects, setProjects,
					projectMembers, setProjectMembers,
					loading, setLoading,
					activeProjectName, setActiveProjectName,
				}}
		>
			{children}
		</StateContext.Provider>
	);
};

export const useStateContext = () => useContext(StateContext);
