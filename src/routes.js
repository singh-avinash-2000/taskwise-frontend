import { createBrowserRouter } from "react-router-dom";
import Layout from "./components/layout/Layout/Layout";
import MainSidebar from "./components/layout/Sidebar/SideBar";
import Footer from "./components/layout/Footer/Footer";
import Login from "./page/Login";
import Dashboard from "./page/Dashboard";
import { ContextProvider } from "./context/ThemeProvider";
import Register from "./page/Register";
// import NewProject from "./page/project/NewProject";
import ProjectMembers from "./page/project/ProjectMembers";
import UserAccount from "./page/user/Account";
import Redirect from "./components/ui/Redirect/Redirect";
import { mainSideBarData, projectSideBarData } from "./config/data";
import NewTask from "./page/project/NewTask";
import TaskInfo from "./page/project/TaskInfo";
import TaskList from "./page/project/TaskList";
import ChatProject from "./page/project/ChatProject";

const routes = createBrowserRouter([
	{
		path: "/login",
		element: <Redirect component={Login} />
	},
	{
		path: "/register",
		element: <Redirect component={Register} />
	},
	{
		path: "/project",
		element: <ContextProvider><Layout sidebar={MainSidebar} sidebarData={projectSideBarData} footer={Footer} /></ContextProvider>,
		children: [
			{
				path: "/project/tasks",
				element: <TaskList />
			},
			{
				path: "/project/members",
				element: <ProjectMembers />
			},
			{
				path: "/project/tasks/create-task",
				element: <NewTask />
			},
			{
				path: "/project/tasks/:task_id",
				element: <TaskInfo />
			},
			{
				path: "/project/chat",
				element: <ChatProject />
			}
		],
	},
	{
		path: "/",
		element: <ContextProvider><Layout sidebar={MainSidebar} sidebarData={mainSideBarData} footer={Footer} /></ContextProvider>,
		children: [
			{
				path: "/insights",
				element: <h1>Feeds</h1>
			},
			{
				path: "user/account",
				element: <UserAccount />
			},
			{
				path: "/",
				element: <Dashboard />
			},
		]
	},

]);

export default routes;
