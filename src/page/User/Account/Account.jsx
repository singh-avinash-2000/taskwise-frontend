import { Col, Row, Image, Divider, Tabs, Descriptions, Button, Form, Input, Modal, message, Upload } from "antd";
// import { EllipsisOutlined, SettingOutlined, EditOutlined } from "@ant-design/icons";
import "./Account.css";
import { useEffect, useState } from "react";
import { axiosClient } from "../../../config/axios";
import { useStateContext } from "../../../context/ContextProvider";

const UserAccount = () =>
{
	const [profilePicture, setProfilePicture] = useState("");
	const { userDetails, setUserDetails } = useStateContext();

	const changeISODatesToReadable = (ISOdate) =>
	{
		const date = new Date(ISOdate);
		const options = { year: 'numeric', month: 'long', day: 'numeric' };
		return date.toLocaleDateString('en-US', options);
	};

	// const { Meta } = Card;
	const [form] = Form.useForm();

	const Details = () =>
	{
		const [open, setOpen] = useState(false);
		const [confirmLoading, setConfirmLoading] = useState(false);

		const showModal = () =>
		{
			setOpen(true);
		};

		const handleOk = async () =>
		{
			setConfirmLoading(true);
			try
			{
				const data = form.getFieldsValue();
				const response = await axiosClient.put('/user', data);

				response.data.result.created_at = changeISODatesToReadable(response?.data?.result?.created_at);
				setUserDetails(response.data.result);
				message.success("User details updated successfully");
			} catch (error)
			{
				console.log(error);
				message.error(error.response.data.message);
			}
			setOpen(false);
			setConfirmLoading(false);
		};

		const handleCancel = () =>
		{
			setOpen(false);
		};
		return (
			<div>
				<Descriptions
					bordered
					column={{
						xxl: 4,
						xl: 3,
						lg: 3,
						md: 3,
						sm: 2,
						xs: 1,
					}}
					extra={<Button type="primary" onClick={showModal}>Edit</Button>}
				>
					<Descriptions.Item label="First Name">
						{userDetails?.first_name}
					</Descriptions.Item>
					<Descriptions.Item label="Last Name">
						{userDetails?.last_name}
					</Descriptions.Item>
					<Descriptions.Item label="Display Name">
						{userDetails?.display_name}
					</Descriptions.Item>
					<Descriptions.Item label="Email">
						{userDetails?.email}
					</Descriptions.Item>
				</Descriptions>
				<Modal
					title="Edit User Details"
					open={open}
					onOk={handleOk}
					confirmLoading={confirmLoading}
					onCancel={handleCancel}
					okText="Save Changes"
				>
					<Form
						name="edit user details"
						labelCol={{ span: 8 }}
						wrapperCol={{ span: 16 }}
						style={{ maxWidth: 600 }}
						initialValues={{ remember: true }}
						onFinish={handleOk}
						autoComplete="off"
						form={form}
					>
						<Form.Item
							label="First Name"
							name="first_name"
							initialValue={userDetails?.first_name}
						>
							<Input placeholder="Enter your first name" />
						</Form.Item>
						<Form.Item
							label="Last Name"
							name="last_name"
							initialValue={userDetails?.last_name}
						>
							<Input placeholder="Enter your last name" />
						</Form.Item>
						<Form.Item
							label="Display Name"
							name="display_name"
							initialValue={userDetails?.display_name}
						>
							<Input placeholder="Enter your display name" />
						</Form.Item>
						<Form.Item
							label="Email"
							name="email"
							initialValue={userDetails?.email}
						>
							<Input placeholder="Enter your email" />
						</Form.Item>
					</Form>
				</Modal>
			</div>
		);
	};

	const Security = () =>
	{
		return (
			<h1>Security</h1>
		);
	};

	const Social = () =>
	{
		return (
			<h1>Social</h1>
		);
	};

	const tabs = [
		{
			label: `Details`,
			key: Math.random() * 10,
			children: <Details />,
		},
		{
			label: `Security`,
			key: Math.random() * 10,
			children: <Security />,
		},
		{
			label: `Social`,
			key: Math.random() * 10,
			children: <Social />,
		}
	];

	function fetchUserDetails()
	{
		userDetails.created_at = changeISODatesToReadable(userDetails.created_at);
		setProfilePicture(userDetails.profile_picture ? userDetails?.profile_picture : "https://www.nicepng.com/png/detail/933-9332131_profile-picture-default-png.png");
	}

	const handleProfileImageUpload = async (options) =>
	{
		const formData = new FormData();
		formData.append('files', options.file);
		try
		{
			const uploadToS3 = await axiosClient.post('/misc/upload-all', formData, {
				headers: {
					'Content-Type': 'multipart/form-data',
				}
			});
			const response = await axiosClient.patch('/user', { profile_picture: uploadToS3.data.result.url });
			response.data.result.created_at = changeISODatesToReadable(response?.data?.result?.created_at);
			setUserDetails(response.data.result);
			setProfilePicture(uploadToS3.data.result.url);
			message.success("Profile picture updated successfully");
		}
		catch (error)
		{
			console.log(error);
			message.error(error.response.data.message);
		}
	};

	useEffect(() =>
	{
		fetchUserDetails();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);
	return (
		<Row gutter={[10, 15]}>
			<Col xs={24} md={8} xl={8}>
				<div className="card">
					<div className="info-container">
						<h2 className="name">{userDetails?.display_name}</h2>
					</div>
					<Divider />
					<div className="image-container">
						<Image src={profilePicture} alt="profile-picture" className="image" />
					</div>
					<Divider />
					<div className="button-container">
						<Upload
							accept="image/*"
							customRequest={handleProfileImageUpload}
							showUploadList={false}
						>
							<Button type="primary" className="upload-button" >Upload Photo</Button>
						</Upload>
					</div>
					<h3 className="display-name">Member Since: {userDetails?.created_at}</h3>
				</div>
			</Col>
			<Col xs={24} md={16} xl={16}>
				<div className="card">
					<h2 className="name">Account Details</h2>
					<Divider />
					<div>
						<Tabs
							tabBarStyle={{ color: 'black!important', backgroundColor: 'black!important' }}
							defaultActiveKey="1"
							size="large"
							style={{ marginBottom: 32 }}
							items={tabs}
						/>
					</div>
				</div>
			</Col>
		</Row>
	);
};



export default UserAccount;
