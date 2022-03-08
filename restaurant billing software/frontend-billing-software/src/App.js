import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./components/Home";
import Login from "./components/Login";
import UserState from "./context/UserState";
import TableParcelBill from "./components/TableParcelBill";
import KOTBill from "./components/KOTBill";
import PrintBill from "./components/PrintBill";
import Setting from "./components/Setting";
import Footer from "./components/Footer";

function App() {
	return (
		<UserState>
			<Router>
				<div>
					<Navbar />
					<Switch>
						<Route path="/login">
							<Login />
						</Route>
						<Route path="/tableParcelBill">
							<TableParcelBill />
						</Route>
						<Route path="/kotbill">
							<KOTBill />
						</Route>
						<Route path="/printBill">
							<PrintBill />
						</Route>
						<Route path="/setting">
							<Setting />
						</Route>
						<Route path="/">
							<Home />
						</Route>
					</Switch>
					<Footer />
				</div>
			</Router>
		</UserState>
	);
}
export default App;
