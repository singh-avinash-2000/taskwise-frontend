import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Input, Button, message } from 'antd';
import { EyeInvisibleOutlined, CheckCircleTwoTone, EyeOutlined, SyncOutlined, GoogleOutlined, AppleFilled, FacebookFilled, HeatMapOutlined } from '@ant-design/icons';
import "./css/login.css";
import axios from "axios";

const Login = () =>
{
	const [isValidEmail, setIsValidEmail] = useState(true);
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const routes = useNavigate();

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

	const handleLogin = async () =>
	{
		try
		{
			if (!email.trim() || !password.trim())
			{
				alert("invalid");
			}
			else
			{
				const data = {
					email,
					password
				};

				const response = await axios.post(process.env.REACT_APP_BASE_URL + "/auth/login", data);

				message.success(response.data.message);

				localStorage.setItem("token", response.data.result.token);

				routes("/dashboard");
			}
		}
		catch (error)
		{
			message.error(error.response.data.message);
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
					<Link to="/register"><button className="request-button">Create Account</button></Link>
				</div>
			</div>

			<div className="login-container">
				<h3 className="form-title">Login</h3>
				<div className="form">
					<h5 className="supporting-text">Hey, Enter your details to login to your account</h5>
					<Input
						className="custom-input"
						placeholder="Email Address"
						allowClear
						type="email"
						value={email}
						onChange={(e) =>
						{
							setEmail(e.target.value);
						}}
						suffix={isValidEmail ? <SyncOutlined spin /> : <CheckCircleTwoTone twoToneColor="#52c41a" />}
						onBlur={handleBlur}
						onClick={handleBlur}
					/>
					<Input.Password
						className="custom-input"
						placeholder="Password"
						value={password}
						onChange={(e) =>
						{
							setPassword(e.target.value);
						}}
						iconRender={visible => (visible ? <EyeOutlined /> : <EyeInvisibleOutlined />)}
						allowClear
					/>
					<h3>Having trouble loging in?</h3>
					<div >
						<button className="signin-button" onClick={handleLogin}>Login</button>
					</div>
				</div>
				<h3 className="extra-text"> &mdash; Or Login with &mdash;</h3>
				<div className="button-container">
					<Button type="secondary" className="icon-button" shape="round" icon={<GoogleOutlined />} size="large" >
						Google
					</Button>
					{/* <Button type="secondary" className="icon-button" shape="round" icon={<AppleFilled />} size="large">
						Apple
					</Button>
					<Button type="secondary" className="icon-button" shape="round" icon={<FacebookFilled />} size="large">
						Facebook
					</Button> */}
				</div>
			</div>
			<h4 className="cr-text">Copyright @ PING 2022 | Privacy Policy</h4>
		</div>
	);
};

export default Login;
