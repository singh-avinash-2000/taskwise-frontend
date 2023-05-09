import React from 'react';
import { Avatar, Badge, Card } from "antd";
import Meta from "antd/es/card/Meta";
import { Draggable } from "react-beautiful-dnd";

function SingleTask({ task, index })
{
	return (
		<Draggable key={task?.key} draggableId={task?.key} index={index}>
			{(provided) => (
				<div className="all-tasks" key={task?.key} index={index} {...provided.draggableProps} {...provided.dragHandleProps} ref={provided.innerRef}>
					<Badge.Ribbon
						text={
							task?.priority
						}
						color={task?.priority === "LOW" ? "green" : task?.priority === "MEDIUM" ? "yellow" : task?.priority === "HIGH" ? "orange" : "red"}
					>
						<Card
							title={task?.summary}
							hoverable={true}
							className="single-task-card"
						>
							<Meta
								avatar={<Avatar src={task?.assignee_img} />}
								title={task?.assignee}
							/>
						</Card>
					</Badge.Ribbon>
				</div>
			)}
		</Draggable>
	);
}

export default SingleTask;
