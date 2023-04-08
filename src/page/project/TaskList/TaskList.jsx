import React, { useEffect, useState } from 'react';
import { Avatar, Breadcrumb, Select, Table, Tooltip, Typography, Tag, Button, Modal } from "antd";
import { ClockCircleOutlined, MinusSquareOutlined, PlusSquareOutlined, CheckCircleOutlined, CheckOutlined, LineChartOutlined } from "@ant-design/icons";
import { useNavigate, useParams } from "react-router-dom";
import { axiosClient } from "../../../config/axios";
import ProjectNewTaskForm from "../../../components/ui/ProjectNewTaskForm/ProjectNewTaskForm";

import "./TaskList.css";

const TaskList = () =>
{
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [assigneeMembers, setAssigneeMembers] = useState([]);
	const [projectMembers, setProjectMembers] = useState([]);
	const [projectTasks, setProjectTasks] = useState([]);
	const [projectName, setProjectName] = useState("");
	const navigate = useNavigate();
	const { project_id } = useParams();

	useEffect(() =>
	{
		fetchProjectName();
	}, []);

	const fetchProjectName = async () =>
	{
		const response = await axiosClient.get(`/projects/${project_id}`);
		setProjectName(response.data.result.name);
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
			title: 'Assignee',
			key: "assignee",
			dataIndex: 'assignee',
			render: (assignee) => (
				<>
					<Avatar src="https://picsum.photos/200/300" /> {projectMembers[assignee]}
				</>
			),
		},
		{
			title: 'Reporter',
			key: 'reporter',
			dataIndex: 'reporter',
			render: (reporter) => (
				<>
					<Avatar src="https://picsum.photos/200/300" /> {projectMembers[reporter]}
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
			render: (status) =>
			{
				// <>
				// 	<Select value={status} onClick={(e) =>
				// 	{
				// 		e.stopPropagation();
				// 	}} onChange={(e) =>
				// 	{
				// 	}}
				// 		className="task-status-select">
				// 		<Select.Option value="TO_DO">To-do</Select.Option>
				// 		<Select.Option value="IN_PROGRESS">In progress</Select.Option>
				// 		<Select.Option value="COMPLETED">Completed</Select.Option>
				// 		<Select.Option value="CLOSED">Closed</Select.Option>
				// 	</Select >
				// </>
				switch (status)
				{
					case "TO_DO":
						return <Tag icon={<ClockCircleOutlined />} className="status-tag" color="cyan">
							To Do
						</Tag>;
					case "IN_PROGRESS":
						return <Tag icon={<LineChartOutlined />} color="orange">
							In Progress
						</Tag>;
					case "COMPLETED":
						return <Tag icon={<CheckOutlined />} color="green">
							Completed
						</Tag>;
					case "CLOSED":
						return <Tag icon={<CheckCircleOutlined />} color="magenta">
							Closed
						</Tag>;
				}

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

	const fetchProjectMembers = async () =>
	{
		try
		{
			const response = await axiosClient.get(`/projects/${project_id}/members`);
			const membersList = {};
			const members = response.data.result?.members?.map(r =>
			{
				membersList[r.user._id] = r.user.first_name + " " + r.user.last_name;
				return {
					label: r.user.first_name + " " + r.user.last_name,
					value: r.user._id
				};
			});

			setAssigneeMembers(members);
			setProjectMembers(membersList);
		} catch (error)
		{
			console.log(error);
		}

	};

	const fetchTaskList = async () =>
	{
		try
		{
			const response = await axiosClient.get(`/projects/${project_id}/tasks`);
			let tasks = response.data?.result;
			tasks = tasks.map(t =>
			{
				return {
					...t,
					key: t._id
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
		fetchProjectMembers();
		fetchTaskList();
	}, []);

	return (
		<div>
			<Breadcrumb
				items={[
					{
						title: projectName,
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

			<Modal title="Add Task" open={isModalOpen} onCancel={() => { setIsModalOpen(false); }} footer={null} className="create-task-modal">
				<ProjectNewTaskForm assigneeMembers={assigneeMembers} method="add" taskDetails={{}} />
			</Modal>
		</div>
	);
};

export default TaskList;
