import { Divider, Table, Space, Select, Popconfirm, message, Button, Modal, Input, Result, Spin, Tag, Breadcrumb } from 'antd';
import { useEffect, useState } from 'react';
import { useLocation, useParams } from "react-router-dom";
import { DeleteFilled, MailOutlined } from "@ant-design/icons";

import './ProjectMembers.css';
import { axiosClient } from "../../../config/axios";

const confirm = (e) =>
{
	console.log(e);
	message.success('Click on Yes');
};

const cancel = (e) =>
{
	console.log(e);
	message.error('Click on No');
};

const columns = [
	{
		title: 'Name',
		dataIndex: 'name',
		ellipsis: true
	},
	{
		title: 'Display Name',
		dataIndex: 'display_name',
		ellipsis: true
	},
	{
		title: 'Action',
		dataIndex: 'name',
		render: (data) =>
		{
			const joined = data == "N - A";

			return (
				<div>
					<Space size="middle">
						<Select
							defaultValue={joined ? "read" : "admin"}
							style={{ width: "100px" }}
							placeholder="Select One"
							options={[
								{
									value: 'admin',
									label: 'Admin',
								},
								{
									value: 'write',
									label: 'Write',
								},
								{
									value: 'read',
									label: 'Read',
								},
							]}
						/>
					</Space>
					<Popconfirm
						title="Remove user"
						description="Are you sure to remove this user?"
						onConfirm={confirm}
						onCancel={cancel}
						okText="Yes"
						cancelText="No"
					>
						<DeleteFilled className="project-members-deletefilled-icon" />
					</Popconfirm>
					{
						joined &&
						<Tag color="orange">Pending</Tag>
					}

				</div>
			);
		},
		ellipsis: true
	},
];

const ProjectMembers = () =>
{
	const [isLoading, setIsLoading] = useState(false);
	const { project_id } = useParams();
	const [projectName, setProjectName] = useState("");

	const [data, setData] = useState([]);

	const fetchProjectMembers = async () => 
	{
		const response = await axiosClient.get(`/projects/${project_id}/members`);
		setProjectName(response.data.result.name);
		const memberDetails = response.data.result.members.map((member) =>
		{
			return {
				key: member.user._id,
				name: member.user.first_name + " " + member.user.last_name,
				display_name: member.user.display_name,
				id: member.user._id
			};
		});
		setData(memberDetails);
	};


	useEffect(() =>
	{
		fetchProjectMembers();
	}, []);

	const [isModalOpen, setIsModalOpen] = useState(false);
	const [inviteSent, setInviteSent] = useState(false);

	const showModal = () =>
	{
		setIsModalOpen(true);
	};

	const closeModal = () =>
	{
		setIsModalOpen(false);
		setInviteSent(false);
	};

	const handleSendInvite = () =>
	{
		setIsLoading(true);
		setTimeout(() =>
		{
			setInviteSent(true);
			setIsLoading(false);
		}, 2000);
	};

	return (
		<div>
			<Breadcrumb
				items={[
					{
						title: projectName,
					},
					{
						title: "Members"
					}
				]}
			/>
			<Button type="primary" onClick={showModal} className="invite-user-btn" >Invite User </Button>
			<Divider />
			<Table
				scroll={{ x: true }}
				bordered={true}
				columns={columns}
				dataSource={data}
			/>
			<Modal title="Invite User" open={isModalOpen} footer={null} onCancel={closeModal}>
				<Spin size="large" spinning={isLoading}>
					{!inviteSent
						?
						<div className="invite-form">
							<MailOutlined style={{ fontSize: 20, margin: 20, opacity: 0.5 }} className="invite-form-mailoutlined-icon" />
							<h3>Invite user to {projectName}</h3>
							<Space.Compact style={{ width: '100%' }} >
								<Input placeholder="Please input user display name" />
								<Button type="primary" onClick={handleSendInvite} className="invite-btn">Invite</Button>
							</Space.Compact>
						</div>
						:
						<Result
							status="success"
							title="Successfully sent invite!"
							subTitle={`User Avinash@2000 has been invited to ${projectName}`}
						/>
					}
				</Spin>
			</Modal>
		</div>
	);
};
export default ProjectMembers;
