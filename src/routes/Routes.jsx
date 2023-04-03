import { Routes, Route } from 'react-router-dom';
import Layout from "../components/layout/Layout/Layout";
import MainSidebar from "../components/layout/Sidebar/SideBar";
import { ContextProvider } from "../context/ThemeProvider";
import { mainSideBarData, projectSideBarData } from "../config/data";
import Redirect from "../components/ui/Redirect/Redirect";
import { Login, Register, Dashboard, ProjectMembers, UserAccount, NewTask, TaskInfo, TaskList, ChatProject } from "../page/index";

// const routes = createBrowserRouter([
// 	{
// 		path: "/login",
// 		element: <Redirect component={Login} />
// 	},
// 	{
// 		path: "/register",
// 		element: <Redirect component={Register} />
// 	},
// 	{
// 		path: "/project",
// 		element: <ContextProvider><Layout sidebar={MainSidebar} sidebarData={projectSideBarData} /></ContextProvider>,
// 		children: [
// 			{
// 				path: "/project/tasks",
// 				element: <TaskList />
// 			},
// 			{
// 				path: "/project/members",
// 				element: <ProjectMembers />
// 			},
// 			{
// 				path: "/project/tasks/create-task",
// 				element: <NewTask />
// 			},
// 			{
// 				path: "/project/tasks/:task_id",
// 				element: <TaskInfo />
// 			},
// 			{
// 				path: "/project/chat",
// 				element: <ChatProject />
// 			}
// 		],
// 	},
// 	{
// 		path: "/",
// 		element: <ContextProvider><Layout sidebarDisabled={true} /></ContextProvider>,
// 		children: [
// 			{
// 				path: "/insights",
// 				element: <h1>Feeds</h1>
// 			},
// 			{
// 				path: "user/account",
// 				element: <UserAccount />
// 			},
// 			{
// 				path: "/",
// 				element: <Dashboard />
// 			},
// 		]
// 	},
// ]);

const RouterComponent = () =>
{
	return (
		<Routes>
			<Route element={<ContextProvider><Layout sidebarDisabled={true} navIconDisabled={true} /></ContextProvider>}>
				<Route path='/' element={<Dashboard />} />
			</Route>
			<Route>
				<Route path="/login" element={<Login />} />
				<Route path="/register" element={<Register />} />
			</Route>
			<Route element={<ContextProvider><Layout sidebar={MainSidebar} sidebarData={projectSideBarData} /></ContextProvider>}>
				<Route path="/project/tasks" element={<TaskList />} />
				<Route path="/project/members" element={<ProjectMembers />} />
				<Route path="/project/tasks/:task_id" element={<TaskInfo />} />
				<Route path="/project/chat" element={<ChatProject />} />
			</Route>
		</Routes>
	);
};

export default RouterComponent;
