import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import Login from "./page/Login";
import { Projects } from "./page/Projects";

import { ContextProvider } from "./context/ThemeProvider";
import Home from "./page/Home";

const routes = createBrowserRouter([
	{
		path: "/login",
		element: <Login />
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
			}
		],
		errorElement: <h1>Error Occurred</h1>
	}
]);

export default routes;
