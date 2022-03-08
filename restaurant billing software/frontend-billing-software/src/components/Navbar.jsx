import React, { useContext, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import LoginOutlinedIcon from "@mui/icons-material/LoginOutlined";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import SettingsIcon from "@mui/icons-material/Settings";
import { css } from "@emotion/react";
import { ScaleLoader } from "react-spinners";

import "../CSS/Navbar.css";
import userContext from "../context/userContext";
const override = css`
	position: absolute;
	margin-left: 48%;
	margin-top: 5rem;
`;
const Navbar = () => {
	const s = useContext(userContext);
	const [loading, setLoading] = useState(false);
	const history = useHistory();
	async function logoutUser() {
		try {
			setLoading(true);
			const token = localStorage.getItem("token");
			if (token == null) {
				setLoading(false);
				throw new Error();
			}
			const requestOptions = {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
			};
			await fetch(
				"http://localhost:4000/users/logoutAll",
				requestOptions
			);
			localStorage.removeItem("token");
			s.changeUser({
				name: "",
				email: "",
				menu: [],
				waiter: [],
				parcel: [],
				table: [],
				bills: [],
			});
			setLoading(false);
			history.push("/login");
		} catch (error) {
			setLoading(false);
			history.push("/login");
		}
	}

	if (s.user.name === "" || s.user.name === undefined) {
		return (
			<>
				<nav className="navbar">
					<div className="img">
						<Link to="/">
							{/* <img src="images/logo.png" alt="Logo" /> */}
							<h3>Umang</h3>
						</Link>
					</div>
					<div className="links">
						<div>
							<Link to="/login">
								Login&nbsp;
								<LoginOutlinedIcon />
							</Link>
						</div>
					</div>
				</nav>
			</>
		);
	} else {
		return (
			<>
				<ScaleLoader
					loading={loading}
					css={override}
					height={40}
					width={5}
					margin={4}
				/>
				<nav className="navbar">
					<div className="img">
						<Link to="/">
							{/* <img src="images/logo.png" alt="Logo" /> */}
							<h3>Umang</h3>
						</Link>
					</div>
					<div className="links">
						<div>
							<Link to="/">
								Home&nbsp;
								<HomeOutlinedIcon />
							</Link>
						</div>
						<div>
							<Link to="/setting">
								Setting&nbsp;
								<SettingsIcon />
							</Link>
						</div>
						<div>
							<Link to="#" onClick={logoutUser}>
								Logout&nbsp;
								<LogoutOutlinedIcon />
							</Link>
						</div>
					</div>
				</nav>
			</>
		);
	}
};

export default Navbar;
