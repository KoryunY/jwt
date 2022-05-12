const jwt = require('jsonwebtoken');

const User = require('../model/userSchema');

exports.login = async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    try {
        const user = await User.findOne({ username: username });
        if (!user) {
            res.status(401).json({ err: "A user with this email could not be found." });
        }
        if (user.password !== password)
            res.status(401).json('Wrong password')
        const token = jwt.sign(
            {
                username: user.username,
                userId: user._id.toString()
            },
            'somereallylongandunpredictabletext',
            { expiresIn: 120 }
        );
        res.status(200).json({ token: token, userId: user._id.toString() });
    }
    catch (err) { res(500).json({ err: err.message }); }
}

exports.signUp = async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    try {
        const user = new User({
            username: username,
            password: password
        });
        const result = await user.save();
        res.status(201).json({ message: 'User created!', userId: result._id });
    } catch (err) {
        res.status(500).json(err);
    }
}

exports.getStatus = async (req, res) => {
    const userId = req.userId;
    try {
        const user = await User.findById(userId);
        res.status(200).json({ status: user.status });
    } catch (err) {
        res.status(500).json({ errMessage: err.message });
    }
}
exports.setStatus = async (req, res) => {
    const status = req.body.status;
    const userId = req.userId;
    try {
        await User.findByIdAndUpdate(userId, { "status": status });
        res.status(200).json({ status: status });
    } catch (err) {
        res.status(500).json({ errMessage: err.message });
    }
}