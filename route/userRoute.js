const express = require("express");
const router = express.Router();
const controller = require("../controller/userController");
const isAuth = require("../middleware/is-auth");

router.get('/login', controller.login);
router.post('/signup', controller.signUp);

router.get('/status', isAuth, controller.getStatus);
router.post('/status', isAuth, controller.setStatus);

module.exports = router;