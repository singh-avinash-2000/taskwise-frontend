import { Modal } from "antd";
import React, { useState } from 'react';
import ReactAudioPlayer from "react-audio-player";
import { FaFileAudio } from "react-icons/fa";

function ImageModal({ audios })
{
	const [audioModalOpen, setAudioModalOpen] = useState(false);

	const handleCancel = () =>
	{
		setAudioModalOpen(false);
	};


	return (
		<>
			<div className="image-list" onClick={() => setAudioModalOpen(true)}>
				<FaFileAudio className="image-icon" />
				<span>{audios.length === 1 ? '1 audio attached' : `${audios.length} audios attached`}</span>
			</div>
			<Modal title="Preview Audios attached" open={audioModalOpen} onCancel={handleCancel} footer={null} destroyOnClose={true}>
				{
					audios.map((audio, index) => (
						<ReactAudioPlayer src={audio.url} controls key={index} />
					))
				}
			</Modal>
		</>
	);
}

export default ImageModal;
