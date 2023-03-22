import
{
	Tabs,
	Button,
	Cascader,
	DatePicker,
	Form,
	Input,
	InputNumber,
	Radio,
	Select,
	Switch,
	TreeSelect,
	Card,
	Mentions,
	Upload,
	message,
	AutoComplete
} from 'antd';
import { Editor } from "react-draft-wysiwyg";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { convertFromRaw, convertToRaw, EditorState } from "draft-js";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { InboxOutlined } from "@ant-design/icons";

import './ProjectNewTaskForm.css';

const { Dragger } = Upload;

const ProjectNewTaskForm = () =>
{
	const [form] = Form.useForm();
	const navigate = useNavigate();
	const [prefix, setPrefix] = useState('@');
	const [editorState, setEditorState] = useState(EditorState.createEmpty());

	const onSearch = (_, newPrefix) =>
	{
		setPrefix(newPrefix);
	};

	const handleFormSubmit = async () =>
	{
		await form.validateFields();
		navigate("/dashboard");
	};

	const handleDropDownChange = (value) =>
	{

	};

	const onEditorStateChange = (value) =>
	{
		setEditorState(value);
	};

	const MOCK_DATA = {
		'@': ['afc163', 'zombiej', 'yesmeck']
	};

	useEffect(() =>
	{
		const contentState = convertFromRaw({
			"blocks": [
				{
					"key": "7tue7",
					"text": "Description",
					"type": "unstyled",
					"depth": 0,
					"inlineStyleRanges": [
						{
							"offset": 0,
							"length": 11,
							"style": "BOLD"
						},
						{
							"offset": 0,
							"length": 11,
							"style": "ITALIC"
						}
					],
					"entityRanges": [],
					"data": {}
				}
			],
			"entityMap": {}
		});
		setEditorState(EditorState.createWithContent(contentState));
	}, []);

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
					onFinish={handleFormSubmit}
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
						true &&
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
						rules={[
							{
								required: true,
								message: 'Please input task description',
							},
						]}
					>
						{/* <TextArea placeholder="Please input task description" /> */}
						<div className="new-task-description-wrapper">
							<Editor
								editorState={editorState}
								toolbarClassName="toolbarClassName"
								wrapperClassName="wrapperClassName"
								editorClassName="editorClassName"
								onEditorStateChange={onEditorStateChange}
							/>
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
						<Mentions
							style={{
								width: '100%',
							}}
							placeholder="input @ to mention people"
							prefix={['@']}
							onSearch={onSearch}
							options={(MOCK_DATA[prefix] || []).map((value) => ({
								key: value,
								value,
								label: value,
							}))}
						/>
					</Form.Item>
					<Form.Item label="Documents" valuePropName="checked" name="document_checked">
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
