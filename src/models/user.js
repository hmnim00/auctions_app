const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String },
  email: { type: String, required: true, email: true, unique: true },
  password: { type: String, required: true },
  joined: { type: Date, default: () => Date.now() }
});

userSchema.methods.encryptPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);
  return hash;
};

userSchema.methods.matchPassword = async function (password) {
  return await bcrypt.compare(password, this.password);
}

module.exports = mongoose.model('User', userSchema);