import { Routes, Route } from 'react-router-dom';
import ProjectLayout from "../components/layout/Layout/ProjectLayout";
import OnlyIfLoggedIn from "../components/ui/Auth/OnlyIfLoggedIn";
import OnlyIfNotLoggedIn from "../components/ui/Auth/OnlyIfNotLoggedIn";
import { Login, Register, Dashboard, ProjectMembers, TaskInfo, TaskList, ChatProject, DefaultPage, EditProject, ForgotPassword, ResetPassword } from "../page";
import DashboardLayout from "../components/layout/Layout/DashboardLayout";

const RouterComponent = () =>
{
	return (
		<Routes>
			<Route element={<OnlyIfNotLoggedIn />}>
				<Route path="/login" element={<Login />} />
				<Route path="/register" element={<Register />} />
				<Route path="/forgotPassword" element={<ForgotPassword />} />
				<Route path="/resetPassword/:userId/:resetToken" element={<ResetPassword />} />
			</Route>
			<Route element={<OnlyIfLoggedIn />}>
				<Route element={<DashboardLayout />}>
					<Route path='/' element={<Dashboard />} />
				</Route>
				<Route element={<ProjectLayout />}>
					<Route path="/project/:project_id/tasks" element={<TaskList />} />
					<Route path="/project/:project_id/members" element={<ProjectMembers />} />
					<Route path="/project/:project_id/tasks/:task_key" element={<TaskInfo />} />
					<Route path="/project/:project_id/chat" element={<ChatProject />} />
					<Route path="/project/:project_id/edit" element={<EditProject />} />
				</Route>
			</Route>
			<Route path="*" element={<DefaultPage />} />
		</Routes>
	);
};

export default RouterComponent;
