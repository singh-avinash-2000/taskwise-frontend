import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Input, message } from 'antd';
import { EyeInvisibleOutlined, CheckCircleTwoTone, EyeOutlined, SyncOutlined, HeatMapOutlined, CloseCircleTwoTone } from '@ant-design/icons';
import { axiosClient } from "../../config/axios";

import "../Login/login.css";

const Register = () =>
{
	const [isValidEmail, setIsValidEmail] = useState(false);
	const [isValidDisplayName, setIsValidDisplayName] = useState(false);
	const [email, setEmail] = useState("");
	const [displayName, setDisplayName] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");

	let navigate = useNavigate();

	// const handleBlur = (e) =>
	// {
	// 	if (validateEmail(e.target.value))
	// 	{
	// 		setIsValidEmail(false);
	// 	}
	// 	else
	// 	{
	// 		setIsValidEmail(true);
	// 	}
	// };

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

	const checkExistingDisplayName = async (displayName) =>
	{
		try
		{
			setDisplayName(displayName.toLowerCase());
			if (displayName.length > 5)
			{
				await axiosClient.get("/auth/check-valid?display_name=" + displayName.toLowerCase());
				setIsValidDisplayName(true);
			}
			else
			{
				setIsValidDisplayName(false);
			}

		} catch (error)
		{
			setIsValidDisplayName(false);
		}
	};

	const handleRegister = async () =>
	{
		try
		{
			if (password.trim() !== confirmPassword.trim())
			{
				alert("passwords doesn't match");
				return;
			}
			else if (!isValidDisplayName)
			{
				alert("Display name already taken");
				return;
			}
			else
			{
				const response = await axiosClient.post("/auth/register", {
					email,
					display_name: displayName,
					password,
					confirmPassword
				});
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
					<span className="logo-text">Task Wise</span>
					<hr />
					<span className="email">CONNECT@TASKWISE.CO</span>
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
						value={displayName}
						name="display_name"
						onChange={(e) =>
						{
							checkExistingDisplayName(e.target.value);
						}}
						type="text"
						suffix={displayName ? isValidDisplayName ? <CheckCircleTwoTone twoToneColor="#52c41a" /> : <CloseCircleTwoTone twoToneColor="red" /> : ""}
					/>
					<Input
						className="custom-input"
						placeholder="Email Address"
						name="email"
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
						name="password"
						onChange={(e) =>
						{
							setPassword(e.target.value);
						}}
						iconRender={visible => (visible ? <EyeOutlined /> : <EyeInvisibleOutlined />)}
						allowClear
					/>
					<Input.Password
						className="custom-input"
						placeholder="Confirm Password"
						value={confirmPassword}
						name="confirm_password"
						onChange={(e) =>
						{
							setConfirmPassword(e.target.value);
						}}
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
			<h4 className="cr-text">Copyright @ Task Wise {new Date().getFullYear()} | Privacy Policy</h4>
		</div>
	);
};

export default Register;
