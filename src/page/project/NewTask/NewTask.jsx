import React, { useState } from 'react';
import { useLocation } from "react-router-dom";
import ProjectNewTaskForm from "../../../components/ui/ProjectNewTaskForm/ProjectNewTaskForm";


const NewTask = () =>
{
	const location = useLocation();
	const [formData, setFormData] = useState({});

	return (
		<ProjectNewTaskForm formData={formData} projectId={location.state?.project_id} />
	);
};

export default NewTask;
