import { Col, Row, Select } from "antd";
import React from 'react';
import "./TaskItem.css";

const TaskItem = () =>
{
	return (
		<div className="taskitem-wrapper">
			<Row className="taskitem-row">
				<Col xs={24} md={24} lg={16}>
					<h3>Update documentation on developer site</h3>
				</Col>
				<Col xs={8} md={8} lg={4} >
					<h3>BYS - 164</h3>
				</Col>
				<Col xs={16} md={16} lg={4} >
					<Select defaultValue="to_do" className="progress-select">
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
