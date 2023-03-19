import { createBrowserRouter } from "react-router-dom";
import Layout from "./components/layout/Layout";
import MainSidebar from "./components/layout/SideBar";
import Footer from "./components/layout/Footer";
import Login from "./page/Login";
import Dashboard from "./page/Dashboard";
import { ContextProvider } from "./context/ThemeProvider";
import Home from "./page/Home";
import Register from "./page/Register";
import NewProject from "./page/project/NewProject";
import ProjectMembers from "./page/project/ProjectMembers";
import UserAccount from "./page/user/Account";
import Redirect from "./components/ui/Redirect";
import { mainSideBarData, projectSideBarData } from "./config/data";
import NewTask from "./page/project/NewTask";
import TaskInfo from "./page/project/TaskInfo";

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
		path: "/projects",
		element: <ContextProvider><Layout sidebar={MainSidebar} sidebarData={projectSideBarData} footer={Footer} /></ContextProvider>,
		children: [
			{
				path: "/projects/",
				element: <Dashboard />
			},
			{
				path: "/projects/new-project",
				element: <NewProject />
			},
			{
				path: "/projects/:project_id/members",
				element: <ProjectMembers />
			},
			{
				path: "/projects/:project_id/create-task",
				element: <NewTask />
			},
			{
				path: "/projects/:project_id/tasks/:task_id",
				element: <TaskInfo />
			},
		],
	},
	{
		path: "/",
		element: <ContextProvider><Layout sidebar={MainSidebar} sidebarData={mainSideBarData} footer={Footer} /></ContextProvider>,
		children: [
			{
				path: "/",
				element: <Home />
			},
			{
				path: "/dashboard",
				element: <Dashboard />
			},
			{
				path: "user/account",
				element: <UserAccount />
			}
		],
		errorElement: <h1>This page is not created</h1>
	}
]);

export default routes;
