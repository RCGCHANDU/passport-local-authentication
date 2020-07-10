const express = require('express');
const passport = require('passport');
const bcrypt = require('bcryptjs');
const User = require('../models/User')
const router = express.Router();

router.get('/login', (req, res) => {
    return res.render('login');
});

router.get('/register', (req, res) => {
    return res.render('register')
});


router.post('/register', (req, res) => {
    const { name, email, password, password2 } = req.body;
    let errors = [];

    if(!name || !email || !password || !password2){
        errors.push({message: 'Required fields need to be filled'})
    } 
    if(password !== password2) {
        errors.push({message: 'passwords are not matching'})
    }

    if(password.length < 6) {
        errors.push({ message: 'password must be atleast 6 characters' })
    }

    if(errors.length > 0) {
        res.render('register',{
            errors,
            name,
            email,
            password,
            password2
        });
    } else {
        // validation passed
        User.findOne({ email : email })
        .then(user => {
            if(user) {
                errors.push({ message: 'Email is already registered' })
                res.render('register',{
                    errors,
                    name,
                    email,
                    password,
                    password2
                })
            } else {
                const newUser = new User({
                    name,
                    email,
                    password
                })

                bcrypt.genSalt(10, (err, salt) => 
                    bcrypt.hash(newUser.password, salt, (err, hash) => {
                        if(err) throw err;
                        newUser.password = hash;
                        newUser.save()
                        .then(user => {
                            req.flash('success_msg', 'You are registered and can log in');
                            res.redirect('login');
                        })
                        .catch(err => console.log(err))
                    })
                )
            }
        })
    }
})

router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/dashboard',
        failureRedirect: '/users/login',
        failureFlash: true
    })(req, res, next);
});

router.get('/logout', (req, res) => {
    req.logOut();
    req.flash('success_msg', 'You are successfully logged out')
    res.redirect('/users/login');
})

module.exports = router;