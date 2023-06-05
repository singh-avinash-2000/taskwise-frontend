import { Modal } from "antd";
import React from 'react';
import ReactPlayer from "react-player";

function VideoModal({ name, url, videoModalOpen, setVideoModalOpen })
{

	const handleCancel = () =>
	{
		setVideoModalOpen(false);
	};
	return (
		<Modal title={name} open={videoModalOpen} onCancel={handleCancel} footer={null} destroyOnClose={true}>
			<ReactPlayer url={url} playing={false} controls={true} width={450} height={450} />
		</Modal>
	);
}

export default VideoModal;
