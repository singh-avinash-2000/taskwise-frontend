import { Routes, Route } from 'react-router-dom';
import ProjectLayout from "../components/layout/Layout/ProjectLayout";
import OnlyIfLoggedIn from "../components/ui/Auth/OnlyIfLoggedIn";
import OnlyIfNotLoggedIn from "../components/ui/Auth/OnlyIfNotLoggedIn";
import { Login, Register, Dashboard, ProjectMembers, TaskInfo, TaskList, ChatProject } from "../page";
import DashboardLayout from "../components/layout/Layout/DashboardLayout";

const RouterComponent = () =>
{
	return (
		<Routes>
			<Route element={<OnlyIfNotLoggedIn />}>
				<Route path="/login" element={<Login />} />
				<Route path="/register" element={<Register />} />
			</Route>
			<Route element={<OnlyIfLoggedIn />}>
				<Route element={<DashboardLayout />}>
					<Route path='/' element={<Dashboard />} />
				</Route>
				<Route element={<ProjectLayout />}>
					<Route path="/project/tasks" element={<TaskList />} />
					<Route path="/project/members" element={<ProjectMembers />} />
					<Route path="/project/tasks/:task_id" element={<TaskInfo />} />
					<Route path="/project/chat" element={<ChatProject />} />
				</Route>
			</Route>
		</Routes>
	);
};

export default RouterComponent;
