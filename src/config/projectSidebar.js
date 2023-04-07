
const getSideBarData = (project_id) =>
{
	return {
		"PLANNING": [
			{
				"title": "Tasks",
				"to": `/project/tasks`
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
				"title": "Documents",
				"to": `/project/${project_id}/documents`
			}
		]
	};
};

export default getSideBarData;
