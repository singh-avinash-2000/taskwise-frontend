import React, { useState } from 'react';
import { Modal } from "antd";
import ProjectDataForm from "../../../components/ui/ProjectDataForm/ProjectDataForm";
import { useNavigate, useParams } from "react-router-dom";
function EditProject()
{
	const [newProjectModalOpen, setNewProjectModalOpen] = useState(true);
	const { project_id } = useParams();
	const navigate = useNavigate();

	return (
		<Modal title="Edit Project" open={newProjectModalOpen} onCancel={() => { setNewProjectModalOpen(false); navigate(-1); }} footer={null}>
			<ProjectDataForm setNewProjectModalOpen={setNewProjectModalOpen} method="Edit" project_id={project_id} />
		</Modal>
	);
}

export default EditProject;
