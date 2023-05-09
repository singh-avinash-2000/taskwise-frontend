import { Button, Form, Input, Select, Switch, Card, message, Upload, Modal, } from 'antd';
import TextArea from "antd/lib/input/TextArea";
import { useEffect, useState } from "react";
import { axiosClient } from "../../../config/axios";
import { useNavigate } from "react-router";
import { useStateContext } from "../../../context/ContextProvider";
import './ProjectDataForm.css';
import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";

const ProjectDataForm = ({ setNewProjectModalOpen, method, project_id, fetchProjects }) =>
{
	const [form] = Form.useForm();
	const [isChatVisible, setIsChatVisible] = useState(false);
	const [loading, setLoading] = useState(false);

	const [fileWithURL, setFileWithURL] = useState("");
	const [defaultFileList, setDefaultFileList] = useState([]);
	const [previewOpen, setPreviewOpen] = useState(false);
	const [previewImage, setPreviewImage] = useState("");
	const [previewTitle, setPreviewTitle] = useState("");


	const navigate = useNavigate();
	const { setActiveProjectDetails } = useStateContext();


	const handleFormSubmit = async () =>
	{
		try
		{
			await form.validateFields();

			const data = form.getFieldsValue();
			data.thumbnail = fileWithURL;
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
				setActiveProjectDetails(response.data.result);
				navigate(-1);
			}
		} catch (error)
		{
			console.log(error);
			message.error(error.message);
		}
	};

	const getBase64 = (file) =>
		new Promise((resolve, reject) =>
		{
			const reader = new FileReader();
			reader.readAsDataURL(file);
			reader.onload = () => resolve(reader.result);
			reader.onerror = (error) => reject(error);
		});

	const handlePreview = async (file) =>
	{
		if (!file.url && !file.preview)
		{
			file.preview = await getBase64(file.originFileObj);
		}
		setPreviewImage(file.url || file.preview);
		setPreviewOpen(true);
		setPreviewTitle(
			file.name || file.url.substring(file.url.lastIndexOf("/") + 1)
		);
	};

	const handleCancel = () => setPreviewOpen(false);

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

	const handleFileUpload = async (options) =>
	{
		setLoading(true);
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
			const newFileListWithURL = response?.data?.result?.url;
			setFileWithURL(newFileListWithURL);
			setLoading(false);
		} catch (error)
		{
			console.log(error);
			const err = new Error(error.message);
			onError(err);
			setLoading(false);
		}
	};

	const fetchProjectData = async () =>
	{
		try
		{
			const response = await axiosClient.get(`/projects/${project_id}`);
			form.setFieldsValue(response.data.result);

			if (response.data.result.thumbnail.length > 0)
			{

				setFileWithURL(response.data.result.thumbnail);
				setDefaultFileList([
					{
						uid: "-1",
						name: "Project Logo",
						status: "done",
						url: response.data.result.thumbnail,
					},
				]);
			}

			if (response.data.result.type === "SHARED")
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
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const uploadButton = (
		<div style={{ marginLeft: 8 }}>
			{loading ? <LoadingOutlined /> : <PlusOutlined />}
			<div
				style={{
					marginTop: 8,
				}}
			>
				Upload
			</div>
		</div>
	);

	const handleFileRemove = async (file) =>
	{
		try
		{
			const fileName = file.name;
			await axiosClient.delete(`/misc/delete/${fileName}`);
			message.success(`${file.name} file removed successfully.`);
			setFileWithURL("");
		}
		catch (error)
		{
			console.log(error);
			message.error(`${file.name} file removal failed.`);
		}
	};


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
					<Form.Item label={method === "Edit" ? "Change Logo" : "Project Logo"} valuePropName="checked" name="thumbnail">
						<Upload
							name="avatar"
							listType="picture-card"
							className="avatar-uploader"
							customRequest={handleFileUpload}
							fileList={defaultFileList}
							onChange={({ file, fileList }) => { setDefaultFileList(fileList); }}
							onRemove={(file) => handleFileRemove(file)}
							maxCount={1}
							onPreview={handlePreview}
						>
							{
								defaultFileList.length >= 1 ? null :
									uploadButton
							}
						</Upload>
						<Modal
							open={previewOpen}
							title={previewTitle}
							footer={null}
							onCancel={handleCancel}
						>
							<img
								alt="project-logo"
								style={{
									width: "100%"
								}}
								src={previewImage}
							/>
						</Modal>
					</Form.Item>
					<Form.Item
						className="project-data-form-submit-button"
					>
						<Button htmlType="submit" className='add-project-submit-btn'>{method === "Add" ? "Submit" : "Update"}</Button>
					</Form.Item>
				</Form>
			</Card >
		</div>
	);
};

export default ProjectDataForm;
