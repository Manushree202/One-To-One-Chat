const mongoose= require("mongoose");
const bcrypt = require("bcryptjs");

const userModel=mongoose.Schema({
    name:{
        type: String,
        required:true,
    },
    email:{
        type: String,
        required:true,
        unique:true,
    },
    password:{
        type: String,
        required:true,
    },
},
{
    timestamps:true,
  }
);
//compares passwords
userModel.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

// Middleware to hash password before saving to the database
userModel.pre('save', async function (next) {
    // Hash the password only if it's modified (or new)
    if (!this.isModified) {
        next();
    }
        // Generate a salt to hash the password
        const salt = await bcrypt.genSalt(10); // 10 is the saltRounds
        // Hash the password with the salt
        this.password = await bcrypt.hash(this.password, salt);
});


const User =mongoose.model("User",userModel);
module.exports=User;