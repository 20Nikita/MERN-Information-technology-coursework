const express = require("express")
const Настройки = require("config")
const Mongoose = require("mongoose")

const сервер = express()
const Port = Настройки.get("port") || 7437

сервер.use(express.json({extended: true}))
сервер.use("/api/start",require("./БазаДанных"))

async function start() {
    try {
        await Mongoose.connect(Настройки.get("mongoUri"), {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true
        })
        сервер.listen(Port, ()=> console.log(`Сервер начал работу на порту ${Port}`)) 
    }catch(e) {
        console.log("Ошибка сервера", e.message)
        process.exit(1)
    }
}
start()