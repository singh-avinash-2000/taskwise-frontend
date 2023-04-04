import React, { useState } from 'react';
import ProjectDataForm from "../../../components/ui/ProjectDataForm/ProjectDataForm";

const NewProject = ({ setNewProjectModalOpen }) =>
{
	const [formData, setFormData] = useState({});

	return (
		<div className="main">
			<ProjectDataForm formData={formData} setNewProjectModalOpen={setNewProjectModalOpen} />
		</div>
	);
};

export default NewProject;
