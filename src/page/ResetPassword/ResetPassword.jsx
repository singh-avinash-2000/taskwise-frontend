import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Input, message } from 'antd';
import { HeatMapOutlined, EyeOutlined, EyeInvisibleOutlined } from '@ant-design/icons';
import { axiosClient } from "../../config/axios";
import axios from "axios";

function ResetPassword()
{

	const navigate = useNavigate();
	const [password, setPassword] = useState("");
	const [confirmpassword, setConfirmPassword] = useState("");
	const { userId, resetToken } = useParams();

	const handleChangePassword = async (e) =>
	{
		e.preventDefault();
		if (password !== confirmpassword)
		{
			message.error("Passwords do not match");
			return;
		}

		try
		{
			// const response = await axiosClient.post('/auth/resetPassword', { userId, resetToken, password });
			const response = await axios.post(`${process.env.REACT_APP_BASE_URL}/auth/resetPassword`, { userId, resetToken, password });
			if (response.status === 200)
			{
				message.success("Password changed successfully");
				navigate("/login");
			}
		} catch (error)
		{
			console.log(error);
			message.error(error.response.data.message);
		}
	};

	const checkToken = async () =>
	{
		try
		{
			await axiosClient.get(`/auth/resetPassword/${userId}/${resetToken}`);
		} catch (error)
		{
			message.error("Invalid Token");
			navigate("/login");
		}
	};

	useEffect(() =>
	{
		checkToken();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);


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
				<h3 className="form-title">Reset Password</h3>
				<div className="form">
					<h5 className="supporting-text">Enter your new Password</h5>
					<Input.Password
						className="custom-input"
						placeholder="New Password"
						value={password}
						onChange={(e) =>
						{
							setPassword(e.target.value);
						}}
						iconRender={visible => (visible ? <EyeOutlined /> : <EyeInvisibleOutlined />)}
						allowClear
					/>
					<Input.Password
						className="custom-input"
						placeholder="Confirm New Password"
						value={confirmpassword}
						onChange={(e) =>
						{
							setConfirmPassword(e.target.value);
						}}
						iconRender={visible => (visible ? <EyeOutlined /> : <EyeInvisibleOutlined />)}
						allowClear
					/>
					<div >
						<button className="signin-button" onClick={handleChangePassword}>Change Password</button>
					</div>
				</div>
			</div>
			<h4 className="cr-text">Copyright @ Task Wise {new Date().getFullYear()} | Privacy Policy</h4>
		</div>
	);
};

export default ResetPassword;
