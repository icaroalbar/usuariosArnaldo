const jwt = require('jsonwebtoken')

const createUserToken = async (user, req, res) => {
    // create a token
    const token = jwt.sign({
        name: user.name,
        id: user._id
    },"nossosecret")

    // return token
    res.status(200).send(`Usuário cadastrado com sucesso! ${token}`)
}

module.exports = createUserToken