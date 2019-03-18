const router = require('express').Router();
const { STTController } = require('../controllers')

const sttController = new STTController();

router.post('/getToken', (req, res) => {
    sttController.getToken(req, res);
})

module.exports = router;