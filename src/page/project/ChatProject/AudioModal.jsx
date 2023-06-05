import { Modal } from "antd";
import React from 'react';
import ReactAudioPlayer from "react-audio-player";

function ImageModal({ name, url, audioModalOpen, setAudioModalOpen })
{

	const handleCancel = () =>
	{
		setAudioModalOpen(false);
	};
	return (
		<Modal title={name} open={audioModalOpen} onCancel={handleCancel} footer={null} destroyOnClose={true}>
			<ReactAudioPlayer src={url} controls />
		</Modal>
	);
}

export default ImageModal;
