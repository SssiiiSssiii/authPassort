const mongoose = require('mongoose');
const bcrypt = require('bcrypt');


const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});

userSchema.pre('save', async function () {
    let hashedPassword = await bcrypt.hash(this.password, +process.env.SALT);
    this.password = hashedPassword;
})

userSchema.methods.checkPassword = async function (guess) {
    let isMatch = await bcrypt.compare(guess, this.password);
    return isMatch;
}

const User = mongoose.model('User', userSchema);

module.exports = User;