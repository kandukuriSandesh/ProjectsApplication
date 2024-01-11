const express = require('express');
const { graphqlHTTP } = require('express-graphql');
require('dotenv').config()
const port =  5000
const schema = require('./schema/schema.js')
const app = express()
const connectDB = require('../config/db.js')

connectDB()
app.use(
    '/graphql',
    graphqlHTTP({
        schema,
        graphiql:true
    })
)

app.listen(port, () => console.log(`listening on ${port}`))