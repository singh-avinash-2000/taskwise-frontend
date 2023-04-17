import React, { useState } from 'react';
import { Card, Modal, Typography, Alert, Space, Input, Button, message } from "antd";
import { useNavigate, useParams } from "react-router-dom";
import { useStateContext } from "../../../context/ContextProvider";
import { axiosClient } from "../../../config/axios";
function DeleteProject()
{
	const { Text } = Typography;
	const [deleteInputValue, setDeleteInputValue] = useState('');
	const [deleteProjectModalOpen, setDeleteProjectModalOpen] = useState(true);
	const { project_id } = useParams();
	const { activeProjectName } = useStateContext();
	const navigate = useNavigate();

	const handleDelete = async (e) =>
	{
		e.preventDefault();
		if (deleteInputValue === activeProjectName)
		{
			try
			{
				await axiosClient.delete(`/projects/${project_id}`);
				message.success(`Successfully deleted project ${activeProjectName}`);
				navigate("/");
			}
			catch (error)
			{
				console.log(error);
				message.error(error.message);
			}
		}
		else
		{
			message.error("Incorrect Project Name.");
		}
	};


	return (
		<Modal title="Delete Project" open={deleteProjectModalOpen} onCancel={() => { setDeleteProjectModalOpen(false); navigate(-1); }} footer={null}>
			<Card
				style={{
					maxWidth: 800,
					margin: "auto"
				}}
			>
				<Space
					direction="vertical"
					style={{
						width: '100%',
					}}
					size="middle"
				>
					<Alert message="This action is irreversible!" type="warning" showIcon />
					<Text type="danger">Please type the name of your project to confirm deletion:</Text>
					<Input placeholder={`Enter ${activeProjectName} to delete`} value={deleteInputValue} onChange={(e) => setDeleteInputValue(e.target.value)} />
					<div style={{ textAlign: 'right' }}>
						<Button type="danger" htmlType="submit" className="submit-btn" onClick={handleDelete}>
							I understand the consequences, delete this project
						</Button>
					</div>
				</Space>
			</Card>
		</Modal>
	);
}

export default DeleteProject;
