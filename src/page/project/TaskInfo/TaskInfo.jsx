import React, { useEffect, useState } from 'react';
import { Breadcrumb, Space, Button, Divider, Row, Col, Select, Avatar, Image, Tabs, Modal } from "antd";
import { UserOutlined, ApartmentOutlined, LinkOutlined, EditOutlined } from "@ant-design/icons";
import TaskItem from "../../../components/ui/TaskItem/TaskItem";
import ProjectNewTaskForm from "../../../components/ui/ProjectNewTaskForm/ProjectNewTaskForm";
import { useParams } from "react-router-dom";
import { axiosClient } from "../../../config/axios";

import './TaskInfo.css';
import { useForm } from "antd/lib/form/Form";

const TaskInfo = () =>
{
	const [modalOpen, setModalOpen] = useState(false);
	const [formData] = useForm();
	const [assigneeMembers, setAssigneeMembers] = useState([]);
	const [taskDetails, setTaskDetails] = useState({});
	const [membersList, setMembersList] = useState({});
	const { project_id, task_key } = useParams();
	const [modalHeader, setModalHeader] = useState("");
	const [projectName, setProjectName] = useState("");

	useEffect(() =>
	{
		fetchProjectName();
	}, []);

	const fetchProjectName = async () =>
	{
		const response = await axiosClient.get(`/projects/${project_id}`);
		setProjectName(response.data.result.name);
	};

	const onChange = (key) =>
	{
		console.log(key);
	};

	const fetchProjectMembers = async () =>
	{
		try
		{
			const response = await axiosClient.get(`/projects/${project_id}/members`);
			let temp = {};

			const members = response.data?.result?.map(r =>
			{
				temp[r.user._id] = r.user.first_name + " " + r.user.last_name;
				return {
					label: r.user.first_name + " " + r.user.last_name,
					value: r.user._id
				};
			});
			setMembersList(temp);
			setAssigneeMembers(members);
		} catch (error)
		{
			console.log(error);
		}
	};

	const items = [
		{
			key: '1',
			label: `Subtasks`,
			children: <>
				<TaskItem />
				<TaskItem />
				<TaskItem />
				<TaskItem />
				<TaskItem />
				<TaskItem />
				<TaskItem />
				<TaskItem />
				<TaskItem />
			</>,
		},
		{
			key: '2',
			label: `History`,
			children: `Content of Tab Pane 2`,
		}
	];

	const handleModalState = (text) =>
	{
		setModalHeader(text);
		setModalOpen(true);
	};

	const fetchTaskDetails = async () =>
	{
		const response = await axiosClient.get(`/projects/${project_id}/tasks/${task_key}`);
		let temp = response.data.result;
		setTaskDetails(temp);
	};

	const getMemberName = (member_id) =>
	{
		return membersList[member_id];
	};

	useEffect(() =>
	{
		fetchProjectMembers();
		fetchTaskDetails();
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
					},
					{
						title: `${task_key}`,
					},
				]}
			/>
			<Row>
				<Col xs={24} sm={24} md={24} lg={16} xl={18} className="project-task-info-wrapper">
					<h2 style={{ fontWeight: "600" }}>{taskDetails.summary}</h2>

					<Space className="space">
						<Button type="primary"> <LinkOutlined />Attach</Button>
						<Button type="primary" onClick={() => { handleModalState("Sub"); }}><ApartmentOutlined />Add sub task</Button>
						<Button type="primary" onClick={() => { handleModalState("Update"); }}><EditOutlined />Update task</Button>
					</Space>

					<h3>Description</h3>

					<div className="description-content">
						<span className="description-content-span" dangerouslySetInnerHTML={{ __html: taskDetails.description }}></span>
					</div>

					<h3>Attachments</h3>
					<div className="attachments-wrapper">
						<div>
							<Image
								width={160}
								height={120}
								src="https://project-management.com/wp-content/uploads/2019/12/pros-and-cons-of-jira-screenshot-06-2021-1.png"
								className="attachment-image"
							/>
						</div>
						<div>
							<Image
								width={160}
								height={120}
								src="https://project-management.com/wp-content/uploads/2019/12/pros-and-cons-of-jira-screenshot-06-2021-1.png"
								className="attachment-image"
							/>
						</div>
						<div>
							<Image
								width={160}
								height={120}
								src="https://project-management.com/wp-content/uploads/2019/12/pros-and-cons-of-jira-screenshot-06-2021-1.png"
								className="attachment-image"
							/>
						</div>
						<div>
							<Image
								width={160}
								height={120}
								src="https://project-management.com/wp-content/uploads/2019/12/pros-and-cons-of-jira-screenshot-06-2021-1.png"
								className="attachment-image"
							/>
						</div>
						<div>
							<Image
								width={160}
								height={120}
								src="https://project-management.com/wp-content/uploads/2019/12/pros-and-cons-of-jira-screenshot-06-2021-1.png"
								className="attachment-image"
							/>
						</div>
						<div>
							<Image
								width={160}
								height={120}
								src="https://project-management.com/wp-content/uploads/2019/12/pros-and-cons-of-jira-screenshot-06-2021-1.png"
								className="attachment-image"
							/>
						</div>
						<div>
							<Image
								width={160}
								height={120}
								src="https://project-management.com/wp-content/uploads/2019/12/pros-and-cons-of-jira-screenshot-06-2021-1.png"
								className="attachment-image"
							/>
						</div>
						<div>
							<Image
								width={160}
								height={120}
								src="https://project-management.com/wp-content/uploads/2019/12/pros-and-cons-of-jira-screenshot-06-2021-1.png"
								className="attachment-image"
							/>
						</div>
						<div>
							<Image
								width={160}
								height={120}
								src="https://project-management.com/wp-content/uploads/2019/12/pros-and-cons-of-jira-screenshot-06-2021-1.png"
								className="attachment-image"
							/>
						</div>
					</div>
				</Col>
				<Col xs={24} sm={24} md={24} lg={8} xl={6} style={{ paddingLeft: 20 }}>
					<Select
						defaultValue="TO_DO"
						value={taskDetails.status}
						className="to_do"
					>
						<Select.Option value="IN_PROGRESS">In-progress</Select.Option>
						<Select.Option value="TO_DO">To-do</Select.Option>
						<Select.Option value="COMPLETED">Completed</Select.Option>
						<Select.Option value="CLOSED">Closed</Select.Option>
					</Select>
					<div className="task-details">
						<table className="task-table">
							<tbody>
								<tr className="task-table-row">
									<td className="task-table-data">
										<h3 >Assignee </h3>
									</td>
									<td>
										<span style={{ fontSize: 18, fontWeight: "600", color: "gray" }}><Avatar icon={<UserOutlined />} style={{ marginRight: 5 }} />{getMemberName(taskDetails.assignee)}</span>
									</td>
								</tr>
								<tr className="task-table-row">
									<td className="task-table-data">
										<h3 >Reporter </h3>
									</td>
									<td>
										<span style={{ fontSize: 18, fontWeight: "600", color: "gray" }}><Avatar icon={<UserOutlined />} style={{ marginRight: 5 }} />{getMemberName(taskDetails.reporter)}</span>
									</td>
								</tr>
								<tr className="task-table-row">
									<td className="task-table-data">
										<h3 >Created </h3>
									</td>
									<td>
										<h3 style={{ fontSize: 18, fontWeight: "600", color: "gray" }}>22-03-2023</h3>
									</td>
								</tr>
								<tr className="task-table-row">
									<td className="task-table-data">
										<h3 >Updated </h3>
									</td>
									<td>
										<h3 style={{ fontSize: 18, fontWeight: "600", color: "gray" }}>22-03-2023 03:14:07</h3>
									</td>
								</tr>
							</tbody>
						</table>
					</div>
				</Col>
				<Col xs={24} sm={24} md={24} lg={16} xl={18}>
					<Tabs defaultActiveKey="1" items={items} onChange={onChange} />
				</Col>
			</Row>
			<Modal title={`${modalHeader} Task`} open={modalOpen} onCancel={() => { setModalOpen(false); }} footer={null} className="create-task-modal">
				<ProjectNewTaskForm formData={formData} assigneeMembers={assigneeMembers} method={modalHeader.toLowerCase()} taskDetails={taskDetails} />
			</Modal>
		</div>
	);
};

export default TaskInfo;
