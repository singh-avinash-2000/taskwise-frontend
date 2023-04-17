import React, { useEffect, useState } from 'react';
import { Card, Row, Col, Button, List, Tag, Avatar, message } from 'antd';
import { UsergroupAddOutlined } from '@ant-design/icons';
import { useStateContext } from "../../../context/ContextProvider";
import { useNavigate, useParams } from "react-router-dom";
import { axiosClient } from "../../../config/axios";

function InviteAccept()
{
	const { project_id } = useParams();
	const { userDetails } = useStateContext();
	const navigate = useNavigate();
	const [invitedProjectDetails, setInvitedProjectDetails] = useState({});
	const [userPermission, setUserPermission] = useState("");
	const [permissionColor, setPermissionColor] = useState("");
	const [projectMembers, setProjectMembers] = useState([]);

	const fetchPermissionColor = (role) =>
	{
		if (role === "OWNER")
		{
			return "green";
		}
		else if (role === "ADMIN")
		{
			return "blue";
		}
		else if (role === "READ")
		{
			return "purple";
		}
		else if (role === "WRITE")
		{
			return "orange";
		}
	};


	const fetchProjectDetails = async () =>
	{
		try
		{
			const response = await axiosClient.get(`/projects/${project_id}`);
			setInvitedProjectDetails(response.data?.result);
			const user = response.data?.result?.members?.find((member) => member.user._id === userDetails._id);
			setUserPermission(user?.role);
			setPermissionColor(fetchPermissionColor(user?.role));

			let members = response.data?.result?.members?.filter((member) => member.user._id !== userDetails._id);

			members = members?.map((member) =>
			{
				const name = `${member.user.first_name} ${member.user.last_name}`;
				const color = fetchPermissionColor(member.role);
				const permission = member.role;
				const avatar = member?.user?.profile_picture || "https://www.nicepng.com/png/detail/933-9332131_profile-picture-default-png.png";
				return { name, color, permission, avatar };
			});
			setProjectMembers(members);
		}
		catch (error)
		{
			console.log(error);
		}
	};

	const handleInvitation = async (e, action) =>
	{
		e.preventDefault();
		try
		{
			await axiosClient.post(`/projects/${project_id}/invite-action`, { action });
			message.success("Invitation accepted");
			navigate(`/project/${project_id}/tasks`);
		} catch (error)
		{
			console.log(error);
			message.error("Something went wrong");
		}
	};

	useEffect(() =>
	{
		fetchProjectDetails();
	}, []);
	return (
		<div>
			<Card
				title={<h2 style={{ marginBottom: 0 }}><UsergroupAddOutlined style={{ marginRight: 8 }} /> You are invited to collaborate</h2>}
				bordered={false}
				style={{ borderRadius: '12px', boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.05)', width: '90%', marginInline: 'auto', }}
				headStyle={{ backgroundColor: '#f5f5f5' }}

			>
				<Row gutter={[16, 4]}>
					<Col span={24}>
						<h3 style={{ marginBottom: 8 }}>Project Name</h3>
						<p style={{ fontSize: '18px', marginBottom: 24 }}>{invitedProjectDetails?.name}</p>
					</Col>
					<Col span={24}>
						<h3 style={{ marginBottom: 8 }}>Project Description</h3>
						<p style={{ fontSize: '16px', lineHeight: 1.6, marginBottom: 24 }}>{invitedProjectDetails?.description}</p>
					</Col>
					<Col span={12}>
						<h3 style={{ marginBottom: 8 }}>Permission</h3>
						<p style={{ fontSize: '16px', marginBottom: 24 }}>{<Tag color={permissionColor}>{userPermission}</Tag>}</p>
					</Col>
					<Col span={24}>
						<h3 style={{ marginBottom: 8 }}>Members</h3>
						<List
							itemLayout="horizontal"
							dataSource={projectMembers}
							renderItem={(item) => (
								<List.Item style={{ padding: 0, marginBottom: 16 }}>
									<List.Item.Meta
										avatar={<Avatar src={item.avatar} />}
										title={<span style={{ fontSize: '14px', fontWeight: 500, marginBottom: 0 }}>{item.name} <Tag color={item.color}>{item.permission}</Tag></span>}
									/>
								</List.Item>
							)}
							style={{ maxHeight: '160px', overflowY: 'auto', marginBottom: 24 }}
						/>
					</Col>
					<Col span={24}>
						<div style={{ textAlign: 'right' }}>
							<Button style={{ marginRight: 16 }} onClick={(e) => handleInvitation(e, "JOINED")}>Accept</Button>
							<Button type="danger" style={{ backgroundColor: '#FF0000 !important' }} onClick={(e) => handleInvitation(e, "REJECTED")}>Reject</Button>
						</div>
					</Col>
				</Row>
			</Card>
		</div >
	);
}

export default InviteAccept;;
