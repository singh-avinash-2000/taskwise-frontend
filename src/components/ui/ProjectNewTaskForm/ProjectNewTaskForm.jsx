import { Button, Form, Input, Select, Card, Upload, message, AutoComplete } from 'antd';
import { useEffect, useRef, useState } from "react";
import 'react-quill/dist/quill.snow.css';
import { InboxOutlined } from "@ant-design/icons";
import ReactQuill from 'react-quill';
import './ProjectNewTaskForm.css';
import { axiosClient } from "../../../config/axios";
import { useParams } from "react-router-dom";
import { useStateContext } from "../../../context/ContextProvider";

const { Dragger } = Upload;

const ProjectNewTaskForm = ({ method, taskDetails, closeModal, task_type }) =>
{
	const [form] = Form.useForm();
	const quillRef = useRef(null);
	const [description, setDescription] = useState(taskDetails.description);
	const { project_id, task_key } = useParams();
	const [defaultFileList, setDefaultFileList] = useState([]);
	const [fileWithURL, setFileWithURL] = useState([]);

	const { labelMembers } = useStateContext();

	const handleFormSubmit = async () =>
	{
		try
		{
			const valid = await form.validateFields();
			if (valid)
			{
				const values = form.getFieldsValue();
				values.task_description_raw = quillRef.current.getEditor().getContents();
				values.type = task_type;
				values.documents = fileWithURL;

				let response = {};
				if (method != "update")
				{
					response = await axiosClient.post(`/projects/${project_id}/tasks`, values);
				}
				else
				{
					values.parent_task_key = task_key;
					response = await axiosClient.patch(`/projects/${project_id}/tasks/${task_key}`, values);
				}

				message.success(response.data.message);
				closeModal();
			}
		}
		catch (error)
		{
			console.log(error);
		}
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
			const newFileListWithURL = [...fileWithURL, { name: response?.data?.result?.filename, url: response?.data?.result?.url }];
			setFileWithURL(newFileListWithURL);
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

	const toolbarOptions = [
		['bold', 'italic', 'underline', 'strike'],
		['blockquote', 'code-block'],

		[{ 'header': 1 }, { 'header': 2 }],
		[{ 'list': 'ordered' }, { 'list': 'bullet' }],
		[{ 'script': 'sub' }, { 'script': 'super' }],
		[{ 'indent': '-1' }, { 'indent': '+1' }],
		[{ 'direction': 'rtl' }],

		[{ 'size': ['small', false, 'large', 'huge'] }],
		[{ 'header': [1, 2, 3, 4, 5, 6, false] }],

		[{ 'color': [] }, { 'background': [] }],
		[{ 'font': [] }],
		[{ 'align': [] }],

		['clean']
	];

	useEffect(() =>
	{
		if (method == "update")
		{
			form.setFieldsValue(taskDetails);
		}
		else 
		{
			form.resetFields();
		}
	}, []);

	return (
		<div>
			<Card
				className="project-new-task-form-card">
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
					onSubmitCapture={handleFormSubmit}
				>
					<Form.Item
						label="Task Type"
					>
						<Select placeholder="Select One" value={task_type} disabled={true}>
							<Select.Option value="MAIN_TASK">Main Task</Select.Option>
							<Select.Option value="SUB_TASK">Sub Task</Select.Option>
						</Select>
					</Form.Item>
					<Form.Item label="Summary"
						name="summary"
						rules={[
							{
								required: true,
								message: 'Please input task summary',
							},
						]}
					>
						<Input type="text" placeholder="Task Summary" />
					</Form.Item>
					<Form.Item label="Description"
						name="description"
					>
						<div className="new-task-description-wrapper">
							<ReactQuill theme="snow" modules={{ toolbar: toolbarOptions }} ref={quillRef} value={description} onChange={(value) =>
							{
								setDescription(value);
								form.setFieldValue("description", value);
							}} />
						</div>
					</Form.Item>
					<Form.Item label="Priority"
						name="priority"
						rules={[
							{
								required: true,
								message: 'Please select task priority',
							},
						]}
					>
						<Select placeholder="Select One">
							<Select.Option value="LOW">Low</Select.Option>
							<Select.Option value="MEDIUM">Medium</Select.Option>
							<Select.Option value="HIGH">High</Select.Option>
							<Select.Option value="URGENT">Urgent</Select.Option>
						</Select>
					</Form.Item>
					<Form.Item
						label="Assignee"
						name="assignee"
						rules={[
							{
								required: true,
								message: 'Please select a assignee'
							}
						]}
					>
						<Select
							mode="multiple"
							allowClear
							style={{
								width: '100%',
							}}
							placeholder="Please select assignees"
							options={labelMembers}
						/>
					</Form.Item>
					{method !== "update" && <Form.Item label="Documents" valuePropName="files" name="documents">

						<Dragger
							multiple={true}
							customRequest={handleFileUpload}
							defaultFileList={defaultFileList}
							onChange={({ file, fileList }) => { console.log(fileList); setDefaultFileList(fileList); }}
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
					</Form.Item>}
					<Form.Item
						style={{ textAlign: "center" }}
					>
						<Button htmlType="submit" shape="round" className='add-project-task-btn'>{method == "update" ? "Update" : "Submit"}</Button>
					</Form.Item>
				</Form>
			</Card >
		</div>
	);
};

export default ProjectNewTaskForm;
