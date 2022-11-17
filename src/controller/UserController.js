const status = require('http-status');
const User = require('../models/User')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require("dotenv").config();



function checkToken(req, res, next) {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(" ")[1]
    if(!token){
        return res.status(401).json({msg: 'Acesso negado'})
    }

    try {
        const secret = process.env.SECRET
        jwt.verify(token,secret)
        next();
    } catch (error) {
        res.status(400).json({msg:"Token Inválido"})
    }

}

module.exports = {
    //Registe new User
    async store(req, res) {
        const { email, pagamento, plano, senha } = req.body;
        const userExists = await User.findOne({ where: { email: email } })
        //Checked if user exist
        if (userExists) {
            return res.status(422).json({ msg: "Email já existente!" })
        }
        //Create a safe password
        const salt = await bcrypt.genSalt(12);
        const passwordHash = await bcrypt.hash(senha, salt)

        //Create a User
        try {
            const user = await User.create(
                {
                    email,
                    senha: passwordHash,
                    plano,
                    pagamento
                })
            return res.status(201).json(user);

        } catch (error) {
            console.log(error)
            res.status(500).json({ msg: "Error no servidor!" })
        }

    },

    //Show All User Registed
    async userList(req, res) {
        const users = await User.findAll();
        return res.json(users);
    },

    //Delete a User registed
    async deletUser(req, res) {
        const { id } = req.params;

        const user = await User.findByPk(id);

        if (!user) {
            return res.status(400).json({ erro: 'user not found' })
        }

        const deletuser = await User.destroy({
            where: { id }
        });

        return res.send("OK")
    },

    //Login User
    async login(req, res) {
        const { email, senha } = req.body
        const user = await User.findOne({ where: { email: email } })

        //Checked if user exist
        if (!user) {
            return res.status(404).json({ msg: "Email não encontrado" })
        }

        //Checked if password match
        const checkedPassword = await bcrypt.compare(senha, user.senha)
        if (!checkedPassword) {
            return res.status(422).json({ msg: "senha inválida!" })
        }

        try {
            const secret = process.env.SECRET
            const token = jwt.sign({ id: user.id },
                secret,
            )

            res.status(200).json({ msg: "Atutenticação realizada com sucesso", token })

        } catch (error) {
            console.log(error)
            res.status(500).json({ msg: "Error no servidor!" })
        }
    },
    //Private Route
    async privateRoute(req, res) {

        const id = req.params.id
        //Check if user exist
        const user = await User.findByPk(id,{attributes:{exclude:['senha']}})
        if (!user) {
            return res.status(404).json({ msg: "user not found" })
        }
        res.status(200).json({ user })
    },checkToken
}

