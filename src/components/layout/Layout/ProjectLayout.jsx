import React, { useEffect, useState } from 'react';
import { debounce } from "lodash";
import { Outlet, useParams } from "react-router-dom";
import NavBar from "../Navbar/NavBar";
import SideBar from "../Sidebar/SideBar";
import './ProjectLayout.css';
import { axiosClient } from "../../../config/axios";
import { useStateContext } from "../../../context/ContextProvider";

const MainLayout = ({ onDashboard }) =>
{
	const [position, setPosition] = useState('relative');
	const [screenHeight, setScreenHeight] = useState(700);
	const [collapsed, setCollapsed] = useState(false);
	const { project_id } = useParams();
	const { setActiveProjectDetails, setActiveProjectName, setProjectMembersMap, setLabelMembers, setLoading } = useStateContext();

	const handleResize = debounce(() =>
	{
		if (window.innerWidth <= 950)
		{
			setPosition('absolute');
			setCollapsed(true);
		}
		else
		{
			setPosition('relative');
			setCollapsed(false);
		}

		setScreenHeight(window.innerHeight - 70);
	}, 500);

	const fetchData = async () =>
	{
		setLoading(true);
		const projectResponse = await axiosClient.get(`/projects/${project_id}`);
		const result = projectResponse.data.result;

		setActiveProjectDetails(result);
		setActiveProjectName(result.name);

		const projectMembers = await axiosClient.get(`/projects/${project_id}/members`);
		let projectMembersMap = {};
		const selectLabelMembers = projectMembers.data.result.map(m =>
		{
			projectMembersMap[m.user._id] = m.user;
			return {
				label: m.display_name,
				value: m._id
			};
		});

		console.log(projectMembersMap, 56);
		setLabelMembers(selectLabelMembers);
		setProjectMembersMap(projectMembersMap);
		setLoading(false);
	};

	useEffect(() =>
	{
		if (!onDashboard)
		{
			fetchData();
		}

		handleResize();
		window.addEventListener("resize", handleResize);

		return () => window.removeEventListener("resize", handleResize);
	}, [onDashboard]);

	return (
		<>
			<div>
				<NavBar navIconDisabled={onDashboard} setCollapsed={setCollapsed} collapsed={collapsed} />
				<div className="sidebar-layout" style={{ height: screenHeight }}>
					{
						!collapsed && !onDashboard &&
						<SideBar setCollapsed={setCollapsed} />
					}

					<div style={{ position: position }} className="layout-outlet-wrapper">
						<div className="layout-outlet-div">
							<Outlet />
						</div>
					</div>
				</div>
			</div>
		</>
	);
};

export default MainLayout;

