import React from 'react';
import { Breadcrumb, Space, Button, Divider, Row, Col, Select, Avatar, Image, Tabs } from "antd";
import { UserOutlined, ApartmentOutlined, LinkOutlined } from "@ant-design/icons";
import TaskItem from "../../components/ui/TaskItem";
import { useLocation } from "react-router-dom";

const TaskInfo = () =>
{
	const location = useLocation();

	console.log(location.state);

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
				<Col xs={24} sm={24} md={24} lg={16} xl={20} style={{ marginBottom: 50, paddingRight: 20 }}>
					<h2 style={{ fontWeight: "600" }}>Implementation details of web sockets</h2>

					<Space style={{ margin: "20px 0px" }}>
						<Button type="primary"> <LinkOutlined />Attach</Button>
						<Button type="primary"><ApartmentOutlined />Add sub task</Button>
					</Space>

					<h3>Description</h3>

					<div style={{ textAlign: 'left', marginBottom: 20 }}>
						<span style={{ fontSize: 16 }}>A close terrestial analogy is provided by a tennis ball bouncing off the front of a moving train. Imagine standing on a train platform, and throwing a ball at 30km/hr toward a train approaching at 50km/hr.</span>
					</div>

					<h3>Attachments</h3>
					<div style={{ display: "flex", flexDirection: "row", overflow: "scroll", marginTop: 20 }}>
						<div style={{ marginRight: 10 }} >
							<Image
								style={{ borderRadius: 10 }}
								width={160}
								height={120}
								src="https://project-management.com/wp-content/uploads/2019/12/pros-and-cons-of-jira-screenshot-06-2021-1.png"
							/>
						</div>
						<div style={{ marginRight: 10 }} >
							<Image
								style={{ borderRadius: 10 }}
								width={160}
								height={120}
								src="https://project-management.com/wp-content/uploads/2019/12/pros-and-cons-of-jira-screenshot-06-2021-1.png"
							/>
						</div>
						<div style={{ marginRight: 10 }} >
							<Image
								style={{ borderRadius: 10 }}
								width={160}
								height={120}
								src="https://project-management.com/wp-content/uploads/2019/12/pros-and-cons-of-jira-screenshot-06-2021-1.png"
							/>
						</div>
						<div style={{ marginRight: 10 }} >
							<Image
								style={{ borderRadius: 10 }}
								width={160}
								height={120}
								src="https://project-management.com/wp-content/uploads/2019/12/pros-and-cons-of-jira-screenshot-06-2021-1.png"
							/>
						</div>
						<div style={{ marginRight: 10 }} >
							<Image
								style={{ borderRadius: 10 }}
								width={160}
								height={120}
								src="https://project-management.com/wp-content/uploads/2019/12/pros-and-cons-of-jira-screenshot-06-2021-1.png"
							/>
						</div>
						<div style={{ marginRight: 10 }} >
							<Image
								style={{ borderRadius: 10 }}
								width={160}
								height={120}
								src="https://project-management.com/wp-content/uploads/2019/12/pros-and-cons-of-jira-screenshot-06-2021-1.png"
							/>
						</div>
						<div style={{ marginRight: 10 }} >
							<Image
								style={{ borderRadius: 10 }}
								width={160}
								height={120}
								src="https://project-management.com/wp-content/uploads/2019/12/pros-and-cons-of-jira-screenshot-06-2021-1.png"
							/>
						</div>
						<div style={{ marginRight: 10 }} >
							<Image
								style={{ borderRadius: 10 }}
								width={160}
								height={120}
								src="https://project-management.com/wp-content/uploads/2019/12/pros-and-cons-of-jira-screenshot-06-2021-1.png"
							/>
						</div>
						<div style={{ marginRight: 10 }} >
							<Image
								style={{ borderRadius: 10 }}
								width={160}
								height={120}
								src="https://project-management.com/wp-content/uploads/2019/12/pros-and-cons-of-jira-screenshot-06-2021-1.png"
							/>
						</div>
					</div>
				</Col>
				<Col xs={24} sm={24} md={24} lg={8} xl={4}>
					<Select
						defaultValue="to_do"
						style={{ width: 200 }}
					>
						<Select.Option value="in_progress">In-progress</Select.Option>
						<Select.Option value="to_do">To-do</Select.Option>
						<Select.Option value="completed">Completed</Select.Option>
						<Select.Option value="closed">Closed</Select.Option>
					</Select>
					<div style={{ margin: "20px 0px" }}>
						<table style={{ width: "100%" }}>
							<tbody>
								<tr style={{ height: 50 }}>
									<td style={{ width: 100 }}>
										<h3 >Assignee </h3>
									</td>
									<td>
										<span style={{ fontSize: 18, fontWeight: "600", color: "gray" }}><Avatar icon={<UserOutlined />} style={{ marginRight: 5 }} />Avinash Singh</span>
									</td>
								</tr>
								<tr style={{ height: 50 }}>
									<td style={{ width: 100 }}>
										<h3 >Reporter </h3>
									</td>
									<td>
										<span style={{ fontSize: 18, fontWeight: "600", color: "gray" }}><Avatar icon={<UserOutlined />} style={{ marginRight: 5 }} />Rajen Roy</span>
									</td>
								</tr>
								<tr style={{ height: 50 }}>
									<td style={{ width: 100 }}>
										<h3 >Created </h3>
									</td>
									<td>
										<h3 style={{ fontSize: 18, fontWeight: "600", color: "gray" }}>22-03-2023</h3>
									</td>
								</tr>
								<tr style={{ height: 50 }}>
									<td style={{ width: 100 }}>
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
			</Row>
			<Row>
				<Col xs={24} sm={24} md={24} lg={16} xl={20}>
					<Tabs defaultActiveKey="1" items={items} onChange={onChange} />
				</Col>
			</Row>
		</div>
	);
};

export default TaskInfo;
