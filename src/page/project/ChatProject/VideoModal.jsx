import { Modal } from "antd";
import React, { useState } from 'react';
import { BsCameraVideoFill } from "react-icons/bs";
import ReactPlayer from "react-player";

function VideoModal({ videos })
{
	const [videoModalOpen, setVideoModalOpen] = useState(false);
	const handleCancel = () =>
	{
		setVideoModalOpen(false);
	};
	return (
		<>
			<div className="image-list" onClick={() => setVideoModalOpen(true)}>
				<BsCameraVideoFill className="image-icon" />
				<span>{videos.length === 1 ? '1 video attached' : `${videos.length} videos attached`}</span>
			</div>
			<Modal
				open={videoModalOpen}
				onCancel={handleCancel}
				footer={null}
				width={450}
				title="Preview Videos Attached"
			>
				{
					videos.map((video, index) => (
						<ReactPlayer key={index} url={video.url} controls={true} width={400} />
					))
				}
			</Modal>
		</>
	);
}

export default VideoModal;
