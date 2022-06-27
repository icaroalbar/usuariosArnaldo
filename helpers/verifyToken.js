const jwt = require('jsonwebtoken')
const getToken = require('./getToken')

const checkToken = (req, res, next) => {
    
    if (!req.headers.authorization) return res.status(401).send('Acesso negado!')
    
    const token = getToken(req)

    if (!token) return res.status(401).send('Acesso negado!')

    try {
        const verifed = jwt.verify(token, 'nossosecret')
        req.user = verifed
        next()
    } catch (error) {
        return res.status(401).send('Token inválido!')
    }
}

module.exports = checkToken