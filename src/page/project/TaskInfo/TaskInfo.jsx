import React from 'react';
import { Breadcrumb, Space, Button, Divider, Row, Col, Select, Avatar, Image, Tabs } from "antd";
import { UserOutlined, ApartmentOutlined, LinkOutlined } from "@ant-design/icons";
import TaskItem from "../../../components/ui/TaskItem/TaskItem";
import { useLocation } from "react-router-dom";

import './TaskInfo.css';

const TaskInfo = () =>
{
	const location = useLocation();

	const onChange = (key) =>
	{
		console.log(key);
	};

	const items = [
		{
			key: '1',
			label: `Subtasks`,
			children: <>
				<TaskItem />
				<TaskItem />
				<TaskItem />
				<TaskItem />
				<TaskItem />
				<TaskItem />
				<TaskItem />
				<TaskItem />
				<TaskItem />
			</>,
		},
		{
			key: '2',
			label: `History`,
			children: `Content of Tab Pane 2`,
		}
	];

	return (
		<div>
			<Breadcrumb
				items={[
					{
						title: 'Bentley Systems',
					},
					{
						title: "Tasks"
					},
					{
						title: 'BYS - 164',
					},
				]}
			/>

			<Row>
				<Col xs={24} sm={24} md={24} lg={16} xl={18} className="project-task-info-wrapper">
					<h2 style={{ fontWeight: "600" }}>Implementation details of web sockets</h2>

					<Space className="space">
						<Button type="primary"> <LinkOutlined />Attach</Button>
						<Button type="primary"><ApartmentOutlined />Add sub task</Button>
					</Space>

					<h3>Description</h3>

					<div className="description-content">
						<span className="description-content-span">A close terrestial analogy is provided by a tennis ball bouncing off the front of a moving train. Imagine standing on a train platform, and throwing a ball at 30km/hr toward a train approaching at 50km/hr.</span>
					</div>

					<h3>Attachments</h3>
					<div className="attachments-wrapper">
						<div>
							<Image
								width={160}
								height={120}
								src="https://project-management.com/wp-content/uploads/2019/12/pros-and-cons-of-jira-screenshot-06-2021-1.png"
								className="attachment-image"
							/>
						</div>
						<div>
							<Image
								width={160}
								height={120}
								src="https://project-management.com/wp-content/uploads/2019/12/pros-and-cons-of-jira-screenshot-06-2021-1.png"
								className="attachment-image"
							/>
						</div>
						<div>
							<Image
								width={160}
								height={120}
								src="https://project-management.com/wp-content/uploads/2019/12/pros-and-cons-of-jira-screenshot-06-2021-1.png"
								className="attachment-image"
							/>
						</div>
						<div>
							<Image
								width={160}
								height={120}
								src="https://project-management.com/wp-content/uploads/2019/12/pros-and-cons-of-jira-screenshot-06-2021-1.png"
								className="attachment-image"
							/>
						</div>
						<div>
							<Image
								width={160}
								height={120}
								src="https://project-management.com/wp-content/uploads/2019/12/pros-and-cons-of-jira-screenshot-06-2021-1.png"
								className="attachment-image"
							/>
						</div>
						<div>
							<Image
								width={160}
								height={120}
								src="https://project-management.com/wp-content/uploads/2019/12/pros-and-cons-of-jira-screenshot-06-2021-1.png"
								className="attachment-image"
							/>
						</div>
						<div>
							<Image
								width={160}
								height={120}
								src="https://project-management.com/wp-content/uploads/2019/12/pros-and-cons-of-jira-screenshot-06-2021-1.png"
								className="attachment-image"
							/>
						</div>
						<div>
							<Image
								width={160}
								height={120}
								src="https://project-management.com/wp-content/uploads/2019/12/pros-and-cons-of-jira-screenshot-06-2021-1.png"
								className="attachment-image"
							/>
						</div>
						<div>
							<Image
								width={160}
								height={120}
								src="https://project-management.com/wp-content/uploads/2019/12/pros-and-cons-of-jira-screenshot-06-2021-1.png"
								className="attachment-image"
							/>
						</div>
					</div>
				</Col>
				<Col xs={24} sm={24} md={24} lg={8} xl={6} style={{ paddingLeft: 20 }}>
					<Select
						defaultValue="to_do"
						className="to_do"
					>
						<Select.Option value="in_progress">In-progress</Select.Option>
						<Select.Option value="to_do">To-do</Select.Option>
						<Select.Option value="completed">Completed</Select.Option>
						<Select.Option value="closed">Closed</Select.Option>
					</Select>
					<div className="task-details">
						<table className="task-table">
							<tbody>
								<tr className="task-table-row">
									<td className="task-table-data">
										<h3 >Assignee </h3>
									</td>
									<td>
										<span style={{ fontSize: 18, fontWeight: "600", color: "gray" }}><Avatar icon={<UserOutlined />} style={{ marginRight: 5 }} />Avinash Singh</span>
									</td>
								</tr>
								<tr className="task-table-row">
									<td className="task-table-data">
										<h3 >Reporter </h3>
									</td>
									<td>
										<span style={{ fontSize: 18, fontWeight: "600", color: "gray" }}><Avatar icon={<UserOutlined />} style={{ marginRight: 5 }} />Rajen Roy</span>
									</td>
								</tr>
								<tr className="task-table-row">
									<td className="task-table-data">
										<h3 >Created </h3>
									</td>
									<td>
										<h3 style={{ fontSize: 18, fontWeight: "600", color: "gray" }}>22-03-2023</h3>
									</td>
								</tr>
								<tr className="task-table-row">
									<td className="task-table-data">
										<h3 >Updated </h3>
									</td>
									<td>
										<h3 style={{ fontSize: 18, fontWeight: "600", color: "gray" }}>22-03-2023 03:14:07</h3>
									</td>
								</tr>
							</tbody>
						</table>
					</div>
				</Col>
				<Col xs={24} sm={24} md={24} lg={16} xl={18}>
					<Tabs defaultActiveKey="1" items={items} onChange={onChange} />
				</Col>
			</Row>
		</div>
	);
};

export default TaskInfo;
