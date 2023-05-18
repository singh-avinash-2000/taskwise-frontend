import { Divider, Table, Space, Select, Popconfirm, message, Button, Modal, Input, Result, Spin, Tag, Breadcrumb, Avatar } from 'antd';
import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from "react-router-dom";
import { DeleteFilled, HomeOutlined, MailOutlined } from "@ant-design/icons";
import { axiosClient } from "../../../config/axios";

import './ProjectMembers.css';
import { useStateContext } from "../../../context/ContextProvider";

const { Option } = Select;

const ProjectMembers = () =>
{
	const [isLoading, setIsLoading] = useState(false);
	const { project_id } = useParams();
	const [data, setData] = useState([]);
	const { activeProjectName, userDetails, activeProjectDetails } = useStateContext();
	const navigate = useNavigate();

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

	const disabledStatus = (data, record) =>
	{
		const accountUserRole = activeProjectDetails.members?.find((member) => member.user._id === userDetails._id)?.role;
		if (accountUserRole === 'OWNER' || accountUserRole === 'ADMIN')
		{
			if (data === 'OWNER' || record.id === userDetails._id)
			{
				return true;
			}
			return false;
		}

		return true;
	};

	const columns = [
		{
			title: 'Display Name',
			dataIndex: 'display_name',
			render: (text, record) =>
			{
				return (
					<div className="member-avatar-name">
						<Avatar size={32} src={record.profile_picture || 'https://www.nicepng.com/png/detail/933-9332131_profile-picture-default-png.png'} />
						<span>{text}</span>
					</div>
				);
			},
			ellipsis: true
		},
		{
			title: 'Permission',
			dataIndex: 'role',
			render: (data, record) =>
			{
				return (
					<div>
						<Space size="middle">
							<Select
								defaultValue={data}
								disabled={disabledStatus(data, record)}
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
								onChange={(value) => handleActionChange(value, record)}
							/>
						</Space>
						{
							!disabledStatus(data, record)
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
					profile_picture: member.user.profile_picture,
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
			navigate('/');
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

			setIsLoading(false);
			message.success("Invite sent successfully");
			closeModal();
			fetchProjectMembers();

		} catch (error)
		{
			setIsLoading(false);
			message.error(error.response.data.message);
		}
	};

	useEffect(() =>
	{
		fetchProjectMembers();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<div>
			<Breadcrumb
				items={[
					{
						title: <Link to="/"><HomeOutlined /></Link>,
					},
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
							subTitle={`User has been invited to ${activeProjectName}`}
						/>
					}
				</Spin>
			</Modal>
		</div>
	);
};
export default ProjectMembers;
