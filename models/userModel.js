const mong = require('mongoose');
const bcrypt = require('bcryptjs');
const schema = mong.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, default: "member" }
});

schema.pre('save', async function () {
    let hashedPassword = await bcrypt.hash(this.password, +process.env.SALT);
    this.password = hashedPassword;
});

schema.methods.checkPassword = async function (guess) {
    let isMatch = await bcrypt.compare(guess, this.password);
    return isMatch;
};

const User = mong.model('User', schema);

module.exports = User;