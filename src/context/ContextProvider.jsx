import React, { createContext, useContext, useEffect, useState } from "react";
import { axiosClient } from "../config/axios";

const StateContext = createContext();

export const ContextProvider = ({ children }) =>
{
	const [userDetails, setUserDetails] = useState({});
	const [projects, setProjects] = useState([]);
	const [activeProjectDetails, setActiveProjectDetails] = useState({});
	const [labelMembers, setLabelMembers] = useState([]);
	const [projectMembersMap, setProjectMembersMap] = useState({});
	const [activeProjectName, setActiveProjectName] = useState("");
	const [loading, setLoading] = useState(true);

	const fetchData = async () =>
	{
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
					projectMembersMap, setProjectMembersMap,
					labelMembers, setLabelMembers,
					loading, setLoading,
					activeProjectName, setActiveProjectName,
					activeProjectDetails, setActiveProjectDetails
				}}
		>
			{children}
		</StateContext.Provider>
	);
};

export const useStateContext = () => useContext(StateContext);
