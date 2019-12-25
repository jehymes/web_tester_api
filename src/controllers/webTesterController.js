const express = require('express');
const authMiddleware = require('../middlewares/auth');

const router = express.Router();

router.use(authMiddleware);

router.get('/', async (req, res) => {
    res.status(200).send({ routerOn: true , status: "Ok", user: req.userId});
});

module.exports = app => app.use('/webTester', router);