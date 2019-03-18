const { assistant } = require('../config');

class AssistantController {

    postMessage(body, res) {
        const payload = {
            workspace_id: process.env.ASSISTANT_WORKSPACE_ID,
            input: { 
                text: String(body.message),
            },
            context: body.context,
        }
		
        assistant.message(payload, (err, response) => {
            if (err) {
                res.status(500).send(err);
            }
            else {
                res.status(200).send(response);
            }
        });
    }
}

module.exports = AssistantController;
