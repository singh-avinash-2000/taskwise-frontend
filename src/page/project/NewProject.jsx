import React, { useState } from 'react';
import ProjectDataForm from "../../components/ui/ProjectDataForm";

const NewProject = () =>
{
	const [formData, setFormData] = useState({});

	return (
		<div className="main">
			<ProjectDataForm formData={formData} />
		</div>
	);
};

export default NewProject;
