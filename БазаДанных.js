const {Router} = require('express')
const {Schema, model} = require('mongoose')

const stringSchema = new Schema({
    НомерСтраницы: {type: Number, required: true},
    ВремяОбращения: {type: Number, required: true},
    Запись: {type: Boolean, required: true},
})

const ШаблонДанных = new Schema({
    Название: {type: String, required: true, unique: true},
    РазмерБуффера: {type: Number, required: true},
    КоличествоЭлементов: {type: Number, required: true},
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
            const {Название, РазмерБуффера, КоличествоЭлементов, РабочееМножество, СбросОбращения, Содержимое} = req.body
            const candidate = await Данные.findOne({ Название: Название })
        if(candidate){
            return res.status(400).json({ message: 'Такое название существует! Придумайте другое или переименйте загружаемый файл' })
        }
        const данные = new Данные({ Название:Название,
                                    РазмерБуффера:РазмерБуффера,
                                    КоличествоЭлементов:КоличествоЭлементов,
                                    РабочееМножество:РабочееМножество,
                                    СбросОбращения:СбросОбращения,
                                    Содержимое:Содержимое})
        await данные.save()
        res.status(201).json({ message: 'Данные сохранены' })
        } catch (e) {
            console.log(e)
            res.status(500).json({message: {message: 'Что-то пошло не так, попробуйте снова'}})
        }
    }
)

// /api/start/getOne
БазаДанных.post(
    "/getOne",
    async(req, res) => {
        try {
            const {Название, РазмерБуффера, РабочееМножество, СбросОбращения, Содержимое} = req.body
            const candidate = await Данные.findOne({ Название: Название })
        if(!candidate){
            return res.status(400).json({ message: 'Такого набора данных не существует' })
        }
        candidate.Содержимое.sort((a, b) => a.ВремяОбращения - b.ВремяОбращения)
        res.status(201).json({ message: 'Данные найдены', source: candidate })
        } catch (e) {
            res.status(500).json({message: 'Что-то пошло не так, попробуйте снова'})
        }
    }
)

// /api/data/Get
БазаДанных.get(
    '/Get',
    async(req, res) => {
    try{
        const exists = await Данные.find({}, {"Название":1, "_id":0}).lean()
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
            return res.status(400).json({ message: 'Такого набора данных не существует' })
        }
        res.status(201).json({message: 'Данные удалены'})
    } catch (e) {
        res.status(500).json({message: 'Что-то пошло не так, попробуйте снова'})
    }
})

module.exports = БазаДанных
