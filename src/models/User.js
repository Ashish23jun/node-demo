// const mongoose = require('mongoose');
// const bcrypt = require('bcrypt');
// const UserSchema = new mongoose.Schema({
//     name:{type: String, required: true},
//     email:{type: String, required: true},
//     password:{type: String, required: true}
// }, {timestamps : true});

// UserSchema.pre('save', async function(next){
//     const user = this;
//     if(!user.isModified('password')){
//         return next();
//     }
//     user.password = await bcrypt.hash(user.password, 10);
// });
// module.exports = mongoose.model('User', UserSchema);



const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true }, 
    password: { type: String, required: true }
}, { timestamps: true });
UserSchema.pre('save', async function (next) {
    const user = this;

    if (!user.isModified('password')) {
        return next();
    }

    try {
        user.password = await bcrypt.hash(user.password, 10);
        next();
    } catch (error) {
        next(error); 
    }
});

module.exports = mongoose.model('User', UserSchema);
