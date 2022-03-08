import React, { useContext, useEffect, useState } from "react";
import userContext from "../context/userContext";
import { useHistory } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";

import "react-toastify/dist/ReactToastify.css";
import CropFreeRoundedIcon from "@mui/icons-material/CropFreeRounded";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import { css } from "@emotion/react";
import { ScaleLoader } from "react-spinners";
import "../CSS/Home.css";

const override = css`
	position: absolute;
	margin-left: 48%;
`;
const Home = () => {
	const s = useContext(userContext);
	const history = useHistory();
	const [loading, setLoading] = useState(false);
	const [currentTime, setCurrentTime] = useState("");
	useEffect(() => {
		if (s.user.name === "") {
			history.push("/login");
		}
		// eslint-disable-next-line
	}, []);

	setInterval(() => {
		setCurrentTime(new Date().toLocaleTimeString());
	}, 1000);

	const tableParcelBills = async (profileData) => {
		try {
			setLoading(true);
			const token = localStorage.getItem("token");
			if (token == null) {
				setLoading(false);
				throw new Error();
			}
			const requestOptions = {
				method: "PATCH",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
				body: JSON.stringify(profileData),
			};
			const response = await fetch(
				"http://localhost:4000/users/me",
				requestOptions
			);
			const data = await response.json();
			setLoading(false);
			return data;
		} catch (error) {
			toast.error("Error...", {
				position: toast.POSITION.TOP_CENTER,
				autoClose: 5000,
			});
			setLoading(false);
			console.log(error);
		}
	};
	const addToBills = async (bill) => {
		try {
			setLoading(true);
			const token = localStorage.getItem("token");
			if (token == null) {
				setLoading(false);
				throw new Error();
			}
			const requestOptions = {
				method: "PATCH",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
				body: JSON.stringify(bill),
			};
			const response = await fetch(
				"http://localhost:4000/users/bills",
				requestOptions
			);
			const data = await response.json();
			setLoading(false);
			return data;
		} catch (error) {
			toast.error("Error...", {
				position: toast.POSITION.TOP_CENTER,
				autoClose: 5000,
			});
			setLoading(false);
			console.log(error);
		}
	};
	useEffect(() => {
		if (s.user.name) {
			tableParcelBills(s.user)
				.then((data) => {
					s.changeUser(data);
					console.log(data);
				})
				.catch((e) => {
					toast.error("Error...", {
						position: toast.POSITION.TOP_CENTER,
						autoClose: 5000,
					});
					console.log(e);
				});
		}
		// eslint-disable-next-line
	}, []);
	const addParcel = () => {
		const parcel = {
			parcelNumber: 0,
			waiter: "",
			foodItem: [],
			totalAmount: 0,
			paymentMode: "",
			status: "Pending",
		};
		const profile = { ...s.user };
		profile.parcel.push(parcel);
		tableParcelBills(profile)
			.then((data) => {
				s.changeUser(data);
				console.log(data);
				toast.success("Empty Parcel added", {
					position: toast.POSITION.TOP_CENTER,
					autoClose: 5000,
				});
			})
			.catch((e) => {
				toast.error("Error...", {
					position: toast.POSITION.TOP_CENTER,
					autoClose: 5000,
				});
				console.log(e);
			});
	};

	const addTable = () => {
		const table = {
			tableNumber: 0,
			waiter: "",
			foodItem: [],
			totalAmount: 0,
			paymentMode: "",
			status: "Pending",
		};
		const profile = { ...s.user };
		profile.table.push(table);
		console.log(profile);
		tableParcelBills(profile)
			.then((data) => {
				s.changeUser(data);
				toast.success("Empty table added", {
					position: toast.POSITION.TOP_CENTER,
					autoClose: 5000,
				});
				console.log(data);
			})
			.catch((e) => {
				toast.error("Error...", {
					position: toast.POSITION.TOP_CENTER,
					autoClose: 5000,
				});
				console.log(e);
			});
	};

	const cancelParcel = (data) => {
		if (data.foodItem.length === 0 || data.status === "Complete") {
			const parcelItems = s.user.parcel.filter((e) => {
				return e._id !== data._id;
			});
			if (data.foodItem.length !== 0 && data.paymentMode === "") {
				toast.error("Payment mode is not selected...", {
					position: toast.POSITION.TOP_CENTER,
					autoClose: 3000,
				});
				return;
			}
			const profile = { ...s.user };
			if (data.status === "Complete") {
				if (data.paymentMode === "Pending") {
					data.discription = "";
					data.time = new Date(data.time).toLocaleString();
					profile.bills = [...profile.bills, data];
				} else {
					addToBills(data)
						.then((da) => {
							console.log("Hello", da);
						})
						.catch((e) => {
							toast.error("Error...", {
								position: toast.POSITION.TOP_CENTER,
								autoClose: 5000,
							});
							console.log(e);
						});
				}
			}
			profile.parcel = parcelItems;
			tableParcelBills(profile)
				.then((d) => {
					s.changeUser(d);
					data.foodItem.length === 0
						? toast.success("Empty bill deleted", {
								position: toast.POSITION.TOP_CENTER,
								autoClose: 5000,
						  })
						: toast.success(
								"Bill deleted from here and Saved to data base",
								{
									position: toast.POSITION.TOP_CENTER,
									autoClose: 5000,
								}
						  );
					console.log(data);
				})
				.catch((e) => {
					toast.error("Error...", {
						position: toast.POSITION.TOP_CENTER,
						autoClose: 5000,
					});
					console.log(e);
				});
		} else {
			toast.warn("Bill is not completed", {
				position: toast.POSITION.TOP_CENTER,
				autoClose: 3000,
			});
		}
	};

	const cancelTable = (data) => {
		if (data.foodItem.length === 0 || data.status === "Complete") {
			const tableItem = s.user.table.filter((e) => {
				return e._id !== data._id;
			});
			if (data.foodItem.length !== 0 && data.paymentMode === "") {
				toast.error("Payment mode is not selected...", {
					position: toast.POSITION.TOP_CENTER,
					autoClose: 3000,
				});
				return;
			}
			const profile = { ...s.user };
			if (data.status === "Complete") {
				if (data.paymentMode === "Pending") {
					data.discription = "";
					data.time = new Date(data.time).toLocaleString();
					profile.bills = [...profile.bills, data];
				} else {
					addToBills(data)
						.then((da) => {
							console.log("Hello", da);
						})
						.catch((e) => {
							toast.error("Error...", {
								position: toast.POSITION.TOP_CENTER,
								autoClose: 5000,
							});
							console.log(e);
						});
				}
			}
			profile.table = tableItem;
			tableParcelBills(profile)
				.then((d) => {
					s.changeUser(d);
					data.foodItem.length === 0
						? toast.success("Empty bill deleted", {
								position: toast.POSITION.TOP_CENTER,
								autoClose: 5000,
						  })
						: toast.success(
								"Bill deleted from here and Saved to data base",
								{
									position: toast.POSITION.TOP_CENTER,
									autoClose: 5000,
								}
						  );
					console.log(data);
				})
				.catch((e) => {
					toast.error("Error...", {
						position: toast.POSITION.TOP_CENTER,
						autoClose: 5000,
					});
					console.log(e);
				});
		} else {
			toast.warn("Bill is not completed", {
				position: toast.POSITION.TOP_CENTER,
				autoClose: 3000,
			});
		}
	};

	// console.log(s);
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
			<div className="home">
				{/* css={override} */}
				<header>
					<h2>
						<CalendarTodayIcon />
						&nbsp;&nbsp;&nbsp;
						{new Date().toDateString()}
					</h2>
					<h3>
						<AccessTimeIcon />
						&nbsp;&nbsp;&nbsp;
						{currentTime}
					</h3>
				</header>
				<div className="billing-section">
					<div className="parcel">
						{/* <div className="btn btn-bottom">
							<button>
								<LocalPrintshopTwoToneIcon />
								PRINT KOT <LocalPrintshopTwoToneIcon />
							</button>
						</div> */}
						<h2>Parcel</h2>
						<div className="parcel-bills">
							{s.user.parcel.map((e) => {
								return (
									<>
										<div
											className="bill"
											style={{
												backgroundColor:
													e.status === "Complete"
														? "#50ff5d"
														: "white",
											}}
										>
											<div className="bill-head">
												<p>
													Parcel No: {e.parcelNumber}
												</p>
												<div className="min-max">
													<button
														onClick={() => {
															const menu = [
																...s.user.menu,
																...s.user
																	.stocks,
															];
															history.push({
																pathname:
																	"/tableParcelBill",
																state: {
																	e,
																	menu,
																},
															});
														}}
													>
														<CropFreeRoundedIcon />
													</button>
													<button
														onClick={() => {
															cancelParcel(e);
														}}
													>
														<CancelOutlinedIcon />
													</button>
												</div>
											</div>
											<p>Waiter: {e.waiter}</p>
											<div className="bill-body">
												<p>Status : {e.status}</p>
												<p>
													Total Amount:{" "}
													{e.totalAmount} ₹
												</p>
											</div>
										</div>
									</>
								);
							})}
						</div>
						<div className="btn">
							<button onClick={addParcel}>
								<AddCircleOutlineIcon />
								ADD PARCEL
								<AddCircleOutlineIcon />
							</button>
						</div>
					</div>
					<div className="table">
						<h2>Table</h2>
						<div className="tables-bills">
							{s.user.table.map((e) => {
								return (
									<>
										<div
											className="bill"
											style={{
												backgroundColor:
													e.status === "Complete"
														? "#50ff5d"
														: "white",
											}}
										>
											<div className="bill-head">
												<p>Table No: {e.tableNumber}</p>
												<div className="min-max">
													<button
														onClick={() => {
															const menu = [
																...s.user.menu,
																...s.user
																	.stocks,
															];
															history.push({
																pathname:
																	"/tableParcelBill",
																state: {
																	e,
																	menu,
																},
															});
														}}
													>
														<CropFreeRoundedIcon />
													</button>
													<button
														onClick={() => {
															cancelTable(e);
														}}
													>
														<CancelOutlinedIcon />
													</button>
												</div>
											</div>
											<p>Waiter: {e.waiter}</p>
											<div className="bill-body">
												<p>Status : {e.status}</p>
												<p>
													Total Amount:{" "}
													{e.totalAmount} ₹
												</p>
											</div>
										</div>
									</>
								);
							})}

							<div className="btn">
								<button onClick={addTable}>
									<AddCircleOutlineIcon />
									ADD TABLE
									<AddCircleOutlineIcon />
								</button>
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	);
};

export default Home;
