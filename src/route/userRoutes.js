const express = require('express');

const { registerUser, loginUser, updatedUser, logoutUser} = require('../controller/userController');
const { getAllUsers, getUserById } = require('../controller/getUserController');

const verifyToken = require('../middlewares/authmiddleware');

const router = express.Router();

router.post('/register', registerUser); 
router.post('/login', loginUser);

router.get('/profile', verifyToken, (req, res) => {
    res.json({ message: 'Welcome to the protected route', user: req.user });
});

router.put('/:id', updatedUser); 
router.get('/', getAllUsers); 
router.get('/:id', getUserById); 
router.post('/logout',logoutUser);
module.exports = router;
