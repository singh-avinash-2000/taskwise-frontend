import React, { useEffect, useState } from 'react';
import { Breadcrumb, Space, Button, Upload, Row, Col, Select, Avatar, Tabs, Modal, message, Empty } from "antd";
import { ApartmentOutlined, LinkOutlined, EditOutlined, InboxOutlined, HomeOutlined } from "@ant-design/icons";
import TaskItem from "../../../components/ui/TaskItem/TaskItem";
import ProjectNewTaskForm from "../../../components/ui/ProjectNewTaskForm/ProjectNewTaskForm";
import { Link, useParams } from "react-router-dom";
import { axiosClient } from "../../../config/axios";
import './TaskInfo.css';
import { FileIcon, defaultStyles } from "react-file-icon";
import { useStateContext } from "../../../context/ContextProvider";
const { Dragger } = Upload;
const TaskInfo = () =>
{
	const [modalOpen, setModalOpen] = useState(false);
	const [attachmentModalOpen, setAttachmentModal] = useState(false);
	const [taskDetails, setTaskDetails] = useState({});
	const [subtasks, setSubtasks] = useState([]);
	const { project_id, task_key } = useParams();
	const [modalHeader, setModalHeader] = useState("");
	const [fileWithURL, setFileWithURL] = useState([]);
	const [defaultFileList, setDefaultFileList] = useState([]);
	const { activeProjectName, projectMembersMap } = useStateContext();

	const onChange = (key) =>
	{
		console.log(key);
	};
	const items = [
		{
			key: '1',
			label: `Subtasks`,
			children: <>
				{
					subtasks?.length > 0 ?
						subtasks?.map((subtask) => (
							<TaskItem key={subtask._id} summary={subtask?.summary} task_key={subtask?.task_key} status={subtask?.status.toLowerCase()} parent_id={subtask?.parent_task} />
						)) : <Empty description="No sub tasks found" />}
			</>,
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
		setTaskDetails(response.data?.result);
		fetchSubtasks(response.data?.result?._id);
		setDefaultFileList(response.data?.result?.documents);
	};

	const fetchSubtasks = async (parent_id) =>
	{
		const response = await axiosClient.get(`/projects/${project_id}/tasks/${parent_id}/subtasks`);
		setSubtasks(response.data?.result);
	};

	const handleStatusChange = async (value) =>
	{
		try
		{
			const project_id = taskDetails.project;
			const task_key = taskDetails.task_key;
			const response = await axiosClient.patch(`/projects/${project_id}/tasks/${task_key}`, { status: value.toUpperCase() });
			setTaskDetails(response?.data?.result);
			message.success("Task status updated successfully");
		}
		catch (error)
		{
			message.error("Something went wrong");
		}
	};

	const changeISODatesToReadable = (ISOdate) =>
	{
		const date = new Date(ISOdate);
		const options = { year: 'numeric', month: 'long', day: 'numeric' };
		return date.toLocaleDateString('en-US', options);
	};

	const handleFileUpload = async (options) =>
	{
		const { onSuccess, onError, file } = options;
		const formData = new FormData();
		formData.append('files', file);
		try
		{
			const response = await axiosClient.post('/misc/upload-all', formData, {
				headers: {
					'Content-Type': 'multipart/form-data',
				}
			});

			onSuccess(message.success(`${file.name} file uploaded successfully.`));
			const newDefaultFileList = [...defaultFileList, { name: response?.data?.result?.filename, url: response?.data?.result?.url }];
			setDefaultFileList(newDefaultFileList);
		} catch (error)
		{
			console.log(error);
			const err = new Error(error.message);
			onError(err);
		}
	};

	const handleFileRemove = async (file) =>
	{
		try
		{
			const fileName = file.name;
			await axiosClient.delete(`/misc/delete/${fileName}`);
			message.success(`${file.name} file removed successfully.`);
			const newFileList = fileWithURL.filter((item) => item.name !== fileName);
			setFileWithURL(newFileList);
		}
		catch (error)
		{
			console.log(error);
			message.error(`${file.name} file removal failed.`);
		}
	};

	const handleTaskUpdate = async () =>
	{
		console.log(defaultFileList);
	};


	useEffect(() =>
	{
		fetchTaskDetails();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [modalOpen, task_key, project_id]);

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
						<Button type="primary" onClick={() => { setAttachmentModal(true); }}> <LinkOutlined />Attachments</Button>
						<Button type="primary" onClick={() => { handleModalState("Sub"); }}><ApartmentOutlined />Add sub task</Button>
						<Button type="primary" onClick={() => { handleModalState("Update"); }}><EditOutlined />Update task</Button>
					</Space>

					{taskDetails.description && <>
						<h3>Description</h3>

						<div className="description-content">
							<span className="description-content-span" dangerouslySetInnerHTML={{ __html: taskDetails.description }}></span>
						</div>
					</>}

					{taskDetails.documents?.length ? <><h3>Attachments</h3>
						<div className="attachments-wrapper">
							{
								taskDetails.documents?.map(docs =>
								{
									const icon = docs.name.split(".").pop();
									return (
										<div style={{ width: 80, height: "auto" }} key={docs._id}>
											<a href={docs.url} download={true}>
												<FileIcon extension={icon} {...defaultStyles[icon]} />
												<span style={{ fontWeight: "bold" }}>{docs.name}</span>
											</a>
										</div>

									);
								})
							}
						</div></> : <></>}
				</Col>
				<Col xs={24} sm={24} md={24} lg={8} xl={6} style={{ paddingLeft: 20 }}>
					<Select
						defaultValue="TO_DO"
						value={taskDetails.status}
						className="to_do"
						onChange={(value) => { handleStatusChange(value); }}
					>
						<Select.Option value="TO_DO">To-do</Select.Option>
						<Select.Option value="IN_PROGRESS">In-progress</Select.Option>
						<Select.Option value="COMPLETED">Completed</Select.Option>
						<Select.Option value="CLOSED">Closed</Select.Option>
					</Select>
					<div className="task-details">
						<table className="task-table">
							<tbody>
								<tr className="task-table-row">
									<td className="task-table-data">
										<h3>Assignee</h3>
									</td>
									<td>
										<span style={{ fontSize: 18, fontWeight: "600", color: "gray" }}><Avatar src={projectMembersMap[taskDetails?.assignee]?.profile_picture} style={{ marginRight: 5 }} />{projectMembersMap[taskDetails?.assignee]?.display_name}</span>
									</td>
								</tr>
								<tr className="task-table-row">
									<td className="task-table-data">
										<h3 >Reporter </h3>
									</td>
									<td>
										<span style={{ fontSize: 18, fontWeight: "600", color: "gray" }}><Avatar src={projectMembersMap[taskDetails?.reporter]?.profile_picture} style={{ marginRight: 5 }} />{projectMembersMap[taskDetails?.reporter]?.display_name}
										</span>
									</td>
								</tr>
								<tr className="task-table-row">
									<td className="task-table-data">
										<h3 >Created </h3>
									</td>
									<td>
										<h3 style={{ fontSize: 18, fontWeight: "600", color: "gray" }}>{changeISODatesToReadable(taskDetails?.created_at)}</h3>
									</td>
								</tr>
								<tr className="task-table-row">
									<td className="task-table-data">
										<h3 >Updated </h3>
									</td>
									<td>
										<h3 style={{ fontSize: 18, fontWeight: "600", color: "gray" }}>{changeISODatesToReadable(taskDetails?.updated_at)}</h3>
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
			<Modal title={`${modalHeader} Task`} open={modalOpen} destroyOnClose={true} onCancel={() => { setModalOpen(false); }} footer={null} className="create-task-modal">
				<ProjectNewTaskForm method={modalHeader.toLowerCase()} taskDetails={taskDetails} closeModal={() => setModalOpen(false)} task_type={modalHeader === "Sub" ? "SUB_TASK" : "MAIN_TASK"} />
			</Modal>
			<Modal title="Attachments" open={attachmentModalOpen} onCancel={() => { setAttachmentModal(false); }} okText={"Update"} onOk={handleTaskUpdate}>
				<Dragger
					multiple={true}
					customRequest={handleFileUpload}
					defaultFileList={defaultFileList}
					onRemove={(file) => handleFileRemove(file)}
				>
					<p className="ant-upload-drag-icon">
						<InboxOutlined />
					</p>
					<p className="ant-upload-text">Click or drag file to this area to upload</p>
					<p className="ant-upload-hint">
						Support for a single or bulk upload. Strictly prohibited from uploading company data or other
						banned files.
					</p>
				</Dragger>
			</Modal>
		</div>
	);
};

export default TaskInfo;
