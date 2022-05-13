require('dotenv').config();

const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../model/userSchema');

exports.login = async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    try {
        const user = await User.findOne({ username: username });
        if (!user) {
            res.status(401).json({ err: "A user with this username could not be found." });
        }
        const comparePass = await bcrypt.compare(password, user.password);
        if (!comparePass)
            res.status(401).json('Wrong password')
        const token = jwt.sign(
            {
                username: user.username,
                userId: user._id.toString()
            },
            process.env.SECRET_KEY,
            { expiresIn: +process.env.EXPIRES_IN }
        );
        res.status(200).json({ token: token, userId: user._id.toString() });
    }
    catch (err) { res(500).json({ errMessage: err.message }); }
}

exports.signUp = async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPass = await bcrypt.hash(password, salt);
        const user = new User({
            username: username,
            password: hashedPass
        });
        const result = await user.save();
        res.status(201).json({ message: 'User created!', userId: result._id });
    } catch (err) {
        res.status(500).json({ errMessage: err.message });
    }
}

exports.getStatus = async (req, res) => {
    const userId = req.userId;
    try {
        const { status } = await User.findById(userId);
        res.status(200).json({ status });
    } catch (err) {
        res.status(500).json({ errMessage: err.message });
    }
}
exports.setStatus = async (req, res) => {
    const status = req.body.status;
    const userId = req.userId;
    try {
        await User.findByIdAndUpdate(userId, { status });
        res.status(200).json({ status });
    } catch (err) {
        res.status(500).json({ errMessage: err.message });
    }
}