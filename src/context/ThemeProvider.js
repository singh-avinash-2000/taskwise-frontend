import React, { createContext, useContext, useState } from "react";

const ThemeContext = createContext();

export const ContextProvider = ({ children }) =>
{
	const [collapsed, setCollapsed] = useState(false);
	const [screenHeight, setScreenHeight] = useState(true);
	const [screenWidth, setScreenWidth] = useState(true);

	return (
		<ThemeContext.Provider
			value={
				{
					collapsed,
					setCollapsed,
					screenHeight,
					setScreenHeight,
					screenWidth,
					setScreenWidth

				}}
		>
			{children}
		</ThemeContext.Provider>
	);
};

export const useThemeContext = () => useContext(ThemeContext);
