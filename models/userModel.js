const mong = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = mong.Schema({
    email: { type: String, required: true },
    password: { type: String, required: true },
    role: { type: String, default: 'member' }
});

userSchema.methods.checkPassword = async function (guess) {
    let isOk = await bcrypt.compare(guess, this.password);
    return isOk;
}

userSchema.pre('save', async function () {
    let hashedPassword = await bcrypt.hash(this.password, 10);
    this.password = hashedPassword;
})

const userModel = mong.model('User', userSchema);

module.exports = userModel;