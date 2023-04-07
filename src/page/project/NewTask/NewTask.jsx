import React, { useState } from 'react';
import { useLocation } from "react-router-dom";
import ProjectNewTaskForm from "../../../components/ui/ProjectNewTaskForm/ProjectNewTaskForm";


const NewTask = () =>
{
	const location = useLocation();
	const [formData, setFormData] = useState({});

	return (
		<></>
	);
};

export default NewTask;
