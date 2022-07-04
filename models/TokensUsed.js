const mongoose = require('../db/conn')
const { Schema } = mongoose

const TokenUsed = mongoose.model(
    'Token',
    new Schema(
        {
            tokenUsado: {
                type: String,
                required: true
            },
        },
        { timestamps: true }
    )
)

module.exports = TokenUsed