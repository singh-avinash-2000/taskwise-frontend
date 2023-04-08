import { AutoComplete, Row, Col, Input, Modal } from 'antd';
import { useNavigate } from "react-router-dom";
import { PlusOutlined } from "@ant-design/icons";
import { debounce } from "lodash";
import "./Dashboard.css";
import { useEffect, useState } from "react";
import ProjectDataForm from "../../components/ui/ProjectDataForm/ProjectDataForm";
import { axiosClient } from "../../config/axios";

const Dashboard = () =>
{
	const navigate = useNavigate();
	const [newProjectModalOpen, setNewProjectModalOpen] = useState(false);
	const [projects, setProjects] = useState([]);
	const [options, setOptions] = useState([]);

	async function fetchProjects()
	{
		const response = await axiosClient.get("/projects");
		setProjects(response.data.result);
		// setOptions(response.data.result.map(d => ({ value: d.name })));
	}

	const handleSearch = debounce(async (value) =>
	{
		const response = await axiosClient.get(`/projects?searchQuery=${value}`);
		setProjects(response.data.result);
		setOptions(response.data.result.map(d => ({ value: d.name })));
	}, 500);

	useEffect(() =>
	{
		fetchProjects();
	}, []);

	const getInitals = (name) =>
	{
		const wordArr = name.split(" ");
		let str = "";
		wordArr.map(w =>
		{
			str += w[0].toUpperCase() + " ";
		});

		return str;
	};

	const colourArray = ["#abdbe3", "#eeeee4", "#ffffcc", "#eab676", "#ffccff", "#cce7e8", "#edb879", "#ccffcc"];

	return (
		<div className="project-container">
			<AutoComplete
				className="search-box"
				options={options}
				filterOption={(inputValue, option) =>
					option.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
				}
				onSearch={handleSearch}
			>
				<Input.Search size="large" placeholder="Search project name..." />
			</AutoComplete>

			<Row justify="start" className="project-div">
				<Col className="project-item" xs={12} sm={8} md={8} lg={6} xl={4}>
					<div>
						<div className="new-project-div" onClick={() => { setNewProjectModalOpen(true); }}>
							<PlusOutlined className="new-project-icon" />
						</div>
						<h3 className="project-title">New Project</h3>
					</div>
				</Col>
				{
					projects.map((d, id) =>
					{
						return (
							<Col className="project-item" xs={12} sm={8} md={8} lg={6} xl={4} key={id}>
								<div className="new-project-div" style={{ backgroundColor: colourArray[id % 8] }} onClick={() => navigate(`/project/${d._id}/tasks`)}>
									<span className="initials">{getInitals(d.name)}</span>
								</div>
								<h3 className="project-title">{d.name}</h3>
							</Col>
						);
					})
				}
			</Row>

			<Modal title="Add Project" open={newProjectModalOpen} onCancel={() => { setNewProjectModalOpen(false); }} footer={null}>
				<ProjectDataForm setNewProjectModalOpen={setNewProjectModalOpen} fetchProjects={fetchProjects} method="Add" />
			</Modal>
		</div>
	);
};
export default Dashboard;
