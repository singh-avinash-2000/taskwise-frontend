// import io from 'socket.io-client';
// const accessToken = localStorage.getItem("accessToken");
// let socket;

// function getSocketInstance()
// {
// 	if (!socket)
// 	{
// 		socket = io('http://localhost:5000', {
// 			autoConnect: false,
// 			reconnectionAttempts: 5,
// 			transports: ['websocket'],
// 			auth: {
// 				token: accessToken,
// 			},
// 		});
// 	}

// 	return socket;
// }

// export { getSocketInstance };

import io from 'socket.io-client';

const socket = io(process.env.REACT_APP_SOCKET_URL, {
	autoConnect: false,
	reconnectionAttempts: 5,
	transports: ['websocket'],
	auth: {
		token: null, // set to null initially
	},
});

// // set auth token after user logs in
export const setAuthToken = (token) =>
{
	socket.auth.token = token;
	console.log("socket header set");
};

export const getSocketInstance = () =>
{
	return socket;
};

// // connect socket
// export const connectSocket = () =>
// {
// 	socket.connect();
// };

// // disconnect socket
// export const disconnectSocket = () =>
// {
// 	socket.disconnect();
// };
