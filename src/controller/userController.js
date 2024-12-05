const User = require('../models/User');
const jwt = require('jsonwebtoken');
const {addToBlacklist} = require('../middlewares/blacklist');
const registerUser = async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({
            success: false,
            message: 'Please fill all fields',
        });
    }

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'User already exists',
            });
        }
        const user = new User({ name, email, password });
        await user.save();

        res.status(201).json({
            success: true,
            message: 'User registered successfully',
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
            },
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message,
        });
    }
};

const loginUser = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        const token = jwt.sign(
            { id: user._id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: '1h' } 
        );

        res.status(200).json({ message: 'Login successful', token });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const updatedUser = async (req,res)=>{
    try{
        const {id} = req.params;
        const updateData = req.body;
        const user = await User.findById(id);
        if(!user){
            return res.status(404).json({message: 'User not found'});
        }
        const updatedUser = await User.findByIdAndUpdate(id,updateData,{new:true,runValidators:true});
        res.status(200).json({message: 'User updated successfully', user: updatedUser});
        // const {name,email,password} = req.body;
    }catch(error){
        res.status(500).json({message: 'Server error', error: error.message});
    }
}


const logoutUser= async (req,res)=>{
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        return res.status(400).json({ success: false, message: 'No token provided' });
    }
    
    console.log('before add to black list',token);
    addToBlacklist(token);
    console.log('after add to black list',token);
    res.status(200).json({ success: true, message: 'Logged out successfully' });
}
// const logoutUser = async (req, res) => {
//     const token = req.headers.authorization?.split(' ')[1];
//     if (!token) {
//         return res.status(400).json({ success: false, message: 'No token provided' });
//     }

//     try {
//         const decoded = jwt.verify(token, process.env.JWT_SECRET);
//         const user = await User.findById(decoded.id);

//         if (!user) {
//             return res.status(401).json({ success: false, message: 'User not found' });
//         }

//         user.tokens = user.tokens.filter((t) => t !== token); // Remove the token
//         await user.save();

//         res.status(200).json({ success: true, message: 'Logged out successfully' });
//     } catch (error) {
//         res.status(500).json({ success: false, message: 'Server error', error: error.message });
//     }
// };
module.exports = { registerUser, loginUser, updatedUser,logoutUser };

