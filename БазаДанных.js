const {Router} = require('express')
const {Schema, model} = require('mongoose')
const  algoritm  = require('./algs')
const  Генерация  = require('./Генерация')

const stringSchema = new Schema({
    НомерСтраницы: {type: Number, required: true},
    ВремяОбращения: {type: Number, required: true},
    Запись: {type: Number, required: true},
})

const ШаблонДанных = new Schema({
    Название: {type: String, required: true, unique: true},
    РазмерБуффера: {type: Number, required: true},
    КоличествоЭлементов: {type: Number, required: true},
    КоличествоСтраниц: {type: Number, required: true},
    РабочееМножество: {type: Number, required: true},
    СбросОбращения: {type: Number, required: true},
    Содержимое: [stringSchema]
})


const БазаДанных = Router()
var Данные = model('Данные', ШаблонДанных);

// /api/start/Add
БазаДанных.post(
    "/Add",
    async(req, res) => {
        try {
        const {Название, РазмерБуффера, КоличествоЭлементов,КоличествоСтраниц, РабочееМножество, СбросОбращения, Содержимое} = req.body
        const candidate = await Данные.findOne({ Название: Название })
        if(candidate){
            return res.status(400).json({ message: 'Такое название существует!\nПридумайте другое или переименйте загружаемый файл.' })
        }
        const данные = new Данные({ Название:Название,
                                    РазмерБуффера:РазмерБуффера,
                                    КоличествоЭлементов:КоличествоЭлементов,
                                    КоличествоСтраниц:КоличествоСтраниц,
                                    РабочееМножество:РабочееМножество,
                                    СбросОбращения:СбросОбращения,
                                    Содержимое:Содержимое})
        await данные.save()
        let fifo = JSON.stringify(algoritm.fifo(РазмерБуффера,Содержимое))
        let WS_Clock = JSON.stringify(algoritm.WS_Clock(РазмерБуффера, КоличествоЭлементов,
            КоличествоСтраниц, РабочееМножество, СбросОбращения, Содержимое))
        res.status(201).json({ message: 'Данные сохранены', fifo: fifo, WS_Clock: WS_Clock })
        } catch (e) {
            console.log(e)
            res.status(500).json( {message: 'Что-то пошло не так, попробуйте снова'})
        }
    }
)

// /api/start/getOne
БазаДанных.post(
    "/getOne",
    async(req, res) => {
        try {
            const {Название} = req.body
            const candidate = await Данные.findOne({ Название: Название })
        if(!candidate){
            return res.status(400).json({ message: 'Такого набора данных не существует.' })
        }
        let fifo = JSON.stringify(algoritm.fifo(candidate.РазмерБуффера,candidate.Содержимое))
        let WS_Clock = JSON.stringify(algoritm.WS_Clock(candidate.РазмерБуффера,candidate.КоличествоЭлементов,
            candidate.КоличествоСтраниц, candidate.РабочееМножество,candidate.СбросОбращения,candidate.Содержимое))
            res.status(201).json({ message: 'Данные найдены', source: candidate, fifo: fifo, WS_Clock: WS_Clock })
        } catch (e) {
            console.log(e)
            res.status(500).json({message: 'Что-то пошло не так, попробуйте снова'})
        }
    }
)

// /api/data/Get
БазаДанных.get(
    '/Get',
    async(req, res) => {
    try{
        const exists = await Данные.find({}, {"Название":1,"РазмерБуффера":1,
        "КоличествоЭлементов":1,"КоличествоСтраниц":1,"РабочееМножество":1,"СбросОбращения":1, "_id":0}).lean()
        res.json({exists})
    } catch (e) {
        res.status(500).json({message: 'Что-то пошло не так, попробуйте снова'})
    }
})

// /api/data/Delete
БазаДанных.delete(
    '/Delete',
    async(req, res) => {
    try{
        const {Название} = req.body
        const candidate = await Данные.findOneAndDelete({ Название:Название })
        if(!candidate){
            return res.status(400).json({ message: 'Такого набора данных не существует.' })
        }
        res.status(201).json({message: 'Данные удалены.'})
    } catch (e) {
        res.status(500).json({message: 'Что-то пошло не так, попробуйте снова'})
    }
})

// /api/start/Gen
БазаДанных.post(
    "/Gen",
    async(req, res) => {
        try {
        const {t1,t2,КоличествоЭлементов,КоличествоСтраниц,t3,СбросОбращения} = req.body
        Содержимое = Генерация.Генерация(КоличествоСтраниц,КоличествоЭлементов,СбросОбращения)
        console.log(Содержимое)
        res.status(201).json({ message: 'Данные сгенерированы', Содержимое:Содержимое })
        } catch (e) {
            console.log(e)
            res.status(500).json( {message: 'Что-то пошло не так, попробуйте снова'})
        }
    }
)

module.exports = БазаДанных
