const { Router } = require("express");
const { User } = require("./models/User");
const bcrypt = require("bcryptjs");
const authMiddleware = require("../middleware/authMiddleware");
const {secret} = require("../config/config");
const jwt = require("jsonwebtoken");

const router = Router();

router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res
                .status(400)
                .json({ error: { message: `User doesn't exist` } });
        }

        const isMatchPass = await bcrypt.compare(password, user.password);

        if (!isMatchPass) {
            return res
                .status(400)
                .json({
                    error: { message: `Wrong password or email` },
                });
        }

        //const token = jwt.sign({id: user._id, type: user.type}, secret, { expiresIn: "30d" });

        return res.status(201).json({
            user: {
                id: user._id,
                name: user.username,
                email: user.email,

            }
        });

    } catch (e) {
        return res.status(500).json({ error: { message: `Server error` } });
    }
});

router.post("/register", async (req, res) => {
    try {
        console.log("body", req.body)
        const { name, email, password, } = req.body;

        const candidate = await User.findOne({ email });
        console.log("candidate", candidate)
        if (candidate) {
            return res
                .status(400)
                .json({ error: { message: `User already exists` } });
        }

        const hashPassword = bcrypt.hashSync(password, 7);

        const user = new User({
            name,
            email,
            password: hashPassword,
        });

        await user.save();

        //const token = jwt.sign({id: user._id}, secret, { expiresIn: "30d" });

        return res.status(201).json({
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
            },
        });
    } catch (e) {
        console.error(e);
        return res.status(500).json({ error: { message: `Server error` } });
    }
});

router.get(`/newToken`, authMiddleware, async (req, res) => {
    try {
        const createdAtToken = Date.now();

        const token = jwt.sign({id: req.user.id}, secret, { expiresIn: "30d" });

        await User.updateOne(
            { _id: req.user.id },
        )

        return res.status(201).json({ token });
    } catch (e) {
        return res
            .status(500)
            .json({ errors: [{ message: `Server error` }] });
    }
});

module.exports = { authRouter: router };