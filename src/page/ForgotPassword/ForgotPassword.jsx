import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input, message } from 'antd';
import { CheckCircleTwoTone, SyncOutlined, HeatMapOutlined } from '@ant-design/icons';
import { axiosClient } from "../../config/axios";

function ForgotPassword()
{

	const [isValidEmail, setIsValidEmail] = useState(true);
	const [email, setEmail] = useState("");
	const navigate = useNavigate();

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

	const handleResetLink = async (e) =>
	{
		e.preventDefault();
		try
		{
			const response = await axiosClient.post("/auth/forgotPassword", { email });
			if (response.status === 200)
			{
				message.success("Reset link sent to your email");
				navigate("/login");
			}
		} catch (error)
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

			</div>

			<div className="login-container">
				<h3 className="form-title">Forgot Password</h3>
				<div className="form">
					<h5 className="supporting-text">Enter your registered email</h5>
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
					<div >
						<button className="signin-button" onClick={handleResetLink}>Send Reset Link</button>
					</div>
				</div>
				{/* <h3 className="extra-text"> &mdash; Or Login with &mdash;</h3>
				<div className="button-container">
					<Button type="secondary" className="icon-button" shape="round" icon={<GoogleOutlined />} size="large" >
						Google
					</Button>
				</div> */}
			</div>
			<h4 className="cr-text">Copyright @ Task Wise {new Date().getFullYear()} | Privacy Policy</h4>
		</div>
	);
};

export default ForgotPassword;
