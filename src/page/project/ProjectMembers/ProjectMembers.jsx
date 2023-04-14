import { Divider, Table, Space, Select, Popconfirm, message, Button, Modal, Input, Result, Spin, Tag, Breadcrumb } from 'antd';
import { useEffect, useState } from 'react';
import { useParams } from "react-router-dom";
import { DeleteFilled, MailOutlined } from "@ant-design/icons";
import { axiosClient } from "../../../config/axios";

import './ProjectMembers.css';
import { useStateContext } from "../../../context/ContextProvider";

const { Option } = Select;

const ProjectMembers = () =>
{
	const [isLoading, setIsLoading] = useState(false);
	const { project_id } = useParams();
	const [data, setData] = useState([]);
	const { activeProjectName } = useStateContext();

	const confirm = async (_, record) =>
	{
		try
		{
			await axiosClient.delete(`/projects/${record.project_id}/members/${record.id}`);
			message.success(`Successfully removed ${record.name} from the project`);
			fetchProjectMembers();
		} catch (error)
		{
			message.error(error.message);
		}
	};

	const cancel = (e) =>
	{
		message.error('Cancelled');
	};

	const handleActionChange = async (value, record) =>
	{
		try
		{
			await axiosClient.patch(`/projects/${record.project_id}/members/${record.id}`, { role: value.toUpperCase() });
			message.success(`Successfully updated ${record.name}'s role`);
		} catch (error)
		{
			message.error(error.message);
		}
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
			dataIndex: 'role',
			render: (data, record) =>
			{
				return (
					<div>
						<Space size="middle">
							<Select
								defaultValue={data}
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
									{
										value: 'owner',
										label: 'Owner',
										disabled: true,
									}
								]}
								disabled={data === 'OWNER'}
								onChange={(value) => handleActionChange(value, record)}
							/>
						</Space>
						{
							data !== 'OWNER'
							&&
							<Popconfirm
								title="Remove user"
								description="Are you sure to remove this user?"
								onConfirm={(event) => confirm(event, record)}
								onCancel={cancel}
								okText="Yes"
								cancelText="No"
							>
								<DeleteFilled className="project-members-deletefilled-icon" />
							</Popconfirm>
						}
						{
							record.status === 'PENDING' &&
							<Tag color="orange">Pending</Tag>
						}
					</div>
				);
			},
			ellipsis: true
		},
	];

	const fetchProjectMembers = async () => 
	{
		try
		{
			const response = await axiosClient.get(`/projects/${project_id}/members`);
			const memberDetails = response.data?.result.map((member) =>
			{
				return {
					key: member.user._id,
					name: member.user.first_name + " " + member.user.last_name,
					display_name: member.user.display_name,
					id: member.user._id,
					role: member.role,
					status: member.status,
					project_id: project_id
				};
			});
			setData(memberDetails);
		} catch (error)
		{
			message.error("Something went wrong");
		}
	};

	const [isModalOpen, setIsModalOpen] = useState(false);
	const [inviteSent, setInviteSent] = useState(false);
	const [selectedPermission, setSelectedPermission] = useState("READ");
	const [userEmail, setUserEmail] = useState("");

	const showModal = () =>
	{
		setIsModalOpen(true);
	};

	const closeModal = () =>
	{
		setInviteSent(false);
		setIsModalOpen(false);
	};

	const handleSendInvite = async () =>
	{
		try
		{
			setIsLoading(true);
			await axiosClient.post(`/projects/${project_id}/members`, {
				email: userEmail,
				role: selectedPermission
			});

			message.success("Invite sent successfully");
			setIsLoading(false);
			closeModal();
		} catch (error)
		{
			message.error(error.response.data.message);
			setIsLoading(false);
			setIsModalOpen(false);
		}
	};

	useEffect(() =>
	{
		fetchProjectMembers();
	}, []);

	return (
		<div>
			<Breadcrumb
				items={[
					{
						title: activeProjectName,
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
							<h3>Invite user to {activeProjectName}</h3>
							<Space.Compact style={{ width: '100%' }} >
								<Input placeholder="Please input user email to send invite" value={userEmail} onChange={(e) => { setUserEmail(e.target.value); }} />
								<Select style={{ width: 100 }} value={selectedPermission} onChange={(value) => { setSelectedPermission(value); }}>
									<Option value="READ">Read</Option>
									<Option value="WRITE">Write</Option>
									<Option value="ADMIN">Admin</Option>
								</Select>
							</Space.Compact>
							<br />
							<br />
							<Button type="primary" onClick={handleSendInvite} className="invite-btn">Invite</Button>
						</div>
						:
						<Result
							status="success"
							title="Successfully sent invite!"
							subTitle={`User Avinash@2000 has been invited to ${activeProjectName}`}
						/>
					}
				</Spin>
			</Modal>
		</div>
	);
};
export default ProjectMembers;
