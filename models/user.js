const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password:{

        type:String,
        required:true

    },
    userType: {
      type: String,
      enum: ['Student', 'Admin'],
      required: true,
    },
    
  },
  {

    timeStamps:true
});

//create model using the above schema
const User = mongoose.model("User", userSchema);

module.exports = User;