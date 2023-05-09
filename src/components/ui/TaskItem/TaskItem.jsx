import { Col, Row, Select, message } from "antd";
import React from 'react';
import "./TaskItem.css";
import { useParams } from "react-router-dom";
import { axiosClient } from "../../../config/axios";

const TaskItem = ({ summary, task_key, status, setSubtasks }) =>
{

	const { project_id } = useParams();

	const handleStatusChange = async (value) =>
	{
		const response = await axiosClient.patch(`/projects/${project_id}/tasks/${task_key}`, { status: value.toUpperCase() });
		console.log(response.data?.result);
		message.success("Sub-Task status updated successfully");
	};

	return (
		<div className="taskitem-wrapper">
			<Row className="taskitem-row">
				<Col xs={24} md={24} lg={16}>
					<h3>{summary}</h3>
				</Col>
				<Col xs={8} md={8} lg={4} >
					<h3>{task_key}</h3>
				</Col>
				<Col xs={16} md={16} lg={4} >
					<Select defaultValue={status} className="progress-select" onChange={(value) => { handleStatusChange(value); }}>
						<Select.Option value="to_do">To do</Select.Option>
						<Select.Option value="in_progress">In progress</Select.Option>
						<Select.Option value="completed">Completed</Select.Option>
						<Select.Option value="closed">Closed</Select.Option>
					</Select>
				</Col>
			</Row>
		</div>
	);
};

export default TaskItem;
