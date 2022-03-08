import React, { useState } from "react";
import userContext from "./userContext";

const UserState = (props) => {
	const [user, setUser] = useState({
		name: "",
		email: "",
		menu: [],
		stocks: [],
		waiter: [],
		parcel: [],
		table: [],
		bills: [],
	});
	const changeUser = (data) => {
		setUser({
			name: data.name,
			email: data.email,
			menu: data.menu,
			waiter: data.waiter,
			parcel: data.parcel,
			table: data.table,
			bills: data.bills,
			stocks: data.stocks,
		});
	};

	return (
		<userContext.Provider
			value={{
				user,
				changeUser,
			}}
		>
			{props.children}
		</userContext.Provider>
	);
};

export default UserState;
