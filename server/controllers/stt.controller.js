const { auth } = require('../config');

class STTController {

    getToken(req, res) {
        auth.getToken((err, token) => {
            if (!token) {
                res.status(500).send(err);
            } else {
                res.status(200).send({token: token});
            }
        })
    }
}

module.exports = STTController;