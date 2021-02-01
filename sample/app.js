const express = require('express');
const bcrypt = require('bcrypt')
const app = express();
const jwt = require('jsonwebtoken')
const nodemailer = require('nodemailer')
const { sequelize, users } = require('./models')
app.use(express.json())



app.post('/users', async (req, res) => {
    const { user_name, pass, email, phone_number } = req.body;
    var password = await bcrypt.hash(pass, 10)
    var subject = 'Your account is successfully created with ndx'
    var text = 'Hi Shubham from NDX , Your account is successfully created with NDX . now you can enjoy our trading services'
    let min = 111111;
    let max = 999999;
    try {
        console.log(getRndInteger(min, max));
        const result = await users.findOne({ where: { user_name: user_name } })
        if (result == null || result.isEmpty) {
            userData = await users.create({ user_name, password, email, phone_number })

            sendMail(email, subject, text)
            return res.json(userData)
        } else {
            return res.json({
                status: 'Success',
                message: 'User Already Exists',
                statuscode: 201
            })
        }
    } catch (err) {
        console.log(err)
        return res.status(500).json(err)
    }

})

app.post('/users/login', async (req, res) => {
    const { user_name, pass } = req.body
    const { userdetails } = user_name;
    const token = jwt.sign({ userdetails }, 'my_secret_key')
    const user = await users.findOne({ where: { user_name: user_name } })
    if (user == null) {
        res.json(userNotFound)
    } else {
        bcrypt.compare(pass, user.password, function (err, result) {
            console.log(err)
            console.log(result)
            if (err || result) {
                return res.json({
                    status: 'Success',
                    message: 'User logged in successfully',
                    statuscode: 200,
                    token,
                    userDetails: user
                })
            }
            else {
                return res.json({
                    status: 'Success',
                    message: 'Email or password incorrect'
                })

            }
        })
    }
})

app.post('/users/changepass/:id', ensureToken, async (req, res) => {
    let userid = req.params.id
    const { user_name, pass, newpass } = req.body
    const user = await users.findOne({ where: { user_name: user_name } })
    if (user == null) {
        res.json(userNotFound)
    } else {
        await bcrypt.compare(pass, user.password, function (err, result) {
            if (err || result) {
                user.password = newpass
                users.update({ password: newpass }, { where: { id: userid } })
                return res.json({
                    status: 'Success',
                    message: 'Password changed successfully',
                    statuscode: 200,
                    userDetails: user
                })
            }
            else {
                return res.json({
                    status: 'Success',
                    message: 'Password incorrect'
                })

            }
        })
    }
})

app.get('/users/data/:username', ensureToken, async (req, res) => {
    const username = req.params.username

    const user = await users.findOne({ where: { user_name: username } })
    if (user == null) {
        res.json(userNotFound)
    } else {
        res.json({
            status: 'Success',
            message: 'user details retrieved successfully',
            statuscode: 200,
            userDetails: user
        })
    }

})

app.post('/forgotpass/:username', ensureToken, async (req, res) => {
    const { id } = req.params.id
    const user = await users.findOne({ where: { user_name: id } })
    if (user == null) {
        res.json(userNotFound)
    } else {
        var password = await bcrypt.hash(pass, 10)
        users.update({ password: password }, { where: { id: userid } })
        res.json({
            status: 'Success',
            message: 'user details retrieved successfully',
            statuscode: 200,
            userDetails: user
        })
    }
})

function getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function ensureToken(req, res, next) {
    console.log('ensureToken called')
    const bearerHeader = req.headers["authorization"]
    if (typeof bearerHeader !== 'undefined') {
        const bearer = bearerHeader.split(" ")
        const bearerToken = bearer[1];
        console.log(bearerToken)
        req.token = bearerToken
        jwt.verify(req.token, 'my_secret_key', (err, authData) => {
            if (err) {
                res.json({
                    status: 200,
                    message: 'auth token expired or auth token is invalid'
                })
            }
        })
        next()
    } else {
        res.json({
            status: 200,
            message: 'auth token expired or auth token is invalid'
        })
    }
}



function sendMail(email, subject, text) {
    var transport = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'wankhedeshubham58@gmail.com',
            pass: 'Asdf@123'
        }
    })
    var mailOptions = {
        from: 'wankhedeshubham58@gmail.com',
        to: email,
        subject: subject,
        text: text
    }
    transport.sendMail(mailOptions, function (err, info) {
        if (err) {
            console.log(err);
        } else {
            console.log('Email sent ' + info.response)
        }
    })
}

app.get('/userDetails/:username', ensureToken, async (req, res) => {
    const username = req.params.username
    const user = await users.findOne({ where: { user_name: username } })
    if (null == user) {
        res.json(userNotFound)
    } else {
        res.json(user)
    }
})

const userNotFound = {
    status: 'Success',
    message: 'User Not found',
    statuscode: 404
}


app.listen(3005, () => {
    console.log('Server stared')
});