import React, { useEffect, useContext, useState } from "react";
import { useLocation, useHistory } from "react-router-dom";
import userContext from "../context/userContext";
import "react-responsive-modal/styles.css";
import { Modal } from "react-responsive-modal";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import AddTaskOutlinedIcon from "@mui/icons-material/AddTaskOutlined";
import ClearAllOutlinedIcon from "@mui/icons-material/ClearAllOutlined";
import AddCircleSharpIcon from "@mui/icons-material/AddCircleSharp";
import IndeterminateCheckBoxSharpIcon from "@mui/icons-material/IndeterminateCheckBoxSharp";
import RestaurantMenuIcon from "@mui/icons-material/RestaurantMenu";
import FoodBankOutlinedIcon from "@mui/icons-material/FoodBankOutlined";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import MaterialTable from "material-table";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import FastForwardIcon from "@mui/icons-material/FastForward";
import { css } from "@emotion/react";
import { ScaleLoader } from "react-spinners";
import "../CSS/TableParcelBill.css";

const override = css`
	position: absolute;
	margin-left: 48%;
`;

const TableParcelBill = () => {
	const location = useLocation();
	const [loading, setLoading] = useState(false);
	const [modelOpenClose, setModelOpenClose] = useState(false);
	const s = useContext(userContext);
	const history = useHistory();
	const [result, setResult] = useState(s.user.menu);
	const [searchDish, setSearchDish] = useState("");
	const [searchCode, setSearchCode] = useState("");
	const [tableData, setTableData] = useState([]);
	const [tableParcelNumber, setTableParcelNumber] = useState(0);
	const [type, setType] = useState(null);
	const [waiter, setWaiter] = useState(null);
	const [KOTOpenClose, setKOTOpenClose] = useState(false);
	const [KotTableData, setKotTableData] = useState([]);
	const [status, setStatus] = useState("Pending");
	const [paymentMode, setPaymentMode] = useState("");
	const [menuStockData, setMenuStockData] = useState([]);
	useEffect(() => {
		if (s.user.name === "") {
			history.push("/login");
		}
		if (location.state === undefined) {
			return;
		}
		if (location.state.e.billType === "Table") {
			setType("Table");
			s.user.table.forEach((tb) => {
				if (tb._id === location.state.e._id) {
					setTableData(tb.foodItem);
					setKotTableData(tb.foodItem);
					setTableParcelNumber(tb.tableNumber);
					setWaiter(tb.waiter);
					setStatus(tb.status);
					setPaymentMode(tb.paymentMode);
				}
			});
		} else if (location.state.e.billType === "Parcel") {
			setType("Parcel");
			s.user.parcel.forEach((tb) => {
				if (tb._id === location.state.e._id) {
					setTableData(tb.foodItem);
					setKotTableData(tb.foodItem);
					setTableParcelNumber(tb.parcelNumber);
					setWaiter(tb.waiter);
					setStatus(tb.status);
					setPaymentMode(tb.paymentMode);
				}
			});
		}
		const menu = [...s.user.menu, ...s.user.stocks];
		setMenuStockData(menu);
		// setMenuStockData(location.state.menu);
		// eslint-disable-next-line
	}, []);
	// eslint-disable-next-line
	// console.log(location.state);
	useEffect(() => {
		const data = menuStockData.filter((m) => {
			return String(m.code).includes(String(searchCode));
		});
		// console.log(data);
		setResult(data);
		// eslint-disable-next-line
	}, [searchCode]);
	useEffect(() => {
		const data = menuStockData.filter((m) => {
			return String(m.name)
				.toLowerCase()
				.includes(searchDish.trim().toLowerCase());
		});
		// console.log(data);
		setResult(data);
		// eslint-disable-next-line
	}, [searchDish]);

	useEffect(() => {
		if (location.state === undefined) {
			return;
		}
		if (location.state.e.billType === "Table") {
			const profileData = { ...s.user };

			profileData.table.forEach((tb) => {
				if (tb._id === location.state.e._id) {
					tb.foodItem = tableData;
					tb.totalAmount = tableData.reduce((prv, curr) => {
						return prv + Number(curr.amount);
					}, 0);
				}
			});
			s.changeUser(profileData);
		} else if (location.state.e.billType === "Parcel") {
			const profileData = { ...s.user };

			profileData.parcel.forEach((tb) => {
				if (tb._id === location.state.e._id) {
					tb.foodItem = tableData;
					tb.totalAmount = tableData.reduce((prv, curr) => {
						return prv + Number(curr.amount);
					}, 0);
				}
			});
			s.changeUser(profileData);
		}
		setKotTableData(tableData);
		// eslint-disable-next-line
	}, [tableData]);
	// console.log(s.user);
	const columns = [
		{ title: "Name", field: "name" },
		{ title: "नाम", field: "hindiName" },
		{ title: "Quantity", field: "quantity" },
		{
			title: "Rate",
			field: "rate",
			type: "currency",
			currencySetting: { currencyCode: "INR", minimumFractionDigits: 0 },
		},
		{
			title: "Amount",
			field: "amount",
			type: "currency",
			currencySetting: { currencyCode: "INR", minimumFractionDigits: 0 },
		},
	];
	useEffect(() => {
		if (location.state === undefined) {
			return;
		}
		if (location.state.e.billType === "Table") {
			const profile = { ...s.user };
			profile.table.forEach((tb) => {
				if (tb._id === location.state.e._id) {
					tb.tableNumber = tableParcelNumber;
				}
			});
			// console.log("Profile", profile);
			s.changeUser(profile);
		} else if (location.state.e.billType === "Parcel") {
			const profile = { ...s.user };
			profile.parcel.forEach((tb) => {
				if (tb._id === location.state.e._id) {
					tb.parcelNumber = tableParcelNumber;
				}
			});
			s.changeUser(profile);
		}
		// eslint-disable-next-line
	}, [tableParcelNumber]);

	useEffect(() => {
		if (location.state === undefined) {
			return;
		}
		if (location.state.e.billType === "Table") {
			const profile = { ...s.user };
			profile.table.forEach((tb) => {
				if (tb._id === location.state.e._id) {
					tb.waiter = waiter;
				}
			});
			s.changeUser(profile);
		} else if (location.state.e.billType === "Parcel") {
			const profile = { ...s.user };
			profile.parcel.forEach((tb) => {
				if (tb._id === location.state.e._id) {
					tb.waiter = waiter;
				}
			});
			s.changeUser(profile);
		}
		// eslint-disable-next-line
	}, [waiter]);
	useEffect(() => {
		if (location.state === undefined) {
			return;
		}
		if (location.state.e.billType === "Table") {
			const profile = { ...s.user };
			profile.table.forEach((tb) => {
				if (tb._id === location.state.e._id) {
					tb.status = status;
				}
			});
			s.changeUser(profile);
		} else if (location.state.e.billType === "Parcel") {
			const profile = { ...s.user };
			profile.parcel.forEach((tb) => {
				if (tb._id === location.state.e._id) {
					tb.status = status;
				}
			});
			s.changeUser(profile);
		}
		// eslint-disable-next-line
	}, [status]);
	useEffect(() => {
		if (location.state === undefined) {
			return;
		}
		if (location.state.e.billType === "Table") {
			const profile = { ...s.user };
			profile.table.forEach((tb) => {
				if (tb._id === location.state.e._id) {
					tb.paymentMode = paymentMode;
				}
			});
			s.changeUser(profile);
		} else if (location.state.e.billType === "Parcel") {
			const profile = { ...s.user };
			profile.parcel.forEach((tb) => {
				if (tb._id === location.state.e._id) {
					tb.paymentMode = paymentMode;
				}
			});
			s.changeUser(profile);
		}
		// eslint-disable-next-line
	}, [paymentMode]);
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
			setLoading(false);
			console.log(error);
		}
	};
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
			<div className="go-back-button">
				<button onClick={() => history.goBack()}>
					{" "}
					<ArrowBackIcon /> Go Back
				</button>
			</div>
			<div className="basic-info">
				<div className="basic-info-inputs">
					<FoodBankOutlinedIcon />
					<p>{type} Number: </p>
					<input
						type="number"
						onChange={(e) => {
							setTableParcelNumber(e.target.value);
						}}
						value={tableParcelNumber}
						placeholder="Enter Table "
					/>
				</div>
				<div className="basic-info-waiter">
					<label for="waiter">Waiter: </label>

					<select
						name="waiter"
						onChange={(e) => setWaiter(e.target.value)}
					>
						<option value={null}>null</option>
						{s.user.waiter.map((w) => {
							return w.name === waiter ? (
								<>
									<option value={w.name} selected>
										{w.name}
									</option>
								</>
							) : (
								<>
									<option value={w.name}>{w.name}</option>
								</>
							);
						})}
					</select>
				</div>
				<div className="basic-info-select">
					<p>
						<AccessTimeIcon />
						Check In Time:{" "}
						<strong>
							{location.state
								? new Date(
										location.state.e.time
								  ).toLocaleTimeString()
								: null}
						</strong>
					</p>
				</div>
			</div>
			<div className="table-bill">
				<MaterialTable
					columns={columns}
					data={tableData}
					title={`Bill - ${type} ${tableParcelNumber}`}
					editable={{
						onRowAdd: (newRow) =>
							new Promise((resolve, reject) => {
								setTableData([...tableData, newRow]);
								resolve();
							}),
						onRowUpdate: (newRow, oldRow) =>
							new Promise((resolve, reject) => {
								console.log(newRow, oldRow);
								const pro = { ...s.user };
								let flg = false;
								pro.stocks.forEach((e) => {
									if (e._id === newRow._id) {
										if (
											Number(e.stock) -
												Number(newRow.quantity) +
												Number(oldRow.quantity) >=
											0
										) {
											e.stock =
												Number(e.stock) -
												Number(newRow.quantity);
											s.changeUser(pro);
											const menu = [
												...s.user.menu,
												...s.user.stocks,
											];
											setMenuStockData(menu);
											console.log(s.user);
										} else {
											toast.warning(
												"You dont have Stock",
												{
													position:
														toast.POSITION
															.TOP_CENTER,
													autoClose: 2000,
												}
											);
											reject();
											flg = true;
										}
									}
								});
								if (flg) {
									return;
								} else {
									const updatedData = [...tableData];
									updatedData[oldRow.tableData.id] = newRow;
									updatedData[oldRow.tableData.id].amount =
										Number(
											updatedData[oldRow.tableData.id]
												.quantity
										) *
										Number(
											updatedData[oldRow.tableData.id]
												.rate
										);
									setTableData(updatedData);
									resolve();
								}
							}),
						onRowDelete: (selectedData) =>
							new Promise((resolve, reject) => {
								console.log(selectedData);
								const pro = { ...s.user };
								pro.stocks.forEach((e) => {
									if (e._id === selectedData._id) {
										e.stock =
											Number(e.stock) +
											Number(selectedData.quantity);
									}
								});
								const updatedData = [...tableData];
								updatedData.splice(
									selectedData.tableData.id,
									1
								);
								setTableData(updatedData);
								resolve();
							}),
					}}
					actions={[
						{
							icon: () => <AddCircleSharpIcon />,
							tooltip: "Increase Quantity",
							onClick: (e, data) => {
								console.log(data);
								if (data.tableData === undefined) {
									return;
								}
								const updatedData = [...tableData];
								if (
									updatedData[data.tableData.id].quantity ===
									undefined
								) {
									return;
								}
								let flag = false;
								console.log("🔥");
								const pro = { ...s.user };
								pro.stocks.forEach((e) => {
									console.log("🔥");

									if (e._id === data._id) {
										if (Number(e.stock) > 0) {
											e.stock = Number(e.stock) - 1;
											console.log(e);
											s.changeUser(pro);
											const menu = [
												...s.user.menu,
												...s.user.stocks,
											];
											setMenuStockData(menu);
											console.log(s.user);
										} else {
											flag = true;
											toast.warning(
												"You dont have Stock",
												{
													position:
														toast.POSITION
															.TOP_CENTER,
													autoClose: 2000,
												}
											);
										}
									}
								});
								if (flag) {
									return;
								}
								updatedData[data.tableData.id].quantity =
									Number(
										updatedData[data.tableData.id].quantity
									) + 1;
								updatedData[data.tableData.id].amount =
									Number(
										updatedData[data.tableData.id].quantity
									) *
									Number(updatedData[data.tableData.id].rate);
								setTableData(updatedData);
							},
						},
						{
							icon: () => <IndeterminateCheckBoxSharpIcon />,
							tooltip: "Decrease Quantity",
							onClick: (e, data) => {
								if (data.tableData === undefined) {
									return;
								}
								const updatedData = [...tableData];
								if (
									updatedData[data.tableData.id].quantity ===
										0 ||
									updatedData[data.tableData.id].quantity ===
										undefined
								) {
									return;
								} else {
									const pro = { ...s.user };
									pro.stocks.forEach((e) => {
										if (e._id === data._id) {
											e.stock = Number(e.stock) + 1;
											s.changeUser(pro);
											const menu = [
												...s.user.menu,
												...s.user.stocks,
											];
											setMenuStockData(menu);
										}
									});

									updatedData[data.tableData.id].quantity =
										Number(
											updatedData[data.tableData.id]
												.quantity
										) - 1;
									updatedData[data.tableData.id].amount =
										Number(
											updatedData[data.tableData.id]
												.quantity
										) *
										Number(
											updatedData[data.tableData.id].rate
										);
									setTableData(updatedData);
								}
							},
						},
						{
							icon: () => <RestaurantMenuIcon />,
							tooltip: "Open Menu",
							onClick: () => setModelOpenClose(true),
							isFreeAction: true,
						},
					]}
					options={{
						sorting: false,
						search: false,
						paging: false,
						actionsColumnIndex: -1,
						// selection: true,
						// showSelectAllCheckbox: false,
						// showTextRowsSelected: false,
						rowStyle: (data, index) =>
							index % 2 === 0 ? { background: "#f5f5f5" } : null,
					}}
					// onSelectionChange={(selectedData) =>
					// 	console.log(selectedData)
					// }
				/>
				<div
					className="total-div"
					style={{
						backgroundColor:
							tableData.length % 2 === 0 ? "#f5f5f5" : "white",
					}}
				>
					<hr />
					<hr />
					<hr />
					<p>
						Total Amount: ₹{" "}
						{tableData.reduce((prv, curr) => {
							return prv + Number(curr.amount);
						}, 0)}{" "}
					</p>
				</div>
			</div>
			<Modal
				open={modelOpenClose}
				onClose={() => {
					setSearchDish("");
					setSearchCode("");
					setModelOpenClose(false);
				}}
				center
			>
				<div className="menu-search">
					<div className="search">
						<div className="icon-search">
							<SearchOutlinedIcon />
						</div>
						<input
							type="text"
							placeholder="Type here"
							className="search-dish"
							onChange={(e) => {
								setSearchDish(e.target.value);
								setSearchCode("");
							}}
							value={searchDish}
						/>
						<input
							type="number"
							placeholder="Dish code"
							className="search-code"
							onChange={(e) => {
								setSearchCode(e.target.value);
								console.log(e.target.value);
								setSearchDish("");
							}}
							value={searchCode}
						/>
						<button
							className="clear-btn"
							onClick={() => {
								setSearchDish("");
								setSearchCode("");
							}}
						>
							Clear
							<ClearAllOutlinedIcon />
						</button>
					</div>
					<div className="search-result">
						{result.map((menu) => {
							return (
								<>
									<div className="result">
										{menu.stock ||
										Number(menu.stock) === 0 ? (
											<>
												<p>Name: {menu.name}</p>
												<p>नाम: {menu.hindiName}</p>
												<p>Rate: {menu.rate} ₹</p>
												<p>Code: {menu.code}</p>
												<p>
													Stock:{" "}
													{Number(menu.stock) === 0
														? 0
														: menu.stock}
												</p>
												<p>
													Category:&nbsp;
													<section>
														{menu.category}
													</section>
												</p>
											</>
										) : (
											<>
												<p>Name: {menu.name}</p>
												<p>नाम: {menu.hindiName}</p>
												<p>Rate: {menu.rate} ₹</p>
												<p>Code: {menu.code}</p>
												<p>
													Category:&nbsp;
													<section>
														{menu.category}
													</section>
												</p>
											</>
										)}

										<button
											className="menu-btn"
											onClick={() => {
												const data = {
													...menu,
													quantity: 1,
													amount: menu.rate,
												};

												let flag = false;
												tableData.forEach((e) => {
													if (e._id === menu._id) {
														flag = true;
													}
												});
												if (flag) {
													toast.warning(
														"You alrady have this data",
														{
															position:
																toast.POSITION
																	.TOP_CENTER,
															autoClose: 2000,
														}
													);
												} else {
													let x = false;
													if (menu.stock) {
														const d = [
															...s.user.stocks,
														];
														d.forEach((e) => {
															// console.log(
															// 	"🔥🔥🔥"
															// );
															if (
																e._id ===
																menu._id
															) {
																if (
																	Number(
																		e.stock
																	) > 0
																) {
																	console.log(
																		e
																	);
																	e.stock =
																		Number(
																			e.stock
																		) - 1;
																	x = true;
																	const pro =
																		{
																			...s.user,
																		};
																	pro.stocks =
																		d;
																	s.changeUser(
																		pro
																	);
																	const menu =
																		[
																			...s
																				.user
																				.menu,
																			...s
																				.user
																				.stocks,
																		];
																	setMenuStockData(
																		menu
																	);
																}
															}
														});
													}

													if (
														menu.stock === 0 &&
														x === false
													) {
														toast.warning(
															"You dont have Stock",
															{
																position:
																	toast
																		.POSITION
																		.TOP_CENTER,
																autoClose: 2000,
															}
														);
														return;
													}
													setTableData([
														...tableData,
														data,
													]);
													toast.success(
														`${data.name} is added`,
														{
															position:
																toast.POSITION
																	.TOP_CENTER,
															autoClose: 1000,
														}
													);
												}
												// console.log(menu);
											}}
										>
											<AddTaskOutlinedIcon />
										</button>
									</div>
								</>
							);
						})}
					</div>
				</div>
			</Modal>

			{/* ------------------------------------------------------------------------------------------------------------ */}
			<Modal open={KOTOpenClose} onClose={() => setKOTOpenClose(false)}>
				<div className="kot-print">
					<MaterialTable
						columns={columns}
						data={KotTableData}
						title={`KOT - ${type} ${tableParcelNumber}`}
						options={{
							sorting: false,
							search: false,
							paging: false,
							actionsColumnIndex: -1,

							rowStyle: (data, index) =>
								index % 2 === 0
									? { background: "#f5f5f5" }
									: null,
						}}
						editable={{
							onRowUpdate: (newRow, oldRow) =>
								new Promise((resolve, reject) => {
									const updatedData = [...KotTableData];
									updatedData[oldRow.tableData.id] = newRow;
									updatedData[oldRow.tableData.id].amount =
										Number(
											updatedData[oldRow.tableData.id]
												.quantity
										) *
										Number(
											updatedData[oldRow.tableData.id]
												.rate
										);
									setKotTableData(updatedData);
									resolve();
								}),
							onRowDelete: (selectedData) =>
								new Promise((resolve, reject) => {
									const updatedData = [...KotTableData];
									updatedData.splice(
										selectedData.tableData.id,
										1
									);
									setKotTableData(updatedData);
									resolve();
								}),
						}}
						actions={[
							{
								icon: () => <AddCircleSharpIcon />,
								tooltip: "Increase Quantity",
								onClick: (e, data) => {
									if (data.tableData === undefined) {
										return;
									}
									const updatedData = [...KotTableData];
									if (
										updatedData[data.tableData.id]
											.quantity === undefined
									) {
										return;
									}
									updatedData[data.tableData.id].quantity =
										Number(
											updatedData[data.tableData.id]
												.quantity
										) + 1;
									updatedData[data.tableData.id].amount =
										Number(
											updatedData[data.tableData.id]
												.quantity
										) *
										Number(
											updatedData[data.tableData.id].rate
										);
									setKotTableData(updatedData);
								},
							},
							{
								icon: () => <IndeterminateCheckBoxSharpIcon />,
								tooltip: "Decrease Quantity",
								onClick: (e, data) => {
									if (data.tableData === undefined) {
										return;
									}
									const updatedData = [...KotTableData];
									if (
										updatedData[data.tableData.id]
											.quantity === 0 ||
										updatedData[data.tableData.id]
											.quantity === undefined
									) {
										return;
									} else {
										updatedData[
											data.tableData.id
										].quantity =
											Number(
												updatedData[data.tableData.id]
													.quantity
											) - 1;
										updatedData[data.tableData.id].amount =
											Number(
												updatedData[data.tableData.id]
													.quantity
											) *
											Number(
												updatedData[data.tableData.id]
													.rate
											);
										setKotTableData(updatedData);
									}
								},
							},
						]}
					/>
					<div className="model-btn">
						<button
							onClick={() => {
								const data = {
									waiter,
									tableParcelNumber,
									KotTableData,
									type,
								};
								history.push({
									pathname: "/kotbill",
									state: { data },
								});
							}}
						>
							{" "}
							<FastForwardIcon />
						</button>
					</div>
				</div>
			</Modal>
			<div className="status-inputs">
				<p>
					<strong>Status</strong>
				</p>
				<div>
					Pending:{" "}
					{status === "Pending" ? (
						<input
							type="radio"
							name="status"
							value="Pending"
							defaultChecked
							onChange={(e) => setStatus(e.target.value)}
						/>
					) : (
						<input
							type="radio"
							name="status"
							value="Pending"
							onChange={(e) => setStatus(e.target.value)}
						/>
					)}
				</div>
				<div>
					Running:
					{status === "Running" ? (
						<input
							type="radio"
							name="status"
							value="Running"
							defaultChecked
							onChange={(e) => setStatus(e.target.value)}
						/>
					) : (
						<input
							type="radio"
							name="status"
							value="Running"
							onChange={(e) => setStatus(e.target.value)}
						/>
					)}
				</div>
				<div>
					Bill In Process:{" "}
					{status === "Bill In Process" ? (
						<input
							type="radio"
							name="status"
							value="Bill In Process"
							defaultChecked
							onChange={(e) => setStatus(e.target.value)}
						/>
					) : (
						<input
							type="radio"
							name="status"
							value="Bill In Process"
							onChange={(e) => setStatus(e.target.value)}
						/>
					)}
				</div>
				<div>
					Complete:
					{status === "Complete" ? (
						<input
							type="radio"
							name="status"
							value="Complete"
							defaultChecked
							onChange={(e) => setStatus(e.target.value)}
						/>
					) : (
						<input
							type="radio"
							name="status"
							value="Complete"
							onChange={(e) => {
								setStatus(e.target.value);
							}}
						/>
					)}
				</div>
			</div>
			<div className="status-inputs">
				<p>
					<strong>Payment Mode</strong>
				</p>
				<div>
					Cash:{" "}
					{paymentMode === "Cash" ? (
						<input
							type="radio"
							name="paymentMode"
							value="Cash"
							defaultChecked
							onChange={(e) => setPaymentMode(e.target.value)}
						/>
					) : (
						<input
							type="radio"
							name="paymentMode"
							value="Cash"
							onChange={(e) => setPaymentMode(e.target.value)}
						/>
					)}
				</div>
				<div>
					Card:
					{paymentMode === "Card" ? (
						<input
							type="radio"
							name="paymentMode"
							value="Card"
							defaultChecked
							onChange={(e) => setPaymentMode(e.target.value)}
						/>
					) : (
						<input
							type="radio"
							name="paymentMode"
							value="Card"
							onChange={(e) => setPaymentMode(e.target.value)}
						/>
					)}
				</div>
				<div>
					Pending:
					{paymentMode === "Pending" ? (
						<input
							type="radio"
							name="paymentMode"
							value="Pending"
							defaultChecked
							onChange={(e) => setPaymentMode(e.target.value)}
						/>
					) : (
						<input
							type="radio"
							name="paymentMode"
							value="Pending"
							onChange={(e) => setPaymentMode(e.target.value)}
						/>
					)}
				</div>
				<div>
					UPI:{" "}
					{paymentMode === "UPI" ? (
						<input
							type="radio"
							name="paymentMode"
							value="UPI"
							defaultChecked
							onChange={(e) => setPaymentMode(e.target.value)}
						/>
					) : (
						<input
							type="radio"
							name="paymentMode"
							value="UPI"
							onChange={(e) => setPaymentMode(e.target.value)}
						/>
					)}
				</div>
				<div>
					MIX:
					{paymentMode === "MIX" ? (
						<input
							type="radio"
							name="paymentMode"
							value="MIX"
							defaultChecked
							onChange={(e) => setPaymentMode(e.target.value)}
						/>
					) : (
						<input
							type="radio"
							name="paymentMode"
							value="MIX"
							onChange={(e) => setPaymentMode(e.target.value)}
						/>
					)}
				</div>
			</div>
			<div className="print-kot-modal">
				<button
					onClick={() => {
						setKOTOpenClose(true);
						setKotTableData(tableData);
					}}
				>
					KOT
				</button>
				<button
					onClick={() => {
						if (status !== "Bill In Process") {
							return toast.warn("Bill is not in Process", {
								position: toast.POSITION.TOP_CENTER,
								autoClose: 5000,
							});
						}
						const time = location.state.e.time;
						const totalAmount = tableData.reduce((prv, curr) => {
							return prv + Number(curr.amount);
						}, 0);
						const data = {
							waiter,
							tableParcelNumber,
							tableData,
							type,
							time,
							totalAmount,
						};
						const profile = { ...s.user };
						tableParcelBills(profile)
							.then((d) => {
								s.changeUser(d);
								console.log(d);
								history.push({
									pathname: "/printBill",
									state: { data },
								});
							})
							.catch((e) => {
								console.log(e);
							});
						console.log(data);
					}}
				>
					PRINT BILL
				</button>
			</div>
		</>
	);
};

export default TableParcelBill;
