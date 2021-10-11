const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        unique: true,
        required: true,
        trim: true,
        minLength: 3,
        maxLength: 20
    },
    email: {
        type: String,
        unique: true,
        required: true,
        trim: true,
        lowercase: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('Email is invalid');
            }
        }
    },
    password: {
        type: String,
        required: true,
        minLength: 8,
        maxLength: 100
    },
    permissions: {
        type: [String],
        required: true,
        enum: ['write', 'update', 'delete']
    },
    tokens: {
        type: [String]
    }
});

userSchema.methods.toJSON = function() {
    const user = this;
    const userObject = user.toObject();

    userObject.id = userObject._id;
    delete userObject._id;
    delete userObject.tokens;
    delete userObject.password;

    return userObject;
};

const User = mongoose.model('User', userSchema);

module.exports = User;