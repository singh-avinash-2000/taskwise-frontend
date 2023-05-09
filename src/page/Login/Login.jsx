import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Input, message } from 'antd';
import { EyeInvisibleOutlined, CheckCircleTwoTone, EyeOutlined, SyncOutlined, HeatMapOutlined } from '@ant-design/icons';
import { axiosClient } from "../../config/axios";

import "./login.css";
const Login = () =>
{
	const [isValidEmail, setIsValidEmail] = useState(false);
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const navigate = useNavigate();
	const params = new URLSearchParams(window.location.search);
	const redirect_url = params.get("redirect");

	const validateEmail = (email) =>
	{
		const isValid = String(email)
			.toLowerCase()
			.match(
				/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
			);

		if (isValid !== null)
		{
			setIsValidEmail(true);
		}
		else
		{
			setIsValidEmail(false);
		}
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

				const response = await axiosClient.post("/auth/login", data);

				message.success(response.data.message);

				localStorage.setItem("accessToken", response.data.result.accessToken);

				if (redirect_url)
				{
					return navigate(redirect_url);
				}
				else
				{
					return navigate("/");
				}
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
					<span className="logo-text">Task Wise</span>
					<hr />
					<span className="email">CONNECT@TASKWISE.CO</span>
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
						type="email"
						value={email}
						allowClear
						onChange={(e) =>
						{
							validateEmail(e.target.value);
							setEmail(e.target.value);
						}}
						suffix={email ? isValidEmail ? <CheckCircleTwoTone twoToneColor="#52c41a" /> : <SyncOutlined spin /> : ""}
					/>
					<Input.Password
						className="custom-input"
						placeholder="Password"
						value={password}
						allowClear
						onChange={(e) =>
						{
							setPassword(e.target.value);
						}}
						iconRender={visible => (visible ? <EyeOutlined /> : <EyeInvisibleOutlined />)}
					/>
					<Link to="/forgotPassword" className="forgot-password"><p>Forgot Password?</p></Link>
					<div >
						<button className="signin-button" onClick={handleLogin}>Login</button>
					</div>
				</div>
			</div>
			<h4 className="cr-text">Copyright @ Task Wise {new Date().getFullYear()} | Privacy Policy</h4>
		</div>
	);
};

export default Login;
