const jwt = require('jsonwebtoken')
const User = require('../models/User')

const getUserByToken = async (token) => {

    if (!token) return res.status(401).send('Acesso negado!')

    const decoded = jwt.verify(token, 'nossosecret')

    const userId = decoded.id

    const user = await User.findOne({id: userId})

    return user
}

module.exports = getUserByToken