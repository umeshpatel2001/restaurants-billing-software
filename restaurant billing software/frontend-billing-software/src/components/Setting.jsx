import React, { useEffect, useContext, useState } from "react";
import { useHistory } from "react-router-dom";
import userContext from "../context/userContext";
import { Modal } from "react-responsive-modal";
import OpenInFullRoundedIcon from "@mui/icons-material/OpenInFullRounded";
import MaterialTable from "material-table";
import { css } from "@emotion/react";
import { ScaleLoader } from "react-spinners";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../CSS/Setting.css";
import SaveRoundedIcon from "@mui/icons-material/SaveRounded";
const override = css`
	position: absolute;
	margin-left: 48%;
`;

const Setting = () => {
	const s = useContext(userContext);
	const history = useHistory();
	const [waiter, setWaiter] = useState(false);
	const [menu, setMenu] = useState(false);
	const [bills, setBills] = useState(false);
	const [pendingOpenClose, setPendingOpenClose] = useState(false);
	const [menuData, setMenuData] = useState([]);
	const [loading, setLoading] = useState(false);
	const [waiterData, setWaiterData] = useState([]);
	const [inputDate, setInputDate] = useState("");
	const [billData, setBillData] = useState([]);
	const [foodItems, setFoodItems] = useState([]);
	const [pendingBills, setPendingBills] = useState([]);
	const [parcelAmount, setParcelAmount] = useState(0);
	const [tableAmount, setTableAmount] = useState(0);
	const [totalAmount, setTotalAmount] = useState(0);
	const [cashAmount, setCashAmount] = useState(0);
	const [cardAmount, setCardAmount] = useState(0);
	const [upiAmount, setUpiAmount] = useState(0);
	const [mixAmount, setMixAmount] = useState(0);
	const [stock, setStock] = useState([]);
	const [stockOpenClose, setStockOpenClose] = useState(false);
	useEffect(() => {
		if (s.user.name === "" || s.user.name === undefined) {
			history.push("/login");
		}
		setMenuData(s.user.menu);
		setWaiterData(s.user.waiter);
		setPendingBills(s.user.bills);
		setStock(s.user.stocks);
		// eslint-disable-next-line
	}, []);
	// console.log(s.user.stocks);
	const reduceFunction = (arr) => {
		return arr.reduce((prv, curr) => {
			return prv + Number(curr.totalAmount);
		}, 0);
	};
	useEffect(() => {
		const totalAmt = reduceFunction(billData);
		setTotalAmount(totalAmt);

		const parcelAmt = billData.filter((e) => {
			return e.billType === "Parcel";
		});
		setParcelAmount(reduceFunction(parcelAmt));

		const tableAmt = billData.filter((e) => {
			return e.billType === "Table";
		});
		setTableAmount(reduceFunction(tableAmt));

		const cashAmt = billData.filter((e) => {
			return e.paymentMode === "Cash";
		});
		setCashAmount(reduceFunction(cashAmt));

		const cardAmt = billData.filter((e) => {
			return e.paymentMode === "Card";
		});
		setCardAmount(reduceFunction(cardAmt));

		const upiAmt = billData.filter((e) => {
			return e.paymentMode === "UPI";
		});
		setUpiAmount(reduceFunction(upiAmt));

		const mixAmt = billData.filter((e) => {
			return e.paymentMode === "MIX";
		});
		setMixAmount(reduceFunction(mixAmt));
	}, [billData]);

	const addToBills = async () => {
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
				body: JSON.stringify({ date: inputDate }),
			};
			const response = await fetch(
				"http://localhost:4000/users/bills",
				requestOptions
			);
			const data = await response.json();
			setLoading(false);
			return data;
		} catch (error) {
			console.log(error);
			toast.error("Error...", {
				position: toast.POSITION.TOP_CENTER,
				autoClose: 5000,
			});
			setLoading(false);
			console.log(error);
		}
	};
	const addPendingToFinel = async (bill) => {
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
	// console.log(menuData);
	const columns = [
		{ title: "Name", field: "name" },
		{ title: "नाम", field: "hindiName" },
		{ title: "Category", field: "category" },
		{ title: "Code", field: "code" },
		{
			title: "Rate",
			field: "rate",
			type: "currency",
			currencySetting: { currencyCode: "INR", minimumFractionDigits: 0 },
		},
	];
	const waiterColumn = [
		{
			title: "Name",
			field: "name",
		},
	];
	const billColumn = [
		{
			title: "Bill Type",
			field: "billType",
		},
		{
			title: "Number",
			field: "number",
		},
		{
			title: "Time/Date",
			field: "time",
			grouping: false,
		},
		{
			title: "Waiter",
			field: "waiter",
		},
		{
			title: "Payment Mode",
			field: "paymentMode",
		},
		{
			title: "Amount",
			field: "totalAmount",
			type: "currency",
			grouping: false,
			currencySetting: { currencyCode: "INR", minimumFractionDigits: 0 },
		},
	];
	const penBills = [
		{
			title: "Bill Type",
			field: "billType",
			editable: "never",
		},
		{
			title: "Time/Date",
			field: "time",
			grouping: false,
			editable: "never",
		},
		{
			title: "Waiter",
			field: "waiter",
			editable: "never",
		},
		{
			title: "Discription",
			field: "discription",
		},
		{
			title: "Payment Mode",
			field: "paymentMode",
			editable: "never",
		},
		{
			title: "Amount",
			field: "totalAmount",
			type: "currency",
			editable: "never",
			grouping: false,
			currencySetting: { currencyCode: "INR", minimumFractionDigits: 0 },
		},
	];

	const stockCloumn = [
		{ title: "Name", field: "name" },
		{ title: "नाम", field: "hindiName" },
		{ title: "Category", field: "category" },
		{ title: "Code", field: "code" },
		{ title: "Stock", field: "stock" },
		{
			title: "Rate",
			field: "rate",
			type: "currency",
			currencySetting: { currencyCode: "INR", minimumFractionDigits: 0 },
		},
	];
	console.log(stock);
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
			<div className="setting">
				<div className="setting-buttons-div">
					<div className="menu-button">
						<button onClick={() => setMenu(true)}>
							Menu Setting
						</button>
					</div>
					<div className="waiter-button">
						<button onClick={() => setWaiter(true)}>
							Waiter Setting
						</button>
					</div>
					<div className="pending-button">
						<button
							onClick={() => {
								setPendingOpenClose(true);
							}}
						>
							See Pending Bills
						</button>
					</div>
					<div className="stock-button">
						<button
							onClick={() => {
								setStockOpenClose(true);
							}}
						>
							Stock Data
						</button>
					</div>
				</div>
				<hr />
				<div className="setting-body-div">
					<Modal
						open={menu}
						onClose={() => {
							setMenu(false);
						}}
					>
						<MaterialTable
							columns={columns}
							data={menuData}
							title="Menu"
							editable={{
								onRowAdd: (newRow) =>
									new Promise((resolve, reject) => {
										setMenuData([...menuData, newRow]);
										resolve();
									}),
								onRowUpdate: (newRow, oldRow) =>
									new Promise((resolve, reject) => {
										const updatedData = [...menuData];
										updatedData[oldRow.tableData.id] =
											newRow;
										updatedData[
											oldRow.tableData.id
										].amount =
											Number(
												updatedData[oldRow.tableData.id]
													.quantity
											) *
											Number(
												updatedData[oldRow.tableData.id]
													.rate
											);
										setMenuData(updatedData);
										resolve();
									}),
								onRowDelete: (selectedData) =>
									new Promise((resolve, reject) => {
										const updatedData = [...menuData];
										updatedData.splice(
											selectedData.tableData.id,
											1
										);
										setMenuData(updatedData);
										resolve();
									}),
							}}
							actions={[
								{
									icon: () => <SaveRoundedIcon />,
									tooltip: "Save Changes",
									isFreeAction: true,
									onClick: () => {
										const profileData = { ...s.user };
										profileData.menu = menuData;
										tableParcelBills(profileData)
											.then((data) => {
												// console.log(data);
												s.changeUser(data);
												toast.success(
													"Changes saved successfully ",
													{
														position:
															toast.POSITION
																.TOP_CENTER,
														autoClose: 5000,
													}
												);
											})
											.catch((e) => {
												toast.error("Error...", {
													position:
														toast.POSITION
															.TOP_CENTER,
													autoClose: 5000,
												});
												console.log(e);
											});
									},
								},
							]}
							options={{
								sorting: true,
								search: true,
								paging: true,
								actionsColumnIndex: -1,
								rowStyle: (data, index) =>
									index % 2 === 0
										? { background: "#f5f5f5" }
										: null,
							}}
						/>
					</Modal>
					<div className="waiter-model">
						<Modal open={waiter} onClose={() => setWaiter(false)}>
							<div className="waiter-table">
								<MaterialTable
									columns={waiterColumn}
									data={waiterData}
									title="Waiter"
									editable={{
										onRowAdd: (newRow) =>
											new Promise((resolve, reject) => {
												setWaiterData([
													...waiterData,
													newRow,
												]);
												resolve();
											}),
										onRowUpdate: (newRow, oldRow) =>
											new Promise((resolve, reject) => {
												const updatedData = [
													...waiterData,
												];
												updatedData[
													oldRow.tableData.id
												] = newRow;
												updatedData[
													oldRow.tableData.id
												].amount =
													Number(
														updatedData[
															oldRow.tableData.id
														].quantity
													) *
													Number(
														updatedData[
															oldRow.tableData.id
														].rate
													);
												setWaiterData(updatedData);
												resolve();
											}),
										onRowDelete: (selectedData) =>
											new Promise((resolve, reject) => {
												const updatedData = [
													...waiterData,
												];
												updatedData.splice(
													selectedData.tableData.id,
													1
												);
												console.log(updatedData);
												setWaiterData(updatedData);
												resolve();
											}),
									}}
									actions={[
										{
											icon: () => <SaveRoundedIcon />,
											tooltip: "Save Changes",
											isFreeAction: true,
											onClick: () => {
												const profileData = {
													...s.user,
												};
												profileData.waiter = waiterData;
												tableParcelBills(profileData)
													.then((data) => {
														console.log(data);
														s.changeUser(data);
														toast.success(
															"Changes saved successfully ",
															{
																position:
																	toast
																		.POSITION
																		.TOP_CENTER,
																autoClose: 5000,
															}
														);
													})
													.catch((e) => {
														toast.error(
															"Error...",
															{
																position:
																	toast
																		.POSITION
																		.TOP_CENTER,
																autoClose: 5000,
															}
														);
														console.log(e);
													});
											},
										},
									]}
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
								/>
							</div>
						</Modal>
					</div>

					<div className="history">
						<div className="input-bills">
							<p>Enter Date to get History : </p>
							<input
								type="date"
								placeholder="Enter Date"
								onChange={(e) => setInputDate(e.target.value)}
								value={inputDate}
							/>
							<button
								onClick={() => {
									addToBills()
										.then((data) => {
											console.log(data);
											setBillData(data);
										})
										.catch((e) => {
											console.log(e);
										});
								}}
							>
								Find{" "}
							</button>
						</div>
						<div className="info-bills">
							<div className="info-bills-amount">
								<p>Parcel Amount:₹ {parcelAmount} </p>
								<p>Table Amount: ₹ {tableAmount} </p>
								<p>Total Amount: ₹ {totalAmount} </p>
							</div>
							<div className="discription">
								out of total ₹ {cashAmount} from cash,₹{" "}
								{cardAmount} from card, ₹{upiAmount} from UPI
								and ₹ {mixAmount} from MIX
							</div>
						</div>
						<MaterialTable
							columns={billColumn}
							data={billData}
							title="Bills "
							actions={[
								{
									icon: () => <OpenInFullRoundedIcon />,
									tooltip: "Open Food Items",
									onClick: (e, data) => {
										setBills(true);
										setFoodItems(data.foodItem);
									},
								},
							]}
							options={{
								sorting: true,
								search: true,
								paging: false,
								grouping: true,
								actionsColumnIndex: -1,
								rowStyle: (data, index) =>
									index % 2 === 0
										? { background: "#f5f5f5" }
										: null,
							}}
						/>
						<Modal
							open={bills}
							onClose={() => {
								setBills(false);
							}}
						>
							<div className="food-item-table">
								<table>
									<tr>
										<th>Name</th>
										<th>नाम</th>
										<th>Quantity</th>
										<th>Rate</th>
										<th>Amount</th>
									</tr>
									{foodItems.map((e) => {
										return (
											<tr>
												<td>{e.name}</td>
												<td>{e.hindiName}</td>
												<td>{e.quantity}</td>
												<td>{e.rate}</td>
												<td>{e.amount}</td>
											</tr>
										);
									})}
								</table>
							</div>
						</Modal>
					</div>
					<Modal
						open={pendingOpenClose}
						onClose={() => {
							setPendingOpenClose(false);
						}}
					>
						<div className="pending-bills-table">
							<MaterialTable
								columns={penBills}
								data={pendingBills}
								title="Pending Bills"
								actions={[
									{
										icon: () => <OpenInFullRoundedIcon />,
										tooltip: "Open Food Items",
										onClick: (e, data) => {
											setBills(true);
											setFoodItems(data.foodItem);
										},
									},
								]}
								editable={{
									onRowUpdate: (newRow, oldRow) =>
										new Promise((resolve, reject) => {
											const updatedData = [
												...pendingBills,
											];
											updatedData[oldRow.tableData.id] =
												newRow;

											setPendingBills(updatedData);
											const profile = { ...s.user };
											profile.bills = updatedData;
											tableParcelBills(profile)
												.then((d) => {
													s.changeUser(d);
													console.log(d);
													resolve();
												})
												.catch((e) => {
													console.log(e);
												});
										}),
									onRowDelete: (selectedData) =>
										new Promise((resolve, reject) => {
											const updatedData = [
												...pendingBills,
											];
											updatedData.splice(
												selectedData.tableData.id,
												1
											);
											setPendingBills(updatedData);
											const profile = { ...s.user };
											profile.bills = updatedData;
											tableParcelBills(profile)
												.then((d) => {
													s.changeUser(d);
													addPendingToFinel(
														selectedData
													)
														.then((data) => {
															console.log(data);
															resolve();
														})
														.catch();
												})
												.catch((e) => {
													console.log(e);
												});
										}),
								}}
								options={{
									sorting: true,
									search: true,
									paging: false,
									actionsColumnIndex: -1,
									rowStyle: (data, index) =>
										index % 2 === 0
											? { background: "#f5f5f5" }
											: null,
								}}
							/>
						</div>
					</Modal>

					<Modal
						open={stockOpenClose}
						onClose={() => setStockOpenClose(false)}
					>
						<div className="pending-bills-table">
							<MaterialTable
								columns={stockCloumn}
								data={stock}
								title="Stock Management"
								editable={{
									onRowAdd: (newRow) =>
										new Promise((resolve, reject) => {
											// console.log(newRow);
											setStock([...stock, newRow]);
											// console.log(stock);
											// console.log("hiiiiiiiii");
											resolve();
										}),
									onRowUpdate: (newRow, oldRow) =>
										new Promise((resolve, reject) => {
											const updatedData = [...stock];
											updatedData[oldRow.tableData.id] =
												newRow;

											setStock(updatedData);
											resolve();
										}),
									onRowDelete: (selectedData) =>
										new Promise((resolve, reject) => {
											const updatedData = [...stock];
											updatedData.splice(
												selectedData.tableData.id,
												1
											);
											setStock(updatedData);
											resolve();
										}),
								}}
								actions={[
									{
										icon: () => <SaveRoundedIcon />,
										tooltip: "Save Changes",
										isFreeAction: true,
										onClick: () => {
											const profileData = { ...s.user };
											profileData.stocks = stock;
											tableParcelBills(profileData)
												.then((data) => {
													console.log(data);
													s.changeUser(data);
													toast.success(
														"Changes saved successfully ",
														{
															position:
																toast.POSITION
																	.TOP_CENTER,
															autoClose: 5000,
														}
													);
												})
												.catch((e) => {
													toast.error("Error...", {
														position:
															toast.POSITION
																.TOP_CENTER,
														autoClose: 5000,
													});
													console.log(e);
												});
										},
									},
								]}
								options={{
									sorting: true,
									search: true,
									paging: true,
									actionsColumnIndex: -1,
									rowStyle: (data, index) =>
										index % 2 === 0
											? { background: "#f5f5f5" }
											: null,
								}}
							/>
						</div>
					</Modal>
				</div>
			</div>
		</>
	);
};

export default Setting;
