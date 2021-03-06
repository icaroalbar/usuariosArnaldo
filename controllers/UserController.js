const User = require('../models/User')
const TokenUsed = require('../models/TokensUsed')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const crypto = require('crypto')

const createUserToken = require('../helpers/createUserToken')
const getToken = require('../helpers/getToken')
const getUserByToken = require('../helpers/getUserByToken')
const mailer = require('./mailer')

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

        if (!phone) {
            res.status(422).json({ message: 'O campo telefone é obrigatório' })
            return
        }

        if (!password) {
            res.status(422).json({ message: 'A senha é obrigatória' })
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

        const salt = await bcrypt.genSalt(12)
        const passwordHash = await bcrypt.hash(password, salt)

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

    static async checkUser(req, res) {
        let currentUser

        if (req.headers.authorization) {
            const token = getToken(req)
            const decoded = jwt.verify(token, 'nossosecret')

            currentUser = await User.findById(decoded.id)

            currentUser.password = undefined
        } else {
            currentUser = null
        }

        res.status(200).send(currentUser)
    }

    static async getUserById(req, res) {
        const id = req.params.id

        const user = await User.findById(id)

        if (!user) {
            res.status(422).send('Usuário não encontrado!')
            return
        } else {
            res.status(200).json({ user })
        }
    }

    static async editUser(req, res) {
        req.params.id

        const token = getToken(req)
        const user = await getUserByToken(token)

        const { name, password, phone, confirmpassword } = req.body

        let image = ''

        if (req.file) {
            image = req.file.filename
        }

        user.name = name
        user.phone = phone

        if (image) {
            const imageName = req.file.filename
            user.image = imageName
        }

        if (password !== confirmpassword) {
            res.status(422).json({ message: 'O campo senha e confirmação de senha precisam ser iguais' })
        } else if (password === confirmpassword && password != null) {

            const salt = await bcrypt.genSalt(12)
            const passwordHash = await bcrypt.hash(password, salt)

            user.password = passwordHash
        }

        try {
            await User.findOneAndUpdate(
                { _id: user._id },
                { $set: user },
                { new: true }
            )

            res.status(200).send('Usuário atualizado com sucesso!')
        } catch (error) {
            res.staus(500).console.log(error)
            return
        }
    }

    static async forgotPassword(req, res) {
        const { email } = req.body

        try {
            const user = await User.findOne({ email })
            if (!user) {
                res.status(422).send('Não há usuário cadastrado com esse e-mail')
                return
            }

            const token = crypto.randomBytes(20).toString('hex')

            const now = new Date()
            now.setMinutes(now.getMinutes() + 20)

            await User.findByIdAndUpdate(user.id, {
                '$set': {
                    passwordResetToken: token,
                    passwordResetExpires: now,
                }
            })

            await mailer.sendMail({
                from: '"Suporte Arnaldo" <contato@astrocrypto.com.br>',
                to: `${email}`,
                subject: "Recuperação de senha",
                text: `Token ${token}`,
                html: `<b>Token: </b>${token}<br>`,
            }, erro => {
                if (erro) return res.status(400).send('erro')
            })

            res.send('enviado')

        } catch (error) {
            console.log(error)
        }
    }

    static async resetPassword(req, res) {
        const { email, token, password } = req.body

        try {
            const user = await User.findOne({ email })
                .select('+passwordResetToken passwordResetExpires')

            const tokenBanco = await TokenUsed.findOne({ 'tokenUsado': token })

            if (tokenBanco) {
                res.status(422).send('Token expirado')
                return
            }

            if (!user) {
                res.status(422).send('Não há usuário cadastrado com esse e-mail')
                return
            }

            if (token !== user.passwordResetToken) {
                res.status(422).send('Token inválido')
                return
            }

            const now = new Date()

            if (now > user.passwordResetExpires) {
                res.status(422).send('Token expirado')
                return
            }

            const salt = await bcrypt.genSalt(12)
            const passwordHash = await bcrypt.hash(password, salt)

            user.password = passwordHash

            const tokenRecuperacao = new TokenUsed({
                tokenUsado: token
            })

            tokenRecuperacao.tokenUsado = token

            await user.save()
            await tokenRecuperacao.save()

            res.send('Senha alterada com sucesso!')

        } catch (error) {
            res.status(400).send("Erro password.")
        }
    }
}