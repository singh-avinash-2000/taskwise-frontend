import React, { useState } from 'react';
import ProjectNewTaskForm from "../../components/ui/ProjectNewTaskForm";

const NewTask = () =>
{
	const [formData, setFormData] = useState({});

	return (
		<div className="main">
			<ProjectNewTaskForm formData={formData} />
		</div>
	);
};

export default NewTask;
