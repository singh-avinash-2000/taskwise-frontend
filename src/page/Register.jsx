import { useState } from "react";
import { Input, Button, Steps } from 'antd';
import { EyeInvisibleOutlined, CheckCircleTwoTone, EyeOutlined, SyncOutlined, GoogleOutlined, AppleFilled, FacebookFilled, LockOutlined, UserOutlined } from '@ant-design/icons';

import "./css/login.css";

const Register = () =>
{
	const [state, setState] = useState(true);

	const handleBlur = (e) =>
	{
		if (validateEmail(e.target.value))
		{
			setState(false);
		}
		else
		{
			setState(true);
		}
	};

	const validateEmail = (email) =>
	{
		return String(email)
			.toLowerCase()
			.match(
				/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
			);
	};

	return (
		<div className="container">
			<div className="nav-container">
				<div className="logo-container">
					<h3 className="logo-text">KHEERA</h3>
					<hr />
					<span className="email">CONNECT@KHEERA.CO</span>
				</div>
				<div>
					<button className="request-button">Login</button>
				</div>
			</div>

			<div className="login-container">
				<h3 className="form-title">Get Started</h3>
				<div className="form">
					<h5 className="supporting-text">Hey, Enter your details to create your account</h5>
					<Input
						className="custom-input"
						placeholder="Display Name"
						allowClear
						type="email"
						suffix={state ? <SyncOutlined spin /> : <CheckCircleTwoTone twoToneColor="#52c41a" />}
						onBlur={handleBlur}
						onClick={handleBlur}
					/>
					<Input
						className="custom-input"
						placeholder="Email Address"
						allowClear
						type="email"
						suffix={state ? <SyncOutlined spin /> : <CheckCircleTwoTone twoToneColor="#52c41a" />}
						onBlur={handleBlur}
						onClick={handleBlur}
					/>
					<Input.Password
						className="custom-input"
						placeholder="Password"
						iconRender={visible => (visible ? <EyeOutlined /> : <EyeInvisibleOutlined />)}
						allowClear
					/>
					<Input.Password
						className="custom-input"
						placeholder="Confirm Password"
						iconRender={visible => (visible ? <EyeOutlined /> : <EyeInvisibleOutlined />)}
						allowClear
					/>
					<div >
						<button className="signin-button">Register</button>
					</div>
				</div>
				<h3 className="extra-text"> &mdash; Or Login with &mdash;</h3>
				<div className="button-container">
					<Button type="secondary" className="icon-button" shape="round" icon={<GoogleOutlined />} size="large">
						Google
					</Button>
					<Button type="secondary" className="icon-button" shape="round" icon={<AppleFilled />} size="large">
						Apple
					</Button>
					<Button type="secondary" className="icon-button" shape="round" icon={<FacebookFilled />} size="large">
						Facebook
					</Button>
				</div>
			</div>
			<h4 className="cr-text">Copyright @ KHEERA 2022 | Privacy Policy</h4>
		</div>
	);
};

export default Register;
