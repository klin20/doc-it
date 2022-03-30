const express = require('express')
const app = express()
const port = process.env.PORT || 4000
const cors = require('cors')
require("dotenv").config({ path: "./config.env" });

app.use(express.urlencoded({extended:true}))
app.use(express.json())
app.use(cors())

// app.use(require("./node_modules/routes/record"));

app.get('/', cors(), async(req, res) =>{
    res.send('This is working')
})

app.get('/home', cors(), async (req,res) => {
    res.send('This is the data for the home page')
})

app.post('/saveEvent', cors(), async(req,res) => {
    let {eventObj} = req.body
    console.log(eventObj)
})

app.listen(port, () => {
    console.log('listenning on port ' + port)
})