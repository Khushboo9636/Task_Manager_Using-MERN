const mongoose = require("mongoose")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

const userSchema =new mongoose.Schema(
    {
       name: {
            type: String,
            required: true,
            index: true,
            
        },
        email: {
            type: String,
            required: true,
            unique: true,

        },
        password: {
            type: String,
            required: [true, 'Password is required']
        },
    },
    {
        timestamps: true
    }
);

userSchema.virtual("confirmPassword")
.get(function() {
    return this._confirmPassword;
})
.set(function(value){
    this._confirmPassword = value;
});

userSchema.path("password").validate(function(value){
 if(this.isNew || this.isModified("password")) {
    if(!value|| value.length < 6){
        throw new Error("Password must be at least  characters long.");
    }
    if(this._confirmPassword !== undefined && this._confirmPassword !==value){
        throw new Error("Password do not match.");
    }
 }
 return true;
}, null);

userSchema.pre("save", async function (next) {
    if(this.isModified("password")){
        this.password = await bcrypt.hash(this.password,10);
    }
    next();
});
userSchema.methods.generateAuthToken  = function () {
    const token = jwt.sign(
        {
            _id: this._id,
            name: this.name,
            email: this.email,

        },
        process.env.JWT_SECRET_KEY,
        { expiresIn: '7d'}
    );
    return token;
};

const User = mongoose.model("User", userSchema)


module.exports = User;