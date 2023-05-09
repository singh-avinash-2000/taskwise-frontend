import React, { useEffect, useState } from 'react';
import { useStateContext } from "../../../context/ContextProvider";
import { Breadcrumb, Card, Typography, Empty, Modal, Button } from "antd";
import { Link, useParams } from "react-router-dom";
import { axiosClient } from "../../../config/axios";
import { DragDropContext, Droppable } from "react-beautiful-dnd";
import SingleTask from "./SingleTask";

import "./Kanban.css";
import ProjectNewTaskForm from "../../../components/ui/ProjectNewTaskForm/ProjectNewTaskForm";
import { HomeOutlined, PlusOutlined } from "@ant-design/icons";

function Kanban()
{
	const { Title } = Typography;
	const { activeProjectName, projectMembersMap } = useStateContext();
	const [to_do, setTo_do] = useState([]);
	const [in_progress, setIn_progress] = useState([]);
	const [completed, setCompleted] = useState([]);
	const [closed, setClosed] = useState([]);
	const [isModalOpen, setIsModalOpen] = useState(false);
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
			// eslint-disable-next-line array-callback-return
			tasks.map((t) =>
			{
				const assigneeDetails = projectMembersMap[t.assignee];
				const element = {
					key: t.key,
					id: t.key,
					summary: t.summary,
					priority: t.priority,
					task_key: t.task_key,
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
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [isModalOpen]);

	const onDragEnd = async (result) =>
	{
		const { destination, source } = result;
		if (!destination)
		{
			return;
		}

		if (destination.droppableId === source.droppableId)
		{
			return;
		}

		let task, ToDo = to_do, InProgress = in_progress, Completed = completed, Closed = closed;

		//remove from source array
		if (source.droppableId === "TO_DO")
		{
			task = ToDo[source.index];
			ToDo.splice(source.index, 1);
		}
		else if (source.droppableId === "IN_PROGRESS")
		{
			task = InProgress[source.index];
			InProgress.splice(source.index, 1);
		}
		else if (source.droppableId === "COMPLETED")
		{
			task = Completed[source.index];
			Completed.splice(source.index, 1);
		}
		else if (source.droppableId === "CLOSED")
		{
			task = Closed[source.index];
			Closed.splice(source.index, 1);
		}



		//add to destination array
		if (destination.droppableId === "TO_DO")
		{
			ToDo.splice(destination.index, 0, task);
		}
		else if (destination.droppableId === "IN_PROGRESS")
		{
			InProgress.splice(destination.index, 0, task);
		}
		else if (destination.droppableId === "COMPLETED")
		{
			Completed.splice(destination.index, 0, task);
		}
		else if (destination.droppableId === "CLOSED")
		{
			Closed.splice(destination.index, 0, task);
		}

		try
		{
			const task_key = task.task_key;
			const value = destination.droppableId;
			await axiosClient.patch(`/projects/${project_id}/tasks/${task_key}`, { status: value.toUpperCase() });
		} catch (error)
		{
			console.log(error);
		}


		setTo_do(ToDo);
		setIn_progress(InProgress);
		setCompleted(Completed);
		setClosed(Closed);
	};

	const handleModalOpen = () =>
	{
		setIsModalOpen(true);
	};


	return (
		<>
			<DragDropContext onDragEnd={onDragEnd}>
				<div>
					<Breadcrumb
						items={[
							{
								title: <Link to="/"><HomeOutlined /></Link>,
							},
							{
								title: activeProjectName,
							},
							{
								title: "Kanban Board"
							}
						]}
					/>
					<Button type="primary" onClick={handleModalOpen} className="kanban-add-task">
						<PlusOutlined /> Add Task
					</Button>
					<div className="kanban-wrapper">
						<Droppable droppableId="TO_DO">
							{(provided, snapshot) => (
								<div className={`task-column ${snapshot.isDraggingOver && "dragactive"}`}
									ref={provided.innerRef}
									{...provided.droppableProps}
								>
									<Card className="task-card">
										<div className="heading">
											<Title level={4} type='warning' className="tittle to_do" >TO DO</Title>
										</div>
										{to_do.length === 0 ? <Empty
											image={Empty.PRESENTED_IMAGE_SIMPLE}
											description={
												<span>
													No Data
												</span>
											}
										/> :
											to_do.map((t, index) =>
											{
												return <SingleTask task={t} index={index} key={t.key} />;
											})}
									</Card>
									{provided.placeholder}
								</div>
							)}
						</Droppable>
						<Droppable droppableId="IN_PROGRESS">
							{(provided, snapshot) => (
								<div className={`task-column ${snapshot.isDraggingOver && "dragactive"}`}
									ref={provided.innerRef}
									{...provided.droppableProps}
								>
									<Card className="task-card">
										<div className="heading">
											<Title level={4} type='secondary' className="tittle in_progess">IN PROGRESS</Title>
										</div>
										{in_progress.length === 0 ? <Empty
											image={Empty.PRESENTED_IMAGE_SIMPLE}
											description={
												<span>
													No Data
												</span>
											}
										/> :
											in_progress.map((t, index) =>
											{
												return <SingleTask task={t} index={index} key={t.key} />;
											})}
									</Card>
									{provided.placeholder}
								</div>
							)}
						</Droppable>
						<Droppable droppableId="COMPLETED">
							{(provided, snapshot) => (
								<div className={`task-column ${snapshot.isDraggingOver && "dragactive"}`}
									ref={provided.innerRef}
									{...provided.droppableProps}
								>
									<Card className="task-card">
										<div className="heading">
											<Title level={4} type='success' className="tittle completed">COMPLETED</Title>
										</div>
										{completed.length === 0 ? <Empty
											image={Empty.PRESENTED_IMAGE_SIMPLE}
											description={
												<span>
													No Data
												</span>
											}
										/> :
											completed.map((t, index) =>
											{
												return <SingleTask task={t} index={index} key={t.key} />;
											})}
									</Card>
									{provided.placeholder}
								</div>
							)}
						</Droppable>
						<Droppable droppableId="CLOSED">
							{(provided, snapshot) => (
								<div className={`task-column ${snapshot.isDraggingOver && "dragactive"}`}
									ref={provided.innerRef}
									{...provided.droppableProps}
								>
									<Card className="task-card">
										<div className="heading">
											<Title level={4} type='danger' className="tittle closed">CLOSED</Title>
										</div>
										{closed.length === 0 ? <Empty
											image={Empty.PRESENTED_IMAGE_SIMPLE}
											description={
												<span>
													No Data
												</span>
											}
										/> :
											closed.map((t, index) =>
											{
												return <SingleTask task={t} index={index} key={t.key} />;
											})}
									</Card>
									{provided.placeholder}
								</div>
							)}
						</Droppable>
					</div>
				</div>
			</DragDropContext>
			<Modal title="Add Task" open={isModalOpen} onCancel={() => { setIsModalOpen(false); }} footer={null} className="create-task-modal" destroyOnClose={true}>
				<ProjectNewTaskForm method="add" taskDetails={{}} closeModal={() => { setIsModalOpen(); }} task_type="MAIN_TASK" />
			</Modal>
		</>
	);
}

export default Kanban;
