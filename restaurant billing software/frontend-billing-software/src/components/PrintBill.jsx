import React, { useRef, useContext, useEffect } from "react";
import { useLocation, useHistory } from "react-router-dom";
import userContext from "../context/userContext";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

import { useReactToPrint } from "react-to-print";
import "../CSS/PrintBill.css";

const ComponentToPrint = React.forwardRef((props, ref) => {
	console.log(props);
	return (
		<>
			<div className="table-kot" ref={ref}>
				<div className="table-info">
					<h1>Umang Garden</h1>
					<div>
						<h2>
							{props.data.type} {props.data.tableParcelNumber}
						</h2>
						<p>
							{" "}
							<strong>Waiter: </strong>
							{props.data.waiter}
						</p>
						<p>
							<strong>Time: </strong>{" "}
							{new Date().toLocaleString()}
						</p>
					</div>
				</div>
				<table>
					<tr>
						<th>Name</th>
						<th>नाम</th>
						<th>Quantity</th>
						<th>Rate</th>
						<th>Amount</th>
					</tr>
					{props.data.tableData.map((ele) => {
						return (
							<>
								<tr>
									<td>{ele.name}</td>
									<td>{ele.hindiName}</td>
									<td>{ele.quantity}</td>
									<td>₹ {ele.rate}</td>
									<td>₹ {ele.amount}</td>
								</tr>
							</>
						);
					})}
					<tr>
						<td> </td>
						<td> </td>
						<td> </td>
						<td> Total:</td>
						<td>₹ {props.data.totalAmount}</td>
					</tr>
				</table>
				<footer>
					<h4>आपण आलात आम्ही आपले आभारी आहोत.</h4>
				</footer>
				<hr />
				<hr />
			</div>
		</>
	);
});

const PrintBill = () => {
	const componentRef = useRef();
	const location = useLocation();
	const s = useContext(userContext);
	 const pageStyle="@page { size: 2.5in 4in }"
	 const history = useHistory();
	useEffect(() => {
		if (s.user.name === "") {
			history.push("/login");
		}
		if (location.state === undefined) {
			return;
		}
		// eslint-disable-next-line
	}, []);
	const handlePrint = useReactToPrint({
		content: () => componentRef.current,
	});
	console.log(location);
	return (
		<>
			<div className="go-back-button">
				<button onClick={() => history.goBack()}>
					{" "}
					<ArrowBackIcon /> Go Back
				</button>
			</div>
			<div className="head-kot">
				<h1>
					{location.state.data.type}{" "}
					{location.state.data.tableParcelNumber}
				</h1>
			</div>
			<div className="bill-table">
				<ComponentToPrint
					ref={componentRef}
					pageStyle={pageStyle}
					data={location.state.data}
				/>
			</div>
			<button
				onClick={handlePrint}
				className="print-btn"
			>
				Print this out!
			</button>
		</>
	);
};
        
export default PrintBill;
