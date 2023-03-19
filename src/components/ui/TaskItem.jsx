import { Card, Col, Row, Select } from "antd";
import React from 'react';

const TaskItem = () =>
{
	return (
		<div style={{ padding: 10, border: "1px solid lightgray", borderRadius: 5, margin: 5 }}>
			<Row style={{ padding: "0px 10px" }}>
				<Col xs={24} md={24} lg={16}>
					<h3>Update documentation on developer site</h3>
				</Col>
				<Col xs={8} md={8} lg={4} >
					<h3>BYS - 164</h3>
				</Col>
				<Col xs={16} md={16} lg={4} >
					<Select style={{ width: 120 }} defaultValue="to_do">
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
