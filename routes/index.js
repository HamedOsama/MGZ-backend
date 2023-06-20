const { Router } = require('express');
const router = Router();

router.use('/stations', require('./api/stations.routes'));
router.use('/admin', require('./api/admin.routes'));

module.exports = router;