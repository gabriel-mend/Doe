// SERVER CONFIG //
const express = require("express")
const server = express()

// EXTRA FILES STATICS //
server.use(express.static("public"))

// BODY FORM //
server.use(express.urlencoded({ extended: true }))

// DATABASE CONFIG
const Pool = require("pg").Pool
const db = new Pool({
    user: 'postgres',
    password: '12345',
    host: 'localhost',
    port: 5432,
    database: 'doe'
})

// TEMPLATE CONFIG //
const nunjucks = require("nunjucks")
nunjucks.configure("./", {
    express: server,
    noCache: true,

})

// SHOW PAGE //
server.get("/", function(req, res) {
    db.query(`SELECT * FROM donors`, function(err, result) {
        if (err) return res.send("Erro no banco de dados.")
        const donors = result.rows
        return res.render("index.html", { donors })
    })
    
})

server.post("/", function(req, res) {
    const name = req.body.name
    const email = req.body.email
    const blood  = req.body.blood

    if(name == "" || email == "" || blood == "") {
        return res.send("Todos os campos são obrigatórios.")
    }

    const query = `
        INSERT INTO donors ("name", "email", "blood") 
        VALUES ($1, $2, $3)`

    const values = [name, email, blood]

    db.query(query, values, function(err) {
        if (err) return res.send("Erro no banco de dados")

        return res.redirect("/")
    })

})
// LISTEN SERVER //
server.listen(3000)