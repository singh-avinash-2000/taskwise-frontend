import
{
	Button,
	Form,
	Input,
	Select,
	Switch,
	Card,
	message,
} from 'antd';

import TextArea from "antd/lib/input/TextArea";
import { useEffect, useState } from "react";

import './ProjectDataForm.css';
import { axiosClient } from "../../../config/axios";

const ProjectDataForm = ({ setNewProjectModalOpen, fetchProjects, method, project_id }) =>
{
	const [form] = Form.useForm();
	const [isChatVisible, setIsChatVisible] = useState(false);
	const [projectName, setProjectName] = useState("");
	const [projectType, setProjectType] = useState("");
	const [projectDescription, setProjectDesription] = useState("");
	const [chatStatus, setChatStatus] = useState(false);
	const [documentstatus, setDocumentStatus] = useState(false);

	const handleFormSubmit = async () =>
	{
		try
		{
			await form.validateFields();

			const data = {
				name: projectName,
				type: projectType.toUpperCase(),
				description: projectDescription,
				chat_enabled: chatStatus,
				document: documentstatus
			};

			if (method === "Add")
			{
				const response = await axiosClient.post("/projects", data);
				message.success(response.data.message);
			}
			else
			{
				const response = await axiosClient.patch(`/projects/${project_id}`, data);
				message.success(response.data.message);
			}

			setProjectName("");
			setProjectType("");
			setProjectDesription("");
			setChatStatus(false);
			setDocumentStatus(false);
			form.resetFields(); // reset the form instance
			setNewProjectModalOpen(false);

			if (method === "Add")
			{
				fetchProjects();
			}
		} catch (error)
		{
			console.log(error);
			message.error(error.message);
		}
	};


	const handleDropDownChange = (value) =>
	{
		if (value === "shared")
		{
			setProjectType("SHARED");
			setIsChatVisible(true);
		}
		else
		{
			setProjectType("PERSONAL");
			setIsChatVisible(false);
		}
	};

	const fetchProjectData = async () =>
	{
		try
		{
			const response = await axiosClient.get(`/projects/${project_id}`);
			const { name, type, description, chat_enabled, document } = response.data.result;
			console.log("name:", name);
			console.log("type:", type);
			console.log("description:", description);
			console.log("chat_enabled:", chat_enabled);
			console.log("document:", document);
			setProjectName(name);
			setProjectType(type);
			setProjectDesription(description);
			setChatStatus(chat_enabled);
			setDocumentStatus(document);
		}
		catch (error)
		{
			console.log(error);
			message.error(error.message);
			setNewProjectModalOpen(false);
		}
	};


	useEffect(() =>
	{
		if (method === "Edit")
		{
			fetchProjectData();
		}
	}, []);


	return (
		<div>
			<Card
				style={{
					maxWidth: 800,
					margin: "auto"
				}}
				className="project-data-form-card"
			>
				<Form
					labelCol={{
						span: 6,
					}}
					labelAlign="left"
					wrapperCol={{
						span: 24,
					}}
					layout="horizontal"
					size="large"

					form={form}
					onFinish={handleFormSubmit}
				>
					<Form.Item label="Name"
						name="project_name"
						rules={[
							{
								required: true,
								message: 'Please input project name',
							},
						]}
						initialValue={projectName}
					>
						<Input type="text" placeholder="Project Name" value={projectName} onChange={(e) => setProjectName(e.target.value)} />
					</Form.Item>
					<Form.Item label="Type"
						name="project_type"
						rules={[
							{
								required: true,
								message: 'Please select project type',
							},
						]}
						initialValue={projectType.toLowerCase()}
					>
						<Select placeholder="Select One" onChange={handleDropDownChange} >
							<Select.Option value="personal">Personal</Select.Option>
							<Select.Option value="shared">Shared</Select.Option>
						</Select>
					</Form.Item>
					<Form.Item label="Description"
						name="project_description"
						rules={[
							{
								required: true,
								message: 'Please input project description',
							},
						]}
						initialValue={projectDescription}
					>
						<TextArea placeholder="Please input project description" value={projectDescription} onChange={(e) => setProjectDesription(e.target.value)} />
					</Form.Item>
					{
						isChatVisible && <Form.Item label="Chat" valuePropName="checked" name="chat_checked">
							<Switch onChange={(status) => setChatStatus(status)} defaultChecked={chatStatus} />
						</Form.Item>
					}

					<Form.Item label="Document" valuePropName="checked" name="document_checked" initialValue={documentstatus}>
						<Switch onChange={(status) => setDocumentStatus(status)} defaultChecked={documentstatus} />
					</Form.Item>
					<Form.Item
						className="project-data-form-submit-button"
					>
						<Button htmlType="submit" className='add-project-submit-btn'>Submit</Button>
					</Form.Item>
				</Form>
			</Card >
		</div>
	);
};

export default ProjectDataForm;
