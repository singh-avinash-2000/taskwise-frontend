import {
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
} from 'antd';

import TextArea from "antd/lib/input/TextArea";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import './ProjectDataForm.css'

const ProjectDataForm = () => {
	const [form] = Form.useForm();
	const [isChatVisible, setIsChatVisible] = useState(false);
	const navigate = useNavigate();

	const handleFormSubmit = async () => {
		await form.validateFields();
	};

	const handleDropDownChange = (value) => {
		if (value == "shared") {
			setIsChatVisible(true);
		}
		else {
			setIsChatVisible(false);
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
						name="project_name"
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
						name="project_type"
						rules={[
							{
								required: true,
								message: 'Please select project type',
							},
						]}
					>
						<Select placeholder="Select One" onChange={handleDropDownChange}>
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
					>
						<TextArea placeholder="Please input project description" />
					</Form.Item>
					{
						isChatVisible && <Form.Item label="Chat" valuePropName="checked" name="chat_checked">
							<Switch />
						</Form.Item>
					}

					<Form.Item label="Document" valuePropName="checked" name="document_checked">
						<Switch />
					</Form.Item>
					<Form.Item
						className="project-data-form-submit-button"
					>
						<Button htmlType="submit" shape="round" className='add-project-submit-btn'>Submit</Button>
					</Form.Item>
				</Form>
			</Card >
		</div>
	);
};

export default ProjectDataForm;
