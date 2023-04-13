import React, { useEffect } from 'react';
import "./Notification.css";
import { Avatar, Button } from "antd";
import { CheckOutlined, CloseOutlined } from "@ant-design/icons";

const Notification = () =>
{
	useEffect(() =>
	{
		console.log("Called");
	}, []);
	return (
		<div className="navbar-notification-content">
			<div className="notification-header">
				<span className="notification-typography">Notifications</span>
				<span className="mark-read">Mark all as read</span>
			</div>
			<hr />
			<div className="notification-container">
				<div className="notification-card un-read">
					<Avatar className="notification-avatar" shape="square" src="https://pbs.twimg.com/media/FjU2lkcWYAgNG6d.jpg" />
					<div className="notification-content">
						<span className="mention-title">Osborne Wisoky</span>
						<br />
						<span className="notification-body">You have a new task</span>
					</div>
				</div>
				<div className="notification-card">
					<Avatar className="notification-avatar" shape="square" src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQf5M2j5aP_QleSz2Sb2Qgf-J5UgjP3po54hg&usqp=CAU" />
					<div className="notification-content">
						<span className="mention-title">Avinash Sigh</span>
						<br />
						<span className="notification-body">You are invited to collaborate</span>
						<div className="additional-card">
							<span className="action-title">Raleigh Reichert - Admin Access</span>
							<div className="notification-action">
								<Button className="action-button"><CheckOutlined /></Button>
								<Button className="action-button"><CloseOutlined /></Button>
							</div>
						</div>
					</div>
				</div>
				<div className="notification-card">
					<Avatar className="notification-avatar" shape="square" src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSRqc81ke--NsKKc_uM0J5z1DZHLcSMXv9wrA&usqp=CAU" />
					<div className="notification-content">
						<span className="mention-title">Ritik Mishra</span>
						<br />
						<span className="notification-body">Marked OEE-23 as Completed</span>
					</div>
				</div>
				<div className="notification-card">
					<Avatar className="notification-avatar" shape="square" src="https://pbs.twimg.com/profile_images/1485050791488483328/UNJ05AV8_400x400.jpg" />
					<div className="notification-content">
						<span className="mention-title">Aman Singh</span>
						<br />
						<span className="notification-body">Changed OEE-14 to In-Progress</span>
					</div>
				</div>
				<div className="notification-card">
					<Avatar className="notification-avatar" shape="square" src="https://www.shutterstock.com/image-photo/head-shot-portrait-close-smiling-260nw-1714666150.jpg" />
					<div className="notification-content">
						<span className="mention-title">Gaurav Singh</span>
						<br />
						<span className="notification-body">Assigned you a task - OEE-52</span>
					</div>
				</div>
			</div>

		</div>
	);
};

export default Notification;
