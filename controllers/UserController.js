const User = require('../models/User')
const bcrypt = require('bcrypt')
const createUserToken = require('../helpers/createUserToken')

module.exports = class UserController {
    static async register(req, res) {
        const { name, email, password, phone, confirmpassword } = req.body

        if (!name) {
            res.status(422).json({ message: 'O campo nome é obrigatório' })
            return
        }

        if (!email) {
            res.status(422).json({ message: 'O campo e-mail é obrigatório' })
            return
        }

        if (!password) {
            res.status(422).json({ message: 'A senha é obrigatória' })
            return
        }

        if (!phone) {
            res.status(422).json({ message: 'O campo telefone é obrigatório' })
            return
        }

        if (!confirmpassword) {
            res.status(422).json({ message: 'A confirmação de senha é obrigatória' })
            return
        }

        if (password !== confirmpassword) {
            res.status(422).json({ message: 'O campo senha e confirmação de senha precisam ser iguais' })
            return
        }

        const userExists = await User.findOne({ email: email })

        if (userExists) {
            res.status(422).json({ message: 'O e-mail já está cadastrado' })
            return
        }

        // create a password
        const salt = await bcrypt.genSalt(12)
        const passwordHash = await bcrypt.hash(password, salt)

        // create a user
        const user = new User({
            name,
            email,
            phone,
            password: passwordHash
        })

        try {
            const newUser = await user.save()
            await createUserToken(newUser, req, res)
        } catch (err) {
            res.status(500)
            res.send(err)
        }
    }

    static async login(req, res) {
        const { email, password } = req.body

        if (!email) {
            res.status(422)
            res.send('O campo e-mail é obrigatório')
            return
        }

        if (!password) {
            res.status(422)
            res.send('A senha é obrigatória')
            return
        }

        const user = await User.findOne({ email: email })

        if (!user) {
            res.status(422)
            res.send('Não há usuário cadastrado com esse e-mail')
            return
        }

        const checkPassword = await bcrypt.compare(password, user.password)

        if (!checkPassword) {
            res.status(422)
            res.send('Senha inválida!')
            return
        }

        await createUserToken(user, req, res)
    }

    static async checkUser(req,res) {
        let currentUser

        console.log(req.headers.authorization)

        req.headers.authorization ? " " : currentUser = null

        res.status(200).send(currentUser)
    }
}