const router = require("express").Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');

//Register
router.post("/register", async(req, res)=> {
    
    try {
        //Generating encrypted password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);
 
        //Creating new user
        const newUser = new User({
            username: req.body.username,
            email: req.body.email,
            password: hashedPassword,
        })

        //Saving new user and respond
        const user = await newUser.save();
        res.status(200).json(user)
    }catch(err){
        res.status(500).json(err);
    }
});


//Login 
router.post("/login", async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        if (!user) {
            return res.status(404).json("User not found");
        }

        const validPassword = await bcrypt.compare(req.body.password, user.password);
        if (!validPassword) {
            return res.status(400).json("Wrong password");
        }

        res.status(200).json(user);
    } catch (err) {
        res.status(500).json(err);
    }
});

    

module.exports = router;