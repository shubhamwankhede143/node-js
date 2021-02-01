const express = require('express');
const { sequelize, User } = require('./models')
const app = express()

app.use(express.json())
app.post('/users/signup', async (req, res) => {
    const { firstName, lastName, email, password } = req.body

    try {
        const user = await User.create({ firstName, lastName, email, password })
        return res.json(user)
    } catch (err) {
        console.log(err)
        return res.status(500).json(err)
    }
})

app.get('/users/:uuid', async (req, res) => {

    const uuid = req.params.uuid

    try {
        const user = await User.findOne({ uuid })
        return res.json(user)
    } catch (err) {
        console.log(err)
        return res.status(500).json(err)
    }
})


app.delete('/users/:uuid', async (req, res) => {

    const uuid = req.params.uuid

    try {
        await User.destroy({ where: { uuid: uuid } })
        return res.status(200).end("User deleted successfully")
    } catch (err) {
        console.log(err)
        return res.status(500).json(err)
    }
})

app.get('/users', async (req, res) => {

    try {
        const user = await User.findAll()
        return res.json(user)
    } catch (err) {
        console.log(err)
        return res.status(500).json(err)
    }
})


app.listen({ port: 5000 }, async () => {
    console.log('Server is up')
    await sequelize.authenticate()
    console.log('Database synced successfully')
})