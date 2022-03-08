import React, { useRef, useContext, useEffect } from "react";
import { useLocation, useHistory } from "react-router-dom";
import userContext from "../context/userContext";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

import { useReactToPrint } from "react-to-print";
import "../CSS/KOTBill.css";

const ComponentToPrint = React.forwardRef((props, ref) => {
	console.log(props);
	return (
		<>
			<div className="table-kot" ref={ref}>
				<div className="table-info">
					<h1>Umang Garden</h1>
					<h1>K.O.T</h1>
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
					</tr>
					{props.data.KotTableData.map((ele) => {
						return (
							<>
								<tr>
									<td>{ele.name}</td>
									<td>{ele.hindiName}</td>
									<td>{ele.quantity}</td>
								</tr>
							</>
						);
					})}
				</table>
				<hr />
				<hr />
			</div>
		</>
	);
});

const KOTBill = () => {
	const componentRef = useRef();
	const location = useLocation();
	const s = useContext(userContext);
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
					data={location.state.data}
				/>
			</div>
			<button onClick={handlePrint} className="print-btn" >Print this out!</button>
		</>
	);
};

export default KOTBill;
