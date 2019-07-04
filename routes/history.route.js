const { Router } = require('express');
const historyController = require('../controllers/history.controller');

const router = Router();

router.get('/', historyController.getHistory);
router.post('/', historyController.addToHistory);

module.exports = router;