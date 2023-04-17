import { Button, Form, Input, Select, Switch, Card, message, } from 'antd';
import TextArea from "antd/lib/input/TextArea";
import { useEffect, useState } from "react";
import { axiosClient } from "../../../config/axios";
import { useNavigate } from "react-router";
import { useStateContext } from "../../../context/ContextProvider";
import './ProjectDataForm.css';

const ProjectDataForm = ({ setNewProjectModalOpen, method, project_id, fetchProjects }) =>
{
	const [form] = Form.useForm();
	const [isChatVisible, setIsChatVisible] = useState(false);
	const navigate = useNavigate();
	const { projects, setProjects } = useStateContext();


	const handleFormSubmit = async () =>
	{
		try
		{
			await form.validateFields();

			const data = form.getFieldsValue();

			let response = {};

			if (method === "Add")
			{
				response = await axiosClient.post("/projects", data);
			}
			else
			{
				response = await axiosClient.patch(`/projects/${project_id}`, data);
			}

			message.success(response.data.message);

			form.resetFields(); // reset the form instance
			setNewProjectModalOpen(false);

			if (method === "Add")
			{
				fetchProjects();
			}
			else
			{
				navigate(-1);
			}
		} catch (error)
		{
			console.log(error);
			message.error(error.message);
		}
	};


	const handleDropDownChange = (value) =>
	{
		if (value === "SHARED")
		{
			setIsChatVisible(true);
		}
		else
		{
			setIsChatVisible(false);
		}
	};

	const fetchProjectData = async () =>
	{
		try
		{
			const response = await axiosClient.get(`/projects/${project_id}`);
			form.setFieldsValue(response.data.result);
			if (response.data.result.type == "SHARED")
			{
				setIsChatVisible(true);
			}
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
						name="name"
						rules={[
							{
								required: true,
								message: 'Please input project name',
							},
						]}
					>
						<Input type="text" placeholder="Project Name" />
					</Form.Item>
					<Form.Item label="Type"
						name="type"
						rules={[
							{
								required: true,
								message: 'Please select project type',
							},
						]}
					>
						<Select placeholder="Select One" onChange={handleDropDownChange} >
							<Select.Option value="PERSONAL">Personal</Select.Option>
							<Select.Option value="SHARED">Shared</Select.Option>
						</Select>
					</Form.Item>
					<Form.Item label="Description"
						name="description"
						rules={[
							{
								required: true,
								message: 'Please input project description',
							},
						]}
					>
						<TextArea placeholder="Please input project description" />
					</Form.Item>
					{
						isChatVisible && <Form.Item label="Chat" valuePropName="checked" name="chat_enabled">
							<Switch />
						</Form.Item>
					}

					<Form.Item label="Document" valuePropName="checked" name="document">
						<Switch />
					</Form.Item>
					<Form.Item
						className="project-data-form-submit-button"
					>
						<Button htmlType="submit" className='add-project-submit-btn'>{method == "Add" ? "Submit" : "Update"}</Button>
					</Form.Item>
				</Form>
			</Card >
		</div>
	);
};

export default ProjectDataForm;
