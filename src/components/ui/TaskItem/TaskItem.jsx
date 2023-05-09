import React from 'react';
import { Col, Row, Select, message } from "antd";
import "./TaskItem.css";
import { useNavigate, useParams } from "react-router-dom";
import { axiosClient } from "../../../config/axios";

const TaskItem = ({ summary, task_key, status }) =>
{

	const { project_id } = useParams();
	const navigate = useNavigate();

	const handleStatusChange = async (value) =>
	{
		await axiosClient.patch(`/projects/${project_id}/tasks/${task_key}`, { status: value.toUpperCase() });
		message.success("Sub-Task status updated successfully");
	};

	return (
		<div className="taskitem-wrapper" onClick={() => navigate(`/project/${project_id}/tasks/${task_key}`)}>
			<Row className="taskitem-row">
				<Col xs={24} md={24} lg={16}>
					<h3>{summary}</h3>
				</Col>
				<Col xs={8} md={8} lg={4} >
					<h3>{task_key}</h3>
				</Col>
				<Col xs={16} md={16} lg={4} >
					<Select defaultValue={status} className="progress-select" onChange={(value) => { handleStatusChange(value); }} onClick={(e) => e.stopPropagation()}>
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
