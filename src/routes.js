const express = require('express');
const User = require('./models/User')
const UserController = require('./controller/UserController')
const routes = express.Router();
const jwt = require('jsonwebtoken');
const { checkToken } = require('./controller/UserController');

routes.post('/signUp', UserController.store)
routes.get('/usersList', UserController.userList)
routes.delete('/deleteUser/:id', UserController.deletUser)
routes.post('/login', UserController.login)
routes.get('/',(req, res)=>{
    res.json({hello:"Tudo Ok"})
})

//Private Route
routes.get('/users',checkToken,UserController.privateRoute)

module.exports = routes;