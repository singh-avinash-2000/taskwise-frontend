import React, { useState } from 'react';
import { Avatar, Breadcrumb, Select, Table, Tooltip, Typography, Tag, Button, Modal } from "antd";
import { MinusSquareOutlined, MinusSquareTwoTone, PlusSquareOutlined, PlusSquareTwoTone } from "@ant-design/icons";
import { useNavigate, useLocation } from "react-router-dom";
import NewTask from "./NewTask";

import "../css/TaskList.css";

const { Text } = Typography;

const TaskList = () =>
{
	const [isModalOpen, setIsModalOpen] = useState(false);
	const navigate = useNavigate();

	const generateIndex = (limit) =>
	{
		return Math.floor(Math.random() * limit);
	};

	const columns = [
		{
			title: 'Type',
			dataIndex: 'type',
			key: 'type',
			render: (type) => <Tooltip title={type === "sub_task" ? "Sub Task" : "Main Task"}>{type === "sub_task" ? <Tag color="red"><MinusSquareOutlined /></Tag> : <Tag color="green"><PlusSquareOutlined /></Tag>}</Tooltip>,
		},
		{
			title: 'Key',
			dataIndex: 'key',
			key: 'key',
		},
		{
			title: 'Summary',
			dataIndex: 'summary',
			key: 'summary',
			ellipsis: true,
		},
		{
			title: 'Assignee',
			key: 'assignee',
			dataIndex: 'assignee',
			render: (assignee) => (
				<>
					<Avatar src={`https://joesch.moe/api/v1/random?key=${Math.ceil(Math.random() * 99)}`} /> {assignee}
				</>
			),
		},
		{
			title: 'Reporter',
			key: 'reporter',
			dataIndex: 'reporter',
			render: (reporter) => (
				<>
					<Avatar src={`https://joesch.moe/api/v1/random?key=${Math.ceil(Math.random() * 99)}`} /> {reporter}
				</>
			),
		},
		{
			title: 'Priority',
			dataIndex: "priority",
			key: 'priority'
		},
		{
			title: 'Status',
			dataIndex: "status",
			key: 'status',
			render: (status) => (
				<>
					<Select value={status} onClick={(e) =>
					{
						e.stopPropagation();
					}} className="task-status-select">
						<Select.Option value="to_do">To-do</Select.Option>
						<Select.Option value="in_progress">In progress</Select.Option>
						<Select.Option value="completed">Completed</Select.Option>
						<Select.Option value="closed">Closed</Select.Option>
					</Select >
				</>
			)
		},
		{
			title: 'Created date',
			dataIndex: "created_date",
			key: 'created_date',
		},
		{
			title: 'Updated date',
			dataIndex: "updated_date",
			key: 'updated_date'
		},
	];

	const typeArray = ["sub_task", "main_task"];
	const sentences = [
		'not even Dora can explore her',
		' I swerved to miss her and ran out of gas',
		'smelly she put on Right Guard and it went left',
		'she hasn’t got cellulite, she’s got celluheavy',
		'she don’t need no internet – she’s already world wide',
		'hair her look like Don King in a headlock',
		'classless she could be a Marxist utopia',
		'she can hear bacon cooking in Canada',
		'she won “The Bachelor” because she all those other bitches',
		'stupid she believes everything that Brian Williams says',
		'she scared off Flavor Flav',
		'like Domino’s Pizza, one call does it all',
		'twice the man you are',
		'like Bazooka Joe, 5 cents a blow',
		'like an ATM, open 24/7',
		'like a championship ring, everybody puts a finger in her'
	];
	const nameArray = ["Avinash", "Rajen", "Pratyayee", "Tanmoy"];
	const priorityArray = ["High", "Low", "Medium", "Urgent"];
	const statusArray = ["in_progress", "to_do", "completed", "closed"];

	let data = [];

	function getRandomDate()
	{
		const emptyDate = new Date();
		const randomDate = new Date();
		const dateFormatter = Intl.DateTimeFormat('sv-SE');
		const formattedRandomDate = dateFormatter.format(emptyDate.setDate(randomDate.getDate() - Math.floor(Math.random() * 1000)));

		return formattedRandomDate;
	}

	const handleTaskCreation = () =>
	{
		setIsModalOpen(true);
	};

	for (let i = 0; i < 25; i++)
	{
		data.push(
			{
				type: typeArray[generateIndex(2)],
				key: `BYS-${generateIndex(99999)}`,
				summary: sentences[generateIndex(16)],
				assignee: nameArray[generateIndex(4)],
				reporter: nameArray[generateIndex(4)],
				priority: priorityArray[generateIndex(4)],
				status: statusArray[generateIndex(4)],
				created_date: getRandomDate(),
				updated_date: getRandomDate(),
			}
		);
	}

	const handleRowClick = (event) =>
	{
		console.log(event.target.value);
		navigate(`/project/tasks/${event.key}`);
		console.log(event);
	};

	return (
		<div>
			<Breadcrumb
				items={[
					{
						title: 'Bentley Systems',
					},
					{
						title: "Tasks"
					}
				]}
			/>
			<Button type="primary"
				onClick={handleTaskCreation}
				className="create-new-task-btn">
				Create new task
			</Button>
			<Table
				columns={columns}
				dataSource={data}
				scroll={{ x: true }}
				size="large"
				onRow={(record, rowIndex) =>
				{
					return {
						onClick: (event) =>
						{
							handleRowClick(event);
						},
					};
				}} />

			<Modal title="Create Task" open={isModalOpen} onCancel={() => { setIsModalOpen(false); }} footer={null}>
				<NewTask />
			</Modal>
		</div>
	);
};

export default TaskList;
