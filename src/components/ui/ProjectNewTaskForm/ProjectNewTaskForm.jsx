import { Button, Form, Input, Select, Card, Upload, message, AutoComplete } from 'antd';
import { useEffect, useRef, useState } from "react";
import 'react-quill/dist/quill.snow.css';
import { InboxOutlined } from "@ant-design/icons";
import ReactQuill from 'react-quill';
import './ProjectNewTaskForm.css';
import { axiosClient } from "../../../config/axios";

const { Dragger } = Upload;

const ProjectNewTaskForm = ({ project_id }) =>
{
	const [form] = Form.useForm();
	const [hideTaskKey, setHideTaskKey] = useState(false);
	const quillRef = useRef(null);

	const handleFormSubmit = async () =>
	{
		try
		{
			const valid = await form.validateFields();
			if (valid)
			{
				const values = form.getFieldsValue();
				console.log(values);
				values.task_description_raw = quillRef.current.getEditor().getContents();

				const response = await axiosClient.post(`/projects/${project_id}/tasks`, values);
				console.log(response.data.result);
			}
		} catch (error)
		{
			console.log(error);
		}
	};

	const handleDropDownChange = (value) =>
	{
		if (value == "main_task")
		{
			setHideTaskKey(false);
		}
		else
		{
			setHideTaskKey(true);
		}
	};

	const props = {
		name: 'file',
		multiple: true,
		action: 'https://www.mocky.io/v2/5cc8019d300000980a055e76',
		onChange(info)
		{
			const { status } = info.file;
			if (status !== 'uploading')
			{
				console.log(info.file, info.fileList);
			}
			if (status === 'done')
			{
				message.success(`${info.file.name} file uploaded successfully.`);
			} else if (status === 'error')
			{
				message.error(`${info.file.name} file upload failed.`);
			}
		},
		onDrop(e)
		{
			console.log('Dropped files', e.dataTransfer.files);
		},
	};

	var toolbarOptions = [
		['bold', 'italic', 'underline', 'strike'],        // toggled buttons
		['blockquote', 'code-block'],

		[{ 'header': 1 }, { 'header': 2 }],               // custom button values
		[{ 'list': 'ordered' }, { 'list': 'bullet' }],
		[{ 'script': 'sub' }, { 'script': 'super' }],      // superscript/subscript
		[{ 'indent': '-1' }, { 'indent': '+1' }],          // outdent/indent
		[{ 'direction': 'rtl' }],                         // text direction

		[{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
		[{ 'header': [1, 2, 3, 4, 5, 6, false] }],

		[{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
		[{ 'font': [] }],
		[{ 'align': [] }],

		['clean']                                         // remove formatting button
	];

	const assigneeOptions = [
		{ label: "Avinash Singh", value: "12" },
		{ label: "Ritik Mishra", value: "23" },
		{ label: "Aman Singh", value: "345" },
		{ label: "Gaurav Singh", value: "4545" }
	];

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
					<Form.Item label="Type"
						name="task_type"
						rules={[
							{
								required: true,
								message: 'Please select task type',
							},
						]}
					>
						<Select placeholder="Select One" onChange={handleDropDownChange}>
							<Select.Option value="main_task">Main Task</Select.Option>
							<Select.Option value="sub_task">Sub Task</Select.Option>
						</Select>
					</Form.Item>
					{
						hideTaskKey &&
						<Form.Item label="Task Key"
							name="task_key"
							rules={[
								{
									required: true,
									message: 'Please input task key',
								},
							]}
						>
							<AutoComplete
								options={[{ value: "BYS-162" },
								{ value: "BYS-12" },
								{ value: "BYS-1234" },
								{ value: "BYS-134" }]}
								className="task-key-autocomplete"
								placeholder="input here"
							/>
						</Form.Item>

					}
					<Form.Item label="Summary"
						name="task_summary"
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
						name="task_description"
					>
						<div className="new-task-description-wrapper">
							<ReactQuill theme="snow" modules={{ toolbar: toolbarOptions }} ref={quillRef} onChange={(value) =>
							{
								form.setFieldValue("task_description", value);
							}} />
						</div>
					</Form.Item>
					<Form.Item label="Priority"
						name="task_priority"
						rules={[
							{
								required: true,
								message: 'Please select task priority',
							},
						]}
					>
						<Select placeholder="Select One" onChange={handleDropDownChange}>
							<Select.Option value="low">Low</Select.Option>
							<Select.Option value="medium">Medium</Select.Option>
							<Select.Option value="high">High</Select.Option>
							<Select.Option value="urgent">Urgent</Select.Option>
						</Select>
					</Form.Item>
					<Form.Item
						label="Assignee"
						name="task_assignee"
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
							options={assigneeOptions}
						/>
					</Form.Item>
					<Form.Item label="Documents" valuePropName="files" name="document_files">
						<Dragger {...props}>
							<p className="ant-upload-drag-icon">
								<InboxOutlined />
							</p>
							<p className="ant-upload-text">Click or drag file to this area to upload</p>
							<p className="ant-upload-hint">
								Support for a single or bulk upload. Strictly prohibited from uploading company data or other
								banned files.
							</p>
						</Dragger>
					</Form.Item>
					<Form.Item
						style={{ textAlign: "center" }}
					>
						<Button htmlType="submit" shape="round" className='add-project-task-btn'>Submit</Button>
					</Form.Item>
				</Form>
			</Card >
		</div>
	);
};

export default ProjectNewTaskForm;
