import { Divider, Table, Space, Select, Popconfirm, message, Button, Modal, Input, Result, Spin, Tag } from 'antd';
import { useEffect, useState } from 'react';
import { DeleteFilled, MailOutlined } from "@ant-design/icons";

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
						<DeleteFilled style={{ fontSize: 20, margin: "0px 20px" }} />
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
	const [data, setData] = useState([
		{
			key: '1',
			name: 'Avinash Singh',
			display_name: "avinash_2000",
			id: 200
		},
		{
			key: '2',
			name: 'Rajen Roy',
			display_name: "Rajen_3245",
			id: 201
		},
		{
			key: '3',
			name: 'Pratyayee Bhatacharjee',
			display_name: "Pratyayee_3465",
			id: 203,
		},
		{
			key: '4',
			name: 'Tanmay Roy',
			display_name: "Tanmay_2348",
			id: 302
		},
		{
			key: '5',
			name: "N - A",
			display_name: "avinash@2000",
			id: 304
		}
	]);

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
			<Button type="primary" style={{ float: "right", margin: "0px 20px 20px 0px", backgroundColor: "var(--darkblue)", color: "white" }} onClick={showModal} >Invite User </Button>
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
						<div style={{ textAlign: "center" }}>
							<MailOutlined style={{ fontSize: 40, opacity: 0.5, margin: 20 }} />
							<h3>Invite user to bentley systems</h3>
							<Space.Compact style={{ width: '100%' }}>
								<Input placeholder="Please input user display name" />
								<Button type="primary" style={{ backgroundColor: "var(--darkblue)", color: "white" }} onClick={handleSendInvite}>Invite</Button>
							</Space.Compact>
						</div>
						:
						<Result
							status="success"
							title="Successfully sent invite!"
							subTitle="User Avinash@2000 has been invited to Bentley Systems"
						/>
					}
				</Spin>
			</Modal>
		</div>
	);
};
export default ProjectMembers;
