
const getSideBarData = (project_id) => {
	return {
		"PLANNING": [
			{
				"title": "Tasks",
				"to": `/project/${project_id}/tasks`
			},
			{
				"title": "Kanban Board",
				"to": `/project/${project_id}/kanban`
			},
			{
				"title": "Reports",
				"to": `/project/${project_id}/reports`
			},
			{
				"title": "Roadmap",
				"to": `/project/${project_id}/roadmap`
			}
		],
		"INTERACTION": [
			{
				"title": "Members",
				"to": `/project/${project_id}/members`
			},
			{
				"title": "Chat",
				"to": `/project/${project_id}/chat`
			},
			{
				"title": "Collaborative IDE",
				"to": `/project/${project_id}/collab`
			},
			{
				"title": "Edit Project",
				"to": `/project/${project_id}/edit`
			},
			{
				"title": "Delete Project",
				"to": `/project/${project_id}/delete`
			},
		]
	};
};

export default getSideBarData;
