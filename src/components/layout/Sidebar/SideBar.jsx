import { NavLink, useParams } from "react-router-dom";
import * as rdd from 'react-device-detect';
import "./Sidebar.css";
import projectSideBarData from "../../../config/projectSidebar";
import { RiRoadMapLine } from "react-icons/ri";
import { BsKanban, BsChatSquareText } from "react-icons/bs";
import { FaTasks } from "react-icons/fa";
import { TbReportAnalytics } from "react-icons/tb";
import { FiEdit } from "react-icons/fi";
import { GrPlan } from "react-icons/gr";
import { AiOutlineInteraction, AiOutlineTeam, AiOutlineFileText, AiOutlineDelete } from "react-icons/ai";
import { useEffect, useState } from "react";
import { useStateContext } from "../../../context/ContextProvider";
import { Spin } from "antd";

function getIconComponent(iconName)
{
	switch (iconName)
	{
		case 'Roadmap':
			return <RiRoadMapLine />;
		case 'Kanban Board':
			return <BsKanban />;
		case 'Tasks':
			return <FaTasks />;
		case 'Reports':
			return <TbReportAnalytics />;
		case 'PLANNING':
			return <GrPlan />;
		case 'INTERACTION':
			return <AiOutlineInteraction />;
		case 'Members':
			return <AiOutlineTeam />;
		case 'Chat':
			return <BsChatSquareText />;
		case 'Documents':
			return <AiOutlineFileText />;
		case 'Edit Project':
			return <FiEdit />;
		case 'Delete Project':
			return <AiOutlineDelete />;
		default:
			return null; // or an error message
	}
}

const SideBar = ({ setCollapsed }) =>
{
	const { project_id } = useParams();
	const { activeProjectName } = useStateContext();

	const NavHeader = ({ title, children, setCollapsed }) =>
	{
		return (
			<div className="nav-header-wrapper">
				{getIconComponent(title)}<span className="nav-header-title">{title}</span>
				{
					children.map((child) =>
					{
						return (
							<NavItem title={child.title} to={child.to} key={child.title} setCollapsed={setCollapsed} />
						);
					})
				}
			</div>
		);
	};

	const NavItem = ({ title, to, setCollapsed }) =>
	{
		const handleClick = () =>
		{
			if (window.innerWidth < 950 || rdd.isMobile)
			{
				setCollapsed(true);
			}
		};


		return (
			<NavLink
				to={to}
				className={
					({ isActive }) => isActive ? "nav-item-active nav-item-fixed-style" : "nav-item-fixed-style"
				}
				onClick={handleClick}>
				<div id="nav-item-custom">
					{getIconComponent(title)}<span className="nav-item-custom-span">{title}</span>
				</div>
			</NavLink>
		);
	};

	return (
		<div id="sidebar" >
			<div className="sidebar-wrapper">
				<div className="project-title-div">
					<span className="project-title">{activeProjectName || <Spin />}</span>
				</div>
				<div className="nav-entries">
					{
						Object.entries(projectSideBarData(project_id)).map(([key, value]) =>
						{
							return (
								<NavHeader title={key} children={value} key={key} setCollapsed={setCollapsed} />
							);
						})
					}
				</div>
			</div>
		</div >
	);
};



export default SideBar;
