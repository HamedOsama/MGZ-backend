const { Router } = require('express');
const { getAllStations } = require('../../controllers/station.controller');

const router = Router();

router.get('/', getAllStations);

module.exports = router;