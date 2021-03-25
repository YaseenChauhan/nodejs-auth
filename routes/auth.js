const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth');
const userController = require('../controllers/user');

router.post('/signup', authController.signUp);
router.post('/login', authController.login);

router.get('/getUsers', authController.authenticate, userController.allowIfLoggedIn, userController.grantAccess('readAny', 'profile'), userController.getUsers);

router.get('/getUser/:userId', authController.authenticate, userController.allowIfLoggedIn, userController.getUser);
  
router.put('/updateUser/:userId', authController.authenticate, userController.allowIfLoggedIn, userController.grantAccess('updateOwn', 'profile'), userController.updateUser);
 
router.delete('/deleteUser/:userId', authController.authenticate, userController.allowIfLoggedIn, userController.grantAccess('deleteAny', 'profile'), userController.deleteUser);

module.exports = router;