const express = require("express");
const User = require("../models/user");
const Bill = require("../models/bills");
const auth = require("../middleware/auth");
const router = new express.Router();

router.post("/users", async (req, res) => {
	const user = new User(req.body);
	try {
		await user.save();
		const token = await user.generateAuthToken();
		const bill = new Bill({
			discription: `hello from ${user.name}`,
			owner: user._id,
		});
		await bill.save();
		res.status(201).send({ user, token });
	} catch (error) {
		res.status(400).send(error);
	}
});

router.post("/users/login", async (req, res) => {
	try {
		const user = await User.findByCredentials(
			req.body.email,
			req.body.password
		);
		const token = await user.generateAuthToken();
		res.send({ user, token });
	} catch (e) {
		res.status(400).send();
	}
});

router.post("/users/logout", auth, async (req, res) => {
	try {
		req.user.tokens = req.user.tokens.filter((token) => {
			return token.token != req.token;
		});
		await req.user.save();
		res.send();
	} catch (error) {
		res.status(500).send();
	}
});

router.post("/users/logoutAll", auth, async (req, res) => {
	try {
		req.user.tokens = [];
		await req.user.save();
		res.send();
	} catch (error) {
		res.status(500).send();
	}
});

router.get("/users/me", auth, async (req, res) => {
	res.send(req.user);
});

router.patch("/users/me", auth, async (req, res) => {
	const updates = Object.keys(req.body);
	const allowedUpdates = [
		"name",
		"email",
		"password",
		"waiter",
		"menu",
		"parcel",
		"table",
		"bills",
		"stocks",
	];
	const isValid = updates.every((update) => {
		return allowedUpdates.includes(update);
	});
	if (!isValid) {
		return res.status(400).send({ error: "Invalid Update" });
	}
	try {
		updates.forEach((update) => {
			req.user[update] = req.body[update];
		});
		await req.user.save();
		res.send(req.user);
	} catch (error) {
		res.status(400).send(error);
	}
});

router.patch("/users/me/menu", auth, async (req, res) => {
	const updates = Object.keys(req.body);
	const allowedUpdates = ["menu"];
	const isValid = updates.every((update) => {
		return allowedUpdates.includes(update);
	});
	if (!isValid) {
		return res.status(400).send({ error: "Invalid Update" });
	}
	try {
		updates.forEach((update) => {
			req.user[update] = req.body[update];
		});
		await req.user.save();
		res.send(req.user);
	} catch (error) {
		res.status(400).send(error);
	}
});

router.post("/users/bills", auth, async (req, res) => {
	const date = new Date(req.body.date).getDate();
	const month = new Date(req.body.date).getMonth();
	const year = new Date(req.body.date).getFullYear();
	try {
		const bls = await Bill.findOne({ owner: req.user._id });
		const data = bls.bills.filter((e) => {
			return (
				new Date(e.time).getDate() === date &&
				new Date(e.time).getMonth() === month &&
				new Date(e.time).getFullYear() === year
			);
		});
		data.forEach((e) => {
			e.time = new Date(e.time).toLocaleString();
			if (e.parcelNumber) {
				e.number = e.parcelNumber;
			}
			if (e.tableNumber) {
				e.number = e.tableNumber;
			}
		});
		// console.log(data);
		res.send(data);
	} catch (error) {
		console.log();
		res.status(500).send(error);
	}
});
router.patch("/users/bills", auth, async (req, res) => {
	const bill = req.body;
	try {
		let bls = await Bill.findOne({ owner: req.user._id });
		bls.bills.push(bill);
		// bls.bills = b.bills;
		await bls.save();
		res.send(bls);
	} catch (error) {
		console.log(error);
		res.status(500).send(error);
	}
});

router.delete("/users/me", auth, async (req, res) => {
	try {
		await req.user.remove();
		res.send(req.user);
	} catch (error) {
		console.log();
		res.status(500).send(error);
	}
});

module.exports = router;
