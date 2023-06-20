const { Router } = require('express');

const adminController = require('../../controllers/admin.controller');
const { authAdmin } = require('../../middlewares/auth');

const router = Router();

//auth
router.route('/signup').post(adminController.signup);
router.route('/login').post(adminController.login);
router.route('/auth').get(authAdmin, adminController.auth);
router.route('/logout').get(authAdmin, adminController.logout);

//stats 
router.route('/stats').get(authAdmin, adminController.getStats);
// maintenance
router.route('/stations')
  .get(authAdmin, adminController.getAllStations)
  .post(authAdmin, adminController.addStation);
router.route('/stations/:id')
  .patch(authAdmin, adminController.updateStation)
  .delete(authAdmin, adminController.deleteStation);


module.exports = router;