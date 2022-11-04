import { useState } from "react";
import { Input, Button } from 'antd';
import { EyeInvisibleOutlined, CheckCircleTwoTone, EyeOutlined, SyncOutlined, GoogleOutlined, AppleFilled, FacebookFilled } from '@ant-design/icons';

import "./css/login.css";

const Login = () =>
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
					<span className="logo-text">KHEERA</span>
					<br />
					<hr />
					<span className="email">CONNECT@KHEERA.CO</span>
				</div>
				<div className="button-container">
					<button className="signup-button">Sign Up</button>
					<button className="request-button">Demo</button>
				</div>
			</div>

			<div className="login-container">
				<h3 className="form-title">Sign In</h3>
				<h5 className="supporting-text">Hey, Enter your details to sign in to your account</h5>
				<div className="form">
					<Input
						className="custom-input"
						placeholder="Enter Email / Phone No"
						allowClear
						type="email"
						suffix={state ? <SyncOutlined spin /> : <CheckCircleTwoTone twoToneColor="#52c41a" />}
						onBlur={handleBlur}
						onClick={handleBlur}
					/>
					<Input.Password
						className="custom-input"
						placeholder="Enter Password"
						iconRender={visible => (visible ? <EyeOutlined /> : <EyeInvisibleOutlined />)}
						allowClear
					/>
					<h3>Having trouble signing in?</h3>
					<div style={{ width: "100%" }}>
						<button className="signin-button">Sign In</button>
					</div>
				</div>
				<h3 className="extra-text"> &mdash; Or Sign In with &mdash;</h3>
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

export default Login;
