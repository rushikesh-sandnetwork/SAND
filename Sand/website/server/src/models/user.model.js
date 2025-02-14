const mongoose = require("mongoose");
const { Schema } = mongoose;
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken")
const userSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    surname: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    password: {
        type: String,
        required: [true, "Password is required"]
    },
    role: {
        type: String,
        required: true,
        enum: ['admin', 'mis', 'manager', 'subadmin'],
    },
    listOfCampaigns: {
        type: [Schema.Types.ObjectId],
        ref: "Campaign",
        default: [],
    },
    listOfClients: {
        type: [Schema.Types.ObjectId],
        ref: "Client",
        default: [],
    },
    refreshToken: {
        type: String
    },

}, {
    timestamps: true
});

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
      return next();
    }
  
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  });
  

userSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password)
}

userSchema.methods.generateAccessToken = function () {
    if (!process.env.ACCESS_TOKEN_SECRET || !process.env.ACCESS_TOKEN_EXPIRY) {
        throw new Error("ACCESS_TOKEN_SECRET and ACCESS_TOKEN_EXPIRY must be set in the environment variables.");
    }
    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
            name: this.name,
            role: this.role,
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    );
};

userSchema.methods.generateRefreshToken = function () {
    if (!process.env.REFRESH_TOKEN_SECRET || !process.env.REFRESH_TOKEN_EXPIRY) {
        throw new Error("REFRESH_TOKEN_SECRET and REFRESH_TOKEN_EXPIRY must be set in the environment variables.");
    }
    return jwt.sign(
        {
            _id: this._id,
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    );
};

module.exports = mongoose.model("users", userSchema)
