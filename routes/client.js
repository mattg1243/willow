const router = require('express').Router();
const connectEnsureLogin = require('connect-ensure-login');
const handlers = require('./handlers/clientHandlers');

router.get("/:id", connectEnsureLogin.ensureLoggedIn(), (req, res) => { handlers.renderClientPage(req, res) });

module.exports = router;