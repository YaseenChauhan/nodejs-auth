const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth');
const userController = require('../controllers/user');
const passport = require('passport');
const tokenUtil = require('../utils/token');
const responseUtil = require('../utils/response');

router.post('/signup', authController.signUp);
router.post('/login', authController.login);



/* passport local
router.post('/login', function(req, res, next) {
    passport.authenticate('local', async function(err, user, info) {
      if (err) return responseUtil(res, false, "error while login", true, {error: err.message});

      if (!user) responseUtil(res, true, info.message, false, {});

      const access_token = await tokenUtil.generateAccessToken(user);
      return responseUtil(res, true, "login successfully", false, {email: user.email, role: user.role, access_token}); 


    })(req, res, next);
  });
  */




router.get('/getUsers', authController.authenticate, userController.allowIfLoggedIn, userController.grantAccess('readOwn', 'profile'), userController.getUsers);

router.get('/getUser/:userId', authController.authenticate, userController.allowIfLoggedIn, userController.getUser);
  
router.put('/updateUser/:userId', authController.authenticate, userController.allowIfLoggedIn, userController.grantAccess('updateOwn', 'profile'), userController.updateUser);
 
router.delete('/deleteUser/:userId', authController.authenticate, userController.allowIfLoggedIn, userController.grantAccess('deleteAny', 'profile'), userController.deleteUser);

module.exports = router;