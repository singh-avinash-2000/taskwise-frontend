import React, { useState } from 'react';
import { useLocation } from "react-router-dom";
import ProjectNewTaskForm from "../../components/ui/ProjectNewTaskForm/ProjectNewTaskForm";


const NewTask = () => {
	const location = useLocation();
	console.log(location.state);
	const [formData, setFormData] = useState({});

	return (
		<div className="main">
			<ProjectNewTaskForm formData={formData} />
		</div>
	);
};

export default NewTask;
