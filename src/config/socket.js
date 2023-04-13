import io from 'socket.io-client';

const accessToken = localStorage.getItem("accessToken");

const socket = io("http://localhost:5000", {
	autoConnect: false,
	reconnectionAttempts: 5,
	transports: ['websocket'],
	auth: {
		token: accessToken,
	},
});

export default socket;
