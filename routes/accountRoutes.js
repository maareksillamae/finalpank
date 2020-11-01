const express = require('express');
const router = express.Router();
const Users = require('../models/User');
const bcrypt = require('bcrypt');
const Sessions = require('../models/Sessions');
const Accounts = require("../models/Account")
const { verifyToken } = require('../middlewares/middlewares');

// Get account details
router.get('/current-user-account', verifyToken, async (req, res) => {
    try {

        // Get a specific users session token
        const sessionId = req.headers.authorization.split(' ')[1]

        // Find a session with the provided Id
        const session = await Sessions.findOne({ _id:sessionId });

        const user = await Users.findOne({_id: session.userId}).select({ "name": 1, "username": 1, "password": 1, "_id": 0 });

        if (!user) {
            res.status(404).json({error: "User not found"})
        }

        const userAccount = await Accounts.findOne({user: session.userId}).select({ "accountNumber": 1, "balance": 1, "currency": 1, "user": 1, "_id": 0 });

        if (!userAccount) {
            res.status(404).json({error: "Account not found"})
        }
        console.log(userAccount.accountNumber);
        res.status(200).json({
            name: user.name,
            username: user.username,
            account: [{
                account_number: userAccount.accountNumber,
                balance: userAccount.balance,
                currency: userAccount.currency
            }]
        });

    } catch (err) {
        res.status(500).json({ error: "Oops! Something went wrong" });
        console.log(err.message);
    }
});
module.exports = router;