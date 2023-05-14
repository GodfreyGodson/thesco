
const { genSalt } = require('bcryptjs');
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const jwt = require('jsonwebtoken');

exports.registerUser = async (req, res)=>{

//checking if user is already in the database
const emailExist = await User.findOne({email: req.body.email});
if(emailExist) return res.status(400).send({error: 'Email Already Exists'});


//Hash Password
const salt = await bcrypt.genSalt(10);
const hashedPassword = await bcrypt.hash(req.body.password, salt);

//creating a new user
 const user = new User({

    name: req.body.name,
    email:req.body.email,
    password:hashedPassword,
    userType:req.body.userType

 });

 try{

    const savedUser = await user.save();
    //{user: user._id}
    res.send(savedUser);

 }
 catch(err){

    res.status(400).send(err);

 }
};


exports.userLogin = async (req, res) =>{

//checking if email exists 
const user = await User.findOne({email: req.body.email});
if(!user) return  res.status(400).json({ error: 'Email or password is incorrect' });

//password is correct
const validPassword = await bcrypt.compare(req.body.password, user.password);
if(!validPassword) return res.status(400).json({ error: 'Email or password is incorrect' });


//create and Assign Token
   // Create a token
   const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRETE, {
      expiresIn: '45m'
    });
    // Send the token and user information as a response
    res.json({
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        userType: user.userType
      }});
//res.header('auth-token', token).send({user: user, token: token});

//res.send('Success Logged In');
};



exports.updateUserPaidStatus = async (req, res) => {
   try {
     const { userId } = req.params;
     const { isPaid } = req.body;
     const user = await User.findByIdAndUpdate(userId, { isPaid }, { new: true });
     if (!user) {
       return res.status(404).send('User not found');
     }
     res.send(user);
   } catch (error) {
     res.status(400).send(error.message);
   }
 };