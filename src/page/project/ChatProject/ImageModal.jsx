import { Modal, Image } from "antd";
import React from 'react';

function ImageModal({ name, url, imageModalOpen, setImageModalOpen })
{

	const handleCancel = () =>
	{
		setImageModalOpen(false);
	};
	return (
		<Modal title={name} open={imageModalOpen} onCancel={handleCancel} footer={null} destroyOnClose={true}>
			<Image src={url} alt={name} />
		</Modal>
	);
}

export default ImageModal;
