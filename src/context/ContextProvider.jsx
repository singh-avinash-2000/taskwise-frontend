import React, { createContext, useContext, useEffect, useState } from "react";
import { axiosClient } from "../config/axios";
import { getSocketInstance } from "../config/socket";

const StateContext = createContext();

export const ContextProvider = ({ children }) =>
{
	const [userDetails, setUserDetails] = useState({});
	const [activeProjectDetails, setActiveProjectDetails] = useState({});
	const [labelMembers, setLabelMembers] = useState([]);
	const [projectMembersMap, setProjectMembersMap] = useState({});
	const [activeProjectName, setActiveProjectName] = useState("");

	const fetchData = async () =>
	{
		const Userresponse = await axiosClient.get("/user");
		setUserDetails(Userresponse.data.result);
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
					projectMembersMap, setProjectMembersMap,
					labelMembers, setLabelMembers,
					activeProjectName, setActiveProjectName,
					activeProjectDetails, setActiveProjectDetails
				}}
		>
			{children}
		</StateContext.Provider>
	);
};

export const useStateContext = () => useContext(StateContext);
