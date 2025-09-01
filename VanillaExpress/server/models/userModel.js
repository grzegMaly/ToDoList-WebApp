const {Schema, model} = require("mongoose");
const validator = require('validator');
const bcrypt = require('bcrypt');

const userSchema = new Schema({
    username: {
        type: String,
        required: [true, "Username is required"],
        trim: true,
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        trim: true,
        lowercase: true,
        validate: [validator.isEmail, "Email is not in valid format"]
    },
    password: {
        type: String,
        minLength: [12, "Password's length must be at least 12 characters"],
        select: false
    },
    passwordConfirm: {
        type: String,
        validate: {
            validator: function (el) {
                return el === this.password;
            },
            message: "Passwords don't match",
        }
    },
    accountNonLocked: {
        type: Boolean,
        default: true
    },
    accountNonExpired: {
        type: Boolean,
        default: true
    },
    credentialsNonExpired: {
        type: Boolean,
        default: true
    },
    enabled: {
        type: Boolean,
        default: true
    },
    credentialsExpiryDate: {
        type: Date,
        default: () => new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
    },
    accountExpiryDate: {
        type: Date,
        default: () => new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
    },
    loginMethod: {
        type: String,
        enum: ['email', 'github', 'google'],
        default: 'email'
    },
    roles: {
        type: [String],
        default: ["ROLE_USER"]
    }
}, {timestamps: true});

userSchema.index({email: 1}, {unique: true});
userSchema.index({username: 1});

userSchema.methods.correctPassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
}

userSchema.pre("save", async function (next) {
    if (this.isModified("password")) {
        this.password = await bcrypt.hash(this.password, 12);
        this.passwordConfirm = undefined;
    }
    next();
});

module.exports = model('users', userSchema);