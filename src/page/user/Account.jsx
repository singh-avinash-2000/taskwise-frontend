import { Card, Col, Row, Image, Divider, Tabs } from "antd";
// import { EllipsisOutlined, SettingOutlined, EditOutlined } from "@ant-design/icons";
import "../css/user-account.css";

const UserAccount = () => {

	const { Meta } = Card;
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

	const cp = "https://images.unsplash.com/photo-1423479185712-25d4a4fe1006?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTZ8fHByb2ZpbGV8ZW58MHx8MHx8&auto=format&fit=crop&w=500&q=60";
	const pp = "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1";
	return (
		<Row gutter={[10, 15]}>
			<Col xs={24} md={8} xl={8}>
				<div className="card">
					<div className="info-container">
						<h2 className="name">@Avinash-UTL</h2>
					</div>
					<Divider />
					<div className="image-container">
						<Image src={cp} alt="profile-picture" className="image" />
						{/* <Image src={pp} alt="profile-picture" className="image" /> */}
					</div>
					<Divider />
					<div className="button-container">
						<button className="upload-button">
							Upload Photo
						</button>
					</div>
					<h3 className="display-name">Member Since: 29 September 2022</h3>
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

const Details = () => {
	return (
		<h1>Details</h1>
	);
};

const Security = () => {
	return (
		<h1>Security</h1>
	);
};

const Social = () => {
	return (
		<h1>Social</h1>
	);
};

export default UserAccount;
