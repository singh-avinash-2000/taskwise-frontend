import React, { useEffect, useState } from 'react';
import { useStateContext } from "../../../context/ContextProvider";
import { Avatar, Breadcrumb, Card, Divider, Tag, Typography, Badge, Empty } from "antd";
import "./Kanban.css";
import Meta from "antd/es/card/Meta";
import { useParams } from "react-router-dom";
import { axiosClient } from "../../../config/axios";
import { Draggable, Droppable, DragDropContext } from "react-beautiful-dnd";


function Kanban()
{
	const { Title } = Typography;
	const { activeProjectName, projectMembersMap } = useStateContext();
	const [to_do, setTo_do] = useState([]);
	const [in_progress, setIn_progress] = useState([]);
	const [completed, setCompleted] = useState([]);
	const [closed, setClosed] = useState([]);
	const { project_id } = useParams();

	const fetchProjectTasks = async () =>
	{
		try
		{
			const tasksResponse = await axiosClient.get(`/projects/${project_id}/tasks`);
			let tasks = tasksResponse.data?.result;
			tasks = tasks.map((t) =>
			{
				return {
					...t,
					key: t._id,
				};
			});
			let toDO = [];
			let inProgress = [];
			let completed = [];
			let closed = [];
			tasks.map((t) =>
			{
				const assigneeDetails = projectMembersMap[t.assignee];
				const element = {
					key: t.key,
					id: t.key,
					summary: t.summary,
					priority: t.priority,
					assignee: assigneeDetails?.first_name + " " + assigneeDetails?.last_name || "Unassigned",
					assignee_id: t.assignee,
					assignee_img: assigneeDetails?.profile_picture || "https://www.nicepng.com/png/detail/933-9332131_profile-picture-default-png.png",
				};

				if (t.status === "TO_DO")
				{
					toDO.push(element);
				}
				else if (t.status === "IN_PROGRESS")
				{
					inProgress.push(element);
				}
				else if (t.status === "COMPLETED")
				{
					completed.push(element);
				}
				else if (t.status === "CLOSED")
				{
					closed.push(element);
				}
			});
			setTo_do(toDO);
			setIn_progress(inProgress);
			setCompleted(completed);
			setClosed(closed);

		} catch (error)
		{
			console.log(error);
		}
	};

	useEffect(() =>
	{
		fetchProjectTasks();
	}, []);

	const handleDragEnd = (result) =>
	{
		console.log(result);
		const { destination, source, draggableId } = result;
		if (!destination)
		{
			return;
		}

		if (destination.droppableId === source.droppableId)
		{
			return;
		}

		const task = to_do.find((t) => t.key === draggableId);
		const taskInProgress = in_progress.find((t) => t.key === draggableId);
		const taskCompleted = completed.find((t) => t.key === draggableId);
		const taskClosed = closed.find((t) => t.key === draggableId);

		if (source.droppableId === "to_do_card")
		{
			const newToDo = Array.from(to_do);
			newToDo.splice(source.index, 1);
			setTo_do(newToDo);
		}
		else if (source.droppableId === "in_progress_card")
		{
			const newInProgress = Array.from(in_progress);
			newInProgress.splice(source.index, 1);
			setIn_progress(newInProgress);
		}
		else if (source.droppableId === "completed_card")
		{
			const newCompleted = Array.from(completed);
			newCompleted.splice(source.index, 1);
			setCompleted(newCompleted);
		}
		else if (source.droppableId === "closed_card")
		{
			const newClosed = Array.from(closed);
			newClosed.splice(source.index, 1);
			setClosed(newClosed);
		}

		if (destination.droppableId === "to_do_card")
		{
			const newToDo = Array.from(to_do);
			newToDo.splice(destination.index, 0, task);
			setTo_do(newToDo);
		}
		else if (destination.droppableId === "in_progress_card")
		{
			const newInProgress = Array.from(in_progress);
			newInProgress.splice(destination.index, 0, taskInProgress);
			setIn_progress(newInProgress);
		}
		else if (destination.droppableId === "completed_card")
		{
			const newCompleted = Array.from(completed);
			newCompleted.splice(destination.index, 0, taskCompleted);
			setCompleted(newCompleted);
		}
		else if (destination.droppableId === "closed_card")
		{
			const newClosed = Array.from(closed);
			newClosed.splice(destination.index, 0, taskClosed);
			setClosed(newClosed);
		}
	};



	return (
		<DragDropContext onDragEnd={handleDragEnd}>
			<div>
				<Breadcrumb
					items={[
						{
							title: activeProjectName,
						},
						{
							title: "Kanban Board"
						}
					]}
				/>
				<div className="kanban-wrapper">
					<Droppable droppableId="to_do_card">
						{
							(provided) => (
								<Card className="task-card" ref={provided.innerRef} {...provided.droppableProps}>
									<div className="heading">
										<Title level={4} type='warning' className="tittle to_do" >TO DO</Title>
									</div>

									{to_do.length > 0 ? to_do.map((task, index) =>
									(
										<Draggable draggableId={task.id} index={index} key={task.id}>
											{
												(provided) => (
													<div className="all-tasks" key={to_do.id} index={index} {...provided.draggableProps} {...provided.dragHandleProps} ref={provided.innerRef}>
														<Badge.Ribbon
															text={
																task.priority
															}
															color={task.priority === "LOW" ? "green" : task.priority === "MEDIUM" ? "yellow" : task.priority === "HIGH" ? "orange" : "red"}
														>
															<Card
																title={task.summary}
																hoverable={true}
																className="single-task-card"
															>
																<Meta
																	avatar={<Avatar src={task.assignee_img} />}
																	title={task.assignee}
																/>
															</Card>
														</Badge.Ribbon>
													</div>
												)
											}
										</Draggable>
									)) : <Empty
										image={Empty.PRESENTED_IMAGE_SIMPLE}
										description={
											<span>
												No Tasks To Do
											</span>
										}
									/>}
									{provided.placeholder}
								</Card>
							)
						}
					</Droppable>
					<Droppable droppableId="in_progress_card">
						{
							(provided) => (
								<Card className="task-card" ref={provided.innerRef} {...provided.droppableProps} >
									<div className="heading">
										<Title level={4} type='secondary' className="tittle in_progess">IN PROGRESS</Title>
									</div>
									{in_progress.length > 0 ? in_progress.map((task, index) => (
										<Draggable draggableId={task.id} index={index} key={task.id}>
											{
												(provided) => (
													<div className="all-tasks" key={in_progress.id} index={index} {...provided.draggableProps} {...provided.dragHandleProps} ref={provided.innerRef}>
														<Badge.Ribbon
															text={
																task.priority
															}
															color={task.priority === "LOW" ? "green" : task.priority === "MEDIUM" ? "yellow" : task.priority === "HIGH" ? "orange" : "red"}
														>
															<Card
																title={task.summary}
																hoverable={true}
																className="single-task-card"
															>
																<Meta
																	avatar={<Avatar src={task.assignee_img} />}
																	title={task.assignee}
																/>
															</Card>
														</Badge.Ribbon>
													</div>
												)
											}
										</Draggable>
									)) : <Empty
										image={Empty.PRESENTED_IMAGE_SIMPLE}
										description={
											<span>
												No Tasks in Progress
											</span>
										}
									/>}
									{provided.placeholder}
								</Card>
							)
						}
					</Droppable>
					<Droppable droppableId="completed_card">
						{
							(provided) => (
								<Card className="task-card" ref={provided.innerRef} {...provided.droppableProps} >
									<div className="heading">
										<Title level={4} type='success' className="tittle completed">COMPLETED</Title>
									</div>
									{completed.length > 0 ? completed.map((task, index) => (
										<Draggable draggableId={task.id} index={index} key={task.id}>
											{
												(provided) => (
													<div className="all-tasks" key={completed.id} index={index} {...provided.draggableProps} {...provided.dragHandleProps} ref={provided.innerRef}>
														<Badge.Ribbon
															text={
																task.priority
															}
															color={task.priority === "LOW" ? "green" : task.priority === "MEDIUM" ? "yellow" : task.priority === "HIGH" ? "orange" : "red"}
														>
															<Card
																title={task.summary}
																hoverable={true}
																className="single-task-card"
															>
																<Meta
																	avatar={<Avatar src={task.assignee_img} />}
																	title={task.assignee}
																/>
															</Card>
														</Badge.Ribbon>
													</div>
												)
											}
										</Draggable>
									)) : <Empty
										image={Empty.PRESENTED_IMAGE_SIMPLE}
										description={
											<span>
												No Tasks Completed
											</span>
										}
									/>}
									{provided.placeholder}
								</Card>
							)
						}
					</Droppable>
					<Droppable droppableId="closed_card">
						{
							(provided) => (
								<Card className="task-card" ref={provided.innerRef} {...provided.droppableProps} >
									<div className="heading">
										<Title level={4} type='danger' className="tittle closed">CLOSED</Title>
									</div>
									{closed.length > 0 ? closed.map((task, index) => (
										<Draggable draggableId={task.id} index={index} key={task.id} >
											{
												(provided) => (
													<div className="all-tasks" key={closed.id} index={index} {...provided.draggableProps} {...provided.dragHandleProps} ref={provided.innerRef}>
														<Badge.Ribbon
															text={
																task.priority
															}
															color={task.priority === "LOW" ? "green" : task.priority === "MEDIUM" ? "yellow" : task.priority === "HIGH" ? "orange" : "red"}
														>
															<Card
																title={task.summary}
																hoverable={true}
																className="single-task-card"
															>
																<Meta
																	avatar={<Avatar src={task.assignee_img} />}
																	title={task.assignee}
																/>
															</Card>
														</Badge.Ribbon>
													</div>
												)
											}
										</Draggable>
									)) : <Empty
										image={Empty.PRESENTED_IMAGE_SIMPLE}
										description={
											<span>
												No Tasks Closed
											</span>
										}
									/>}
									{provided.placeholder}
								</Card>
							)
						}
					</Droppable>
				</div>
			</div>
		</DragDropContext>
	);
}

export default Kanban;
