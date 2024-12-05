const jwt = require('jsonwebtoken');
const { isTokenBlacklisted } = require('./blacklist');

const JWT_SECRET = 'your_jwt_secret_key';

const verifyToken = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1]; 

    if (!token) {
        return res.status(401).json({ message: 'No token provided, authorization denied' });
    }

    if(isTokenBlacklisted(token)){
        return res.status(401).json({message:'Token has been blacklisted, please login again'});
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).json({ message: 'Token is not valid', error: error.message });
    }
};
// const verifyToken = async (req, res, next) => {
//     const token = req.headers.authorization?.split(' ')[1];

//     if (!token) {
//         return res.status(401).json({ message: 'No token provided, authorization denied' });
//     }

//     try {
//         const decoded = jwt.verify(token, process.env.JWT_SECRET);
//         const user = await User.findById(decoded.id);

//         if (!user || !user.tokens.includes(token)) {
//             return res.status(401).json({ message: 'Invalid or expired token' });
//         }

//         req.user = decoded;
//         next();
//     } catch (error) {
//         res.status(401).json({ message: 'Token is not valid', error: error.message });
//     }
// };

module.exports = verifyToken;
