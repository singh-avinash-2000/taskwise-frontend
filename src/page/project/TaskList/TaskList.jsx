import React, { useEffect, useState } from 'react';
import { Avatar, Breadcrumb, Select, Table, Tooltip, Tag, Button, Modal, message } from "antd";
import { MinusSquareOutlined, PlusSquareOutlined, HomeOutlined } from "@ant-design/icons";
import { Link, useNavigate, useParams } from "react-router-dom";
import { axiosClient } from "../../../config/axios";
import ProjectNewTaskForm from "../../../components/ui/ProjectNewTaskForm/ProjectNewTaskForm";
import "./TaskList.css";
import { useStateContext } from "../../../context/ContextProvider";

const TaskList = () =>
{
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [projectTasks, setProjectTasks] = useState([]);
	const navigate = useNavigate();
	const { project_id } = useParams();
	const { activeProjectName, projectMembersMap } = useStateContext();
	const handleStatusChange = async (value, record) =>
	{
		try
		{
			const task_key = record.task_key;
			await axiosClient.patch(`/projects/${project_id}/tasks/${task_key}`, { status: value.toUpperCase() });
			message.success(`Successfully updated ${record.task_key}'s status`);
		}
		catch (error)
		{
			message.error(error.message);
		}
	};

	const handleStatusClick = (e) =>
	{
		e.stopPropagation();
	};

	const columns = [
		{
			title: 'Type',
			dataIndex: 'type',
			key: 'type',
			render: (type) => <Tooltip title={type === "SUB_TASK" ? "Sub Task" : "Main Task"}>{type === "SUB_TASK" ? <Tag color="red"><MinusSquareOutlined /></Tag> : <Tag color="green"><PlusSquareOutlined /></Tag>}</Tooltip>,
		},
		{
			title: 'Task Key',
			dataIndex: 'task_key',
			key: 'key',
		},
		{
			title: 'Summary',
			dataIndex: 'summary',
			key: 'summary',
			width: 300,
			render: (summary) => <div style={{ width: '100%', textOverflow: 'ellipsis', overflow: 'hidden' }}>{summary}</div>
		},
		{
			title: 'Assigned To',
			key: "assignee",
			dataIndex: 'assignee',
			render: (assignee) => (
				<>
					<Avatar src={projectMembersMap[assignee]?.profile_picture || "https://picsum.photos/200/300"} /> {projectMembersMap[assignee]?.display_name}
				</>
			),
		},
		{
			title: 'Created By',
			key: 'reporter',
			dataIndex: 'reporter',
			render: (reporter) => (
				<>
					<Avatar src={projectMembersMap[reporter]?.profile_picture || "https://picsum.photos/200/300"} /> {projectMembersMap[reporter]?.display_name}
				</>
			),
		},
		{
			title: 'Priority',
			dataIndex: "priority",
			key: 'priority'
		},
		{
			title: 'Status',
			dataIndex: "status",
			key: 'status',
			render: (status, record) =>
			{
				return (<Select
					defaultValue={status}
					onClick={handleStatusClick}
					onChange={(value) => handleStatusChange(value, record)}
					className="task-status-select"
					options={[
						{
							value: 'TO_DO',
							label: 'To do',
						},
						{
							value: 'IN_PROGRESS',
							label: 'In Progress',
						},
						{
							value: 'COMPLETED',
							label: 'Completed',
						},
						{
							value: 'CLOSED',
							label: 'Closed',
						}
					]}
				/>);
			}
		}
	];

	const handleTaskCreation = () =>
	{
		setIsModalOpen(true);
	};

	const handleRowClick = (row) =>
	{
		navigate(`/project/${project_id}/tasks/${row.task_key}`);
	};

	const fetchProjectData = async () =>
	{
		try
		{
			const tasksResponse = await axiosClient.get(`/projects/${project_id}/tasks`);
			let tasks = tasksResponse.data?.result;
			tasks = tasks.map((t) =>
			{
				return {
					...t,
					key: t._id,
				};
			});

			setProjectTasks(tasks);
		} catch (error)
		{
			console.log(error);
		}
	};

	useEffect(() =>
	{
		fetchProjectData();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [isModalOpen]);


	return (
		<div>
			<Breadcrumb
				items={[
					{
						title: <Link to="/"><HomeOutlined /></Link>,
					},
					{
						title: activeProjectName,
					},
					{
						title: "Tasks"
					}
				]}
			/>
			<Button type="primary"
				onClick={handleTaskCreation}
				className="create-new-task-btn">
				Create new task
			</Button>
			<Table
				columns={columns}
				dataSource={projectTasks}
				ellipsis={{ showTitle: true }}
				scroll={{ x: true }}
				size="large"
				onRow={(record, rowIndex) =>
				{
					return {
						onClick: (event) =>
						{
							handleRowClick(record);
						},
					};
				}}
			/>

			<Modal title="Add Task" open={isModalOpen} destroyOnClose={true} onCancel={() => { setIsModalOpen(false); }} footer={null} className="create-task-modal">
				<ProjectNewTaskForm method="add" taskDetails={{}} closeModal={() => { setIsModalOpen(); }} task_type="MAIN_TASK" />
			</Modal>
		</div>
	);
};

export default TaskList;
