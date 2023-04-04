import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Input, Button, message } from 'antd';
import { EyeInvisibleOutlined, CheckCircleTwoTone, EyeOutlined, SyncOutlined, GoogleOutlined, AppleFilled, FacebookFilled, LockOutlined, UserOutlined, HeatMapOutlined } from '@ant-design/icons';
// import axios from "axios";
import { axiosClient } from "../../config/axios";

import "../Login/login.css";

const Register = () =>
{
	const [isValidEmail, setIsValidEmail] = useState(true);
	const [formState, setFormState] = useState({});
	let navigate = useNavigate();
	const handleBlur = (e) =>
	{
		if (validateEmail(e.target.value))
		{
			setIsValidEmail(false);
		}
		else
		{
			setIsValidEmail(true);
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

	const handleFormChange = (e) =>
	{
		formState[e.target.name] = e.target.value;
		setFormState(formState);
	};

	const handleRegister = async () =>
	{
		try
		{
			if (formState.password.trim() !== formState.confirm_password.trim())
			{
				alert("passwords doesn't match");
			}
			else
			{
				const response = await axiosClient.post("/auth/register", formState);
				localStorage.setItem("accessToken", response.data.result.accessToken);
				navigate("/");
				message.success(response.data.message);
			}
		}
		catch (error)
		{
			console.log(error);
			message.error("Something went wrong!");
		}

	};

	return (
		<div className="container">
			<div className="nav-container">
				<div className="logo-container">
					<HeatMapOutlined className="logo" />
					<span className="logo-text">PING</span>
					<hr />
					<span className="email">CONNECT@PING.CO</span>
				</div>
				<div>
					<Link to="/login"><button className="request-button">Login</button></Link>
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
						value={formState.display_name}
						name="display_name"
						onChange={handleFormChange}
						type="text"
					/>
					<Input
						className="custom-input"
						placeholder="Email Address"
						allowClear
						type="email"
						value={formState.email}
						name="email"
						onChange={handleFormChange}
						suffix={isValidEmail ? <SyncOutlined spin /> : <CheckCircleTwoTone twoToneColor="#52c41a" />}
						onBlur={handleBlur}
						onClick={handleBlur}
					/>
					<Input.Password
						className="custom-input"
						placeholder="Password"
						value={formState.password}
						name="password"
						onChange={handleFormChange}
						iconRender={visible => (visible ? <EyeOutlined /> : <EyeInvisibleOutlined />)}
						allowClear
					/>
					<Input.Password
						className="custom-input"
						placeholder="Confirm Password"
						value={formState.confirm_password}
						name="confirm_password"
						onChange={handleFormChange}
						iconRender={visible => (visible ? <EyeOutlined /> : <EyeInvisibleOutlined />)}
						allowClear
					/>
					<div >
						<button className="signin-button" onClick={handleRegister} >Register</button>
					</div>
				</div>
				{/* <h3 className="extra-text"> &mdash; Or Login with &mdash;</h3>
				<div className="button-container">
					<Button type="secondary" className="icon-button" shape="round" icon={<GoogleOutlined />} size="large">
						Google
					</Button>
				</div> */}
			</div>
			<h4 className="cr-text">Copyright @ PING {new Date().getFullYear()} | Privacy Policy</h4>
		</div>
	);
};

export default Register;
