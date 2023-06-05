import { Modal, Image } from "antd";
import React, { useState } from 'react';
import { BsImageFill } from "react-icons/bs";

function ImageModal({ images })
{
	const [imageModalOpen, setImageModalOpen] = useState(false);
	const handleCancel = () =>
	{
		setImageModalOpen(false);
	};
	return (
		<>
			<div className="image-list" onClick={() => setImageModalOpen(true)}>
				<BsImageFill className="image-icon" />
				<span>{images.length === 1 ? '1 image attached' : `${images.length} images attached`}</span>
			</div>
			<Modal
				open={imageModalOpen}
				onCancel={handleCancel}
				footer={null}
				title="Preview Images Attached"
			>
				<Image.PreviewGroup>
					{
						images.map((image, index) => (
							<Image
								key={index}
								src={image.url}
								style={{ objectFit: "contain" }}
							/>
						))
					}
				</Image.PreviewGroup>
			</Modal>
		</>
	);
}

export default ImageModal;
