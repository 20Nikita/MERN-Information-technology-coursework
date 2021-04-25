const {Router} = require('express')
const {Schema, model} = require('mongoose')

const stringSchema = new Schema({
    НомерСтраницы: {type: Number, required: true},
    ВремяОбращения: {type: Number, required: true},
    Запись: {type: Boolean, required: true},
})

const Данные = new Schema({
    Название: {type: String, required: true, unique: true},
    РазмерБуффера: {type: Number, required: true},
    РабочееМножество: {type: Number, required: true},
    СбросОбращения: {type: Number, required: true},
    Содержимое: [stringSchema]
})

const БазаДанных = Router()

// /api/start/Добавить
БазаДанных.post(
    "/Добавить",
    async(req, res) => {
        try {
            const {Название, РазмерБуффера, РабочееМножество, СбросОбращения, Содержимое} = req.body
            const candidate = await Данные.findOne({ Название: Название })
        if(candidate){
            return res.status(400).json({ message: 'Такое название существует! Придумайте другое или переименйте загружаемый файл' })
        }
        const данные = new Данные({ Название:Название,
                                    РазмерБуффера:РазмерБуффера,
                                    РабочееМножество:РабочееМножество,
                                    СбросОбращения:СбросОбращения,
                                    Содержимое:Содержимое})
        await данные.save()
        res.status(201).json({ message: 'Данные сохранены' })
        } catch (e) {
            res.status(500).json({message: 'Что-то пошло не так, попробуйте снова'})
        }
    }
)

// /api/start/Прочитать
БазаДанных.post(
    "/Прочитать",
    async(req, res) => {
        try {
            const {Название, РазмерБуффера, РабочееМножество, СбросОбращения, Содержимое} = req.body
            const candidate = await Данные.findOne({ Название: Название })
        if(!candidate){
            return res.status(400).json({ message: 'Такого набора данных не существует' })
        }
        res.status(201).json({ message: 'Данные сохранены', source: candidate })
        } catch (e) {
            res.status(500).json({message: 'Что-то пошло не так, попробуйте снова'})
        }
    }
)

// /api/data/Получить
БазаДанных.get(
    '/Получить',
    async(req, res) => {
    try{
        const exists = await Данные.find({}, {"Название":1, "_id":0}).lean()
        res.json({exists})
    } catch (e) {
        res.status(500).json({message: 'Что-то пошло не так, попробуйте снова'})
    }
})

// /api/data/Удалить
БазаДанных.delete(
    '/Удалить',
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
