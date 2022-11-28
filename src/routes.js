import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import Login from "./page/Login";
import { Projects } from "./page/Projects";

import { ContextProvider } from "./context/ThemeProvider";
import Home from "./page/Home";
import Register from "./page/Register";
import UserAccount from "./page/user/Account";

const routes = createBrowserRouter([
	{
		path: "/login",
		element: <Login />
	},
	{
		path: "/register",
		element: <Register />
	},
	{
		path: "/",
		element: <ContextProvider><App /></ContextProvider>,
		children: [
			{
				path: "/",
				element: <Home />
			},
			{
				path: "projects",
				element: <Projects />
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
