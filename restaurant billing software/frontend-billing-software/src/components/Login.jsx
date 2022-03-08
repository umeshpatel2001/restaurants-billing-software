import React, { useState, useContext, useEffect } from "react";
import userContext from "../context/userContext";
import { useHistory } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import MailOutlineIcon from "@material-ui/icons/MailOutline";
import VpnKeyOutlinedIcon from "@mui/icons-material/VpnKeyOutlined";
import LoginOutlinedIcon from "@mui/icons-material/LoginOutlined";
import ClearAllOutlinedIcon from "@mui/icons-material/ClearAllOutlined";
import "../CSS/Login.css";
import { css } from "@emotion/react";
import { ScaleLoader } from "react-spinners";
 
const override = css`
	position: absolute;
	margin-left: 48%;
`;

const Login = () => {
	const [credentials, setCredentials] = useState({ email: "", password: "" });
	const s = useContext(userContext);
	const history = useHistory();
	const [loading, setLoading] = useState(false);
	async function verifyUser() {
		try {
			const requestOptions = {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					email: credentials.email,
					password: credentials.password,
				}),
			};
			const response = await fetch(
				"http://localhost:4000/users/login",
				requestOptions
			);
			if (!response.ok) {
				throw new Error("Invalid credentials");
			}
			const data = await response.json();
			localStorage.setItem("token", data.token);
			s.changeUser(data.user);

			history.push("/");
		} catch (error) {
			toast.warning("Error...", {
				position: toast.POSITION.TOP_CENTER,
				autoClose: 5000,
			});
			console.log(error);
		}
	}

	async function getUserProfile() {
		try {
			setLoading(true);
			const token = localStorage.getItem("token");
			if (token == null) {
				setLoading(false);
				throw new Error();
			}
			const requestOptions = {
				method: "GET",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
			};
			const response = await fetch(
				"http://localhost:4000/users/me",
				requestOptions
			);
			if (!response.ok) {
				setLoading(false);
				const error = new Error(response.error);
				throw error;
			}
			const data = await response.json();
			setLoading(false)
			return data;
		} catch (error) {
			setLoading(false);
		}
	}
	useEffect(() => {
		if (s.user.name === "") {
			console.log("hiiii");
			getUserProfile().then((data) => {
				if (!data) {
					return;
				}
				s.changeUser(data);
				history.push("/");
				// setParentLoader(false);
			});
		}
		// eslint-disable-next-line
	}, []);
	return (
		<>
			<ToastContainer />
			<ScaleLoader
				loading={loading}
				css={override}
				height={40}
				width={5}
				margin={4}
			/>
			<div className="login">
				<div>
					<div className="login-box">
						<h1>Log In</h1>
						<div className="email-input">
							<MailOutlineIcon />
							<input
								type="text"
								placeholder="Email"
								onChange={(e) =>
									setCredentials({
										...credentials,
										email: e.target.value,
									})
								}
								value={credentials.email}
							/>
						</div>
						<div className="password-input">
							<VpnKeyOutlinedIcon />
							<input
								type="password"
								placeholder="Password"
								onChange={(e) =>
									setCredentials({
										...credentials,
										password: e.target.value,
									})
								}
								value={credentials.password}
							/>
						</div>
						<div className="btns">
							<button className="btn-login" onClick={verifyUser}>
								Login
								<LoginOutlinedIcon />
							</button>
							<button
								className="btn-clear"
								onClick={() => {
									setCredentials({ email: "", password: "" });
								}}
							>
								Clear <ClearAllOutlinedIcon />
							</button>
						</div>
					</div>
				</div>
			</div>
		</>
	);
};

export default Login;
