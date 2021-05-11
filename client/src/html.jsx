import {Redirect, Route} from "react-router-dom"
import React, {useEffect, useState} from 'react';
import cn from "classnames";
import {useHttp} from './hooks/http.hooks';
import materialize from "materialize-css";

export const Rout = () => {
    let [text, setText] = useState("")
    let [fifo, setfifo] = useState({Буффер: [], НомерСтраницы: [], Pf: []})
    let [ЭФ_fifo, setЭФ_fifo] = useState(0)
    let [WS_Clock, setWS_Clock] = useState({
        ИзмененноеВремяОбращения: [],
        ВремяОбращения: [], НомерСтраницы: [], Буффер: [], Pf: [], Стили: []
    })
    let [ЭФ_WS_Clock, setЭФ_WS_Clock] = useState(0)
    let t = ""
    let [Кнопка, setКнопка] = useState(0)
    let [ФайлПрочитан, setФайлПрочитан] = useState(0)
    const {loading, request, error, clearError} = useHttp()
    const [form, setForm] = useState({
        Название: "",
        РазмерБуффера: 0,
        КоличествоЭлементов: 0,
        КоличествоСтраниц: 0,
        РабочееМножество: 0,
        СбросОбращения: 0,
        ВЗД: 0,
        Содержимое: []
    })
    useEffect(() => {
        clearError()
        if (window.M && error) {
            window.M.toast({html: error})
        }
        if (error) {
            setText(error)
        }
    }, [error, clearError])

    const ОбновитьФорму = event => {
        setForm({...form, [event.target.name]: event.target.value})
    }

    const ClearForm = event => {
        document.getElementById("Название").value = ""
        document.getElementById("РазмерБуффера").value = ""
        document.getElementById("КоличествоЭлементов").value = ""
        document.getElementById("КоличествоСтраниц").value = ""
        document.getElementById("РабочееМножество").value = ""
        document.getElementById("СбросОбращения").value = ""
        document.getElementById("ВЗД").value = ""
        form.Название = ""
        form.РазмерБуффера = 0
        form.КоличествоЭлементов = 0
        form.КоличествоСтраниц = 0
        form.РабочееМножество = 0
        form.СбросОбращения = 0
        form.ВЗД = 0
        form.Содержимое = []
        setText("")
        setfifo({Буффер: [], НомерСтраницы: [], Pf: []})
        setWS_Clock({
            ИзмененноеВремяОбращения: [],
            ВремяОбращения: [],
            НомерСтраницы: [],
            Буффер: [],
            Pf: [],
            Стили: []
        })
        setЭФ_fifo("")
        setЭФ_WS_Clock("")
    }
    let [КогоЗагрузить, setКогоЗагрузить] = useState(-1)
    let [ОтУд, setОтУд] = useState("Удалить")
    const ОбновитьSelect = event => {
        setКогоЗагрузить(event.target.value)
        setФайлПрочитан(0)
        if (event.target.value !== "0") {
            document.getElementById("Название").value = СохранДанные[event.target.value - 1].Название
            document.getElementById("РазмерБуффера").value = СохранДанные[event.target.value - 1].РазмерБуффера
            document.getElementById("КоличествоЭлементов").value = СохранДанные[event.target.value - 1].КоличествоЭлементов
            document.getElementById("КоличествоСтраниц").value = СохранДанные[event.target.value - 1].КоличествоСтраниц
            document.getElementById("РабочееМножество").value = СохранДанные[event.target.value - 1].РабочееМножество
            document.getElementById("СбросОбращения").value = СохранДанные[event.target.value - 1].СбросОбращения
            document.getElementById("ВЗД").value = СохранДанные[event.target.value - 1].ВЗД
            form.Название = СохранДанные[event.target.value - 1].Название
            form.РазмерБуффера = СохранДанные[event.target.value - 1].РазмерБуффера
            form.КоличествоЭлементов = СохранДанные[event.target.value - 1].КоличествоЭлементов
            form.КоличествоСтраниц = СохранДанные[event.target.value - 1].КоличествоСтраниц
            form.РабочееМножество = СохранДанные[event.target.value - 1].РабочееМножество
            form.СбросОбращения = СохранДанные[event.target.value - 1].СбросОбращения
            form.ВЗД = СохранДанные[event.target.value - 1].ВЗД
            setОтУд("Удалить")
        } else setОтУд("Отправить")
    }
    let [СохранДанные, setСохранДанные] = useState([])
    useEffect(() => {
        let elems = document.querySelector('select');
        elems.length = 2
        materialize.FormSelect.init(elems, materialize.options);
        for (let index = 0; index < СохранДанные.length; index++) {
            let elems = document.querySelector('select');
            elems.add(new Option(`${СохранДанные[index].Название}`, `${index + 1}`))
            materialize.FormSelect.init(elems, materialize.options);
        }
        if (Кнопка === 0)
            elems.value = -1
        if (Кнопка === 1)
            elems.value = КогоЗагрузить
        if (Кнопка === 2) {
            elems.value = СохранДанные.length
            setКогоЗагрузить(СохранДанные.length)
        }
        if (Кнопка === 3) {
            setКогоЗагрузить(-1)
            elems.value = -1
        }
        materialize.FormSelect.init(elems, materialize.options);
    }, [СохранДанные])
    const ЧтениеДанных = async () => {
        try {
            const data = await request("/api/start/Get", "get")
            if (window.M && data.message) {
                window.M.toast({html: data.message})
            }
            setСохранДанные(data.exists)
        } catch (e) {
        }
    }
    let [Загрузить, setЗагрузить] = useState(true)
    if (Загрузить) {
        ЧтениеДанных()
        setЗагрузить(!Загрузить)
    }


    const Печать = (data) => {
        t = ""
        t += "Название: "
        t += data.Название
        t += "\nРазмер буффера: "
        t += data.РазмерБуффера
        t += "\nКоличество элементов: "
        t += data.КоличествоЭлементов
        t += "\nКоличество страниц: "
        t += data.КоличествоСтраниц
        t += "\nРабочее множество: "
        t += data.РабочееМножество
        t += "\nСброс обращения: "
        t += data.СбросОбращения
        t += "\nВремя записи: "
        t += data.ВЗД
        t += "\nСодержимое: ["
        for (let index = 0; index < data.Содержимое.length; index++) {
            t += "\nНомер cтраницы: "
            t += data.Содержимое[index].НомерСтраницы
            t += " Время обращения: "
            t += data.Содержимое[index].ВремяОбращения
            t += " Запись: "
            t += data.Содержимое[index].Запись
        }
        t += "\n]"
        setText(t)
    }

    const Проверка = () => {
        if (form.Название.length < 3)
            return "Название должно быть > 2 символов"
        if (form.РазмерБуффера < 1)
            return "Размер Буффера должен быть > 0"
        if (form.КоличествоЭлементов < 1)
            return "Количество элементов должно быть > 0"
        if (form.КоличествоСтраниц < 1)
            return "Количество страниц должно быть > 0"
        if (form.РабочееМножество < 1)
            return "Рабочее множество должно быть > 0"
        if (form.СбросОбращения < 2)
            return "Время сброса обращения должно быть > 1"
        if (form.ВЗД < 0)
            return "Время записи на диск должно быть >= 0"
        return 0
    }
    const ЗагрузитьДанные = async () => {
        try {
            if (КогоЗагрузить > 0) {
                const data = await request("/api/start/getOne", "POST", СохранДанные[КогоЗагрузить - 1])
                if (window.M && data.message) {
                    window.M.toast({html: data.message})
                }
                data.fifo = await JSON.parse(data.fifo)
                data.WS_Clock = await JSON.parse(data.WS_Clock)
                setКнопка(1)
                Печать(data.source)
                setfifo({Буффер: [], НомерСтраницы: [], Pf: []})
                setWS_Clock({
                    ИзмененноеВремяОбращения: [],
                    ВремяОбращения: [],
                    НомерСтраницы: [],
                    Буффер: [],
                    Pf: [],
                    Стили: []
                })
                clacc(data.WS_Clock.Стили, data.WS_Clock.Pf.length - 1, data.WS_Clock.Буффер.length * 4 + 3)
                setfifo(data.fifo)
                t = 0
                for (let i = 0; i < data.fifo.Pf.length; i++) {
                    t += data.fifo.Pf[i]
                }
                setЭФ_fifo(t)
                t = 0
                for (let i = 0; i < data.WS_Clock.Pf.length; i++) {
                    if (data.WS_Clock.Pf[i] !== -1)
                        t += data.WS_Clock.Pf[i]
                }
                setЭФ_WS_Clock(t)
                setЗагрузить(!Загрузить)
                setWS_Clock(data.WS_Clock)

            } else if (КогоЗагрузить === "0") {
                var input = document.createElement('input')
                input.type = 'file';
                input.onchange = e => {
                    var file = e.target.files[0]
                    var reader = new FileReader()
                    reader.readAsText(file, 'UTF-8')
                    reader.onload = async readerEvent => {
                        var content = readerEvent.target.result
                        content = await JSON.parse(content)
                        document.getElementById("РазмерБуффера").value = content[0][0]
                        document.getElementById("КоличествоЭлементов").value = content[0][1]
                        document.getElementById("КоличествоСтраниц").value = content[0][2]
                        document.getElementById("РабочееМножество").value = content[0][3]
                        document.getElementById("СбросОбращения").value = content[0][4]
                        document.getElementById("ВЗД").value = content[0][5]
                        form.РазмерБуффера = content[0][0]
                        form.КоличествоЭлементов = content[0][1]
                        form.КоличествоСтраниц = content[0][2]
                        form.РабочееМножество = content[0][3]
                        form.СбросОбращения = content[0][4]
                        form.ВЗД = content[0][5]
                        form.Содержимое = []
                        for (let i = 0; i < content[1].length; i++) {
                            let Обращение = {}
                            Обращение.НомерСтраницы = content[1][i][0]
                            Обращение.ВремяОбращения = content[1][i][1]
                            Обращение.Запись = content[1][i][2]
                            form.Содержимое.push(Обращение)
                        }
                        Печать(form)
                        setФайлПрочитан(1)
                    }
                }
                input.click()
            }
        } catch (e) {
            console.log(e)
        }
    }
    useEffect(()=>{console.log(Кнопка,КогоЗагрузить,(!!СохранДанные[КогоЗагрузить - 1]))},[Кнопка])
    const Сгенерировать = async () => {
        try {
            if (!Проверка()) {
                if (КогоЗагрузить !== "0") {
                    form.Содержимое = await request("/api/start/Gen", "POST", {...form})
                    form.Содержимое = form.Содержимое.Содержимое
                }
                const data = await request("/api/start/Add", "POST", {...form})
                if (window.M && data.message) {
                    window.M.toast({html: data.message})
                }
                setЗагрузить(!Загрузить)
                data.fifo = await JSON.parse(data.fifo)
                data.WS_Clock = await JSON.parse(data.WS_Clock)
                Печать(form)
                setfifo({Буффер: [], НомерСтраницы: [], Pf: []})
                setWS_Clock({ИзмененноеВремяОбращения: [], ВремяОбращения: [], НомерСтраницы: [], Буффер: [], Pf: []})
                clacc(data.WS_Clock.Стили, data.WS_Clock.Pf.length, data.WS_Clock.Буффер.length * 4 + 3)
                setfifo(data.fifo)
                setWS_Clock(data.WS_Clock)
                t = 0
                for (let i = 0; i < data.fifo.Pf.length; i++) {
                    t += data.fifo.Pf[i]
                }
                setЭФ_fifo(t)
                t = 0
                for (let i = 0; i < data.WS_Clock.Pf.length; i++) {
                    if (data.WS_Clock.Pf[i] !== -1)
                        t += data.WS_Clock.Pf[i]
                }
                setЭФ_WS_Clock(t)
                setОтУд("Удалить")
                setКнопка(2)
            } else (setText(Проверка()))
        } catch (e) {
            console.log(e)
        }
    }

    const УдалениеДанных = async () => {
        try {
            if (КогоЗагрузить > 0) {
                const data = await request("/api/start/Delete", "delete", СохранДанные[КогоЗагрузить - 1])
                if (window.M && data.message) {
                    window.M.toast({html: data.message})
                }
                t = data.message
                setКнопка(3)
                setText(t)
                setЗагрузить(!Загрузить)
                setfifo({Буффер: [], НомерСтраницы: [], Pf: []})
                setWS_Clock({
                    ИзмененноеВремяОбращения: [],
                    ВремяОбращения: [], НомерСтраницы: [], Буффер: [], Pf: [], Стили: []
                })
                setЭФ_fifo(0)
                setЭФ_WS_Clock(0)
                if (data.message)
                    setText(data.message)
            } else if (КогоЗагрузить === "0") {
                setКнопка(4)
                Сгенерировать()
            }
        } catch (e) {
        }
    }
    let [Clacc, setClacc] = useState("")
    const clacc = async (Стили, x, y) => {
        t = Array.from(Array(x), () => new Array(y))

        for (let i = 0; i < Стили.length; i++) {
            t[Стили[i][0]][Стили[i][1]] = Стили[i][2]
        }
        setClacc(t)
    }
    return (
        <div>
            <Route path="/" exact>
                <div className="vertical">
                    <div style={{height: 20}}/>
                    <div className="item">
                        <div className="horizontal ">
                            <div className="item zag3 zag4">
                                <div className="centr catr">
                                    <div className="card blue-grey darken-1" style={{margin: 0}}>
                                        <div className="card-content white-text">
                                            <span className="card-title cen zag1">Загрузить данные</span>
                                            <div style={{height: 5}}/>
                                            <div className=" horizontal input-field">
                                                <div className="item">
                                                    <div className="btn zag4 notBor t">
                                                        <select onChange={ОбновитьSelect} className="materialSelect"
                                                                id="myDropdown">
                                                            <option value="-1" disabled defaultValue="Откуда?"
                                                                    name="Название">ОТКУДА?
                                                            </option>
                                                            <optgroup label="Из файла">
                                                                <option value="0">Из файла</option>
                                                            </optgroup>
                                                            <optgroup label="с сервера">
                                                            </optgroup>
                                                        </select>
                                                    </div>
                                                </div>
                                                <div style={{width: 10}}/>
                                                <button className="waves-effect waves-light btn item zag4"
                                                        onClick={ЗагрузитьДанные}
                                                        disabled={!((КогоЗагрузить !== -1) * !loading)}
                                                >Загрузить
                                                </button>
                                            </div>
                                            <div style={{height: 30}}/>
                                            <span className="card-title cen zag2">Сгенерировать новые</span>
                                            <div style={{height: 5}}/>
                                            <div>
                                                <div className="input-field">
                                                    <div className="horizontal">
                                                        <p className="cen "
                                                           style={{width: 200}}
                                                        >Название</p>

                                                        <input placeholder="Должно быть уникальным"
                                                               style={{height: 30}}
                                                               id="Название"
                                                               name="Название"
                                                               type="text"
                                                               className="validate cen"
                                                               onChange={ОбновитьФорму}/>
                                                        <div style={{width: 20}}/>
                                                        <button className="waves-effect waves-light btn zag4 ing"
                                                                onClick={ClearForm}/>
                                                    </div>

                                                    <div className="horizontal">
                                                        <p className="cen"
                                                           style={{width: 350}}
                                                        >Размер буфера</p>

                                                        <input placeholder=" > 0"
                                                               id="РазмерБуффера"
                                                               name="РазмерБуффера"
                                                               type="Number"
                                                               className="validate rig"
                                                               onChange={ОбновитьФорму}/>
                                                    </div>

                                                    <div className="horizontal">
                                                        <p className="cen"
                                                           style={{width: 350}}
                                                        >Количество элементов</p>

                                                        <input placeholder=" > 0 "
                                                               id="КоличествоЭлементов"
                                                               name="КоличествоЭлементов"
                                                               type="Number"
                                                               className="validate rig"
                                                               onChange={ОбновитьФорму}/>
                                                    </div>

                                                    <div className="horizontal">
                                                        <p className="cen"
                                                           style={{width: 350}}
                                                        >Количество страниц</p>

                                                        <input placeholder=" > 0 "
                                                               id="КоличествоСтраниц"
                                                               name="КоличествоСтраниц"
                                                               type="Number"
                                                               className="validate rig"
                                                               onChange={ОбновитьФорму}/>
                                                    </div>

                                                    <div className="horizontal">
                                                        <p className="cen"
                                                           style={{width: 350}}
                                                        >Рабочее множество</p>

                                                        <input placeholder=" > 0 "
                                                               id="РабочееМножество"
                                                               name="РабочееМножество"
                                                               type="Number"
                                                               className="validate rig"
                                                               onChange={ОбновитьФорму}/>
                                                    </div>

                                                    <div className="horizontal">
                                                        <p className="cen"
                                                           style={{width: 350}}
                                                        >Время сброса обращения</p>

                                                        <input placeholder=" > 1 "
                                                               id="СбросОбращения"
                                                               name="СбросОбращения"
                                                               type="Number"
                                                               className="validate rig"
                                                               onChange={ОбновитьФорму}/>
                                                    </div>

                                                    <div className="horizontal">
                                                        <p className="cen"
                                                           style={{width: 350}}
                                                        >Время записи на диск</p>

                                                        <input placeholder=" >= 0 "
                                                               id="ВЗД"
                                                               name="ВЗД"
                                                               type="Number"
                                                               className="validate rig"
                                                               onChange={ОбновитьФорму}/>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className=" horizontal card-action">
                                            <button className="waves-effect waves-light btn item zag4"
                                                    style={{}}
                                                    onClick={Сгенерировать}
                                                    disabled={loading}
                                            >Сгенерировать
                                            </button>
                                            <div style={{width: 10}}/>
                                            <button className="waves-effect waves-light btn item zag4"
                                                    style={{}}
                                                    onClick={УдалениеДанных}
                                                    disabled={!(((КогоЗагрузить > 0) + (КогоЗагрузить === "0") * ФайлПрочитан) * !loading)}
                                            >{ОтУд}</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="item">
                                <div className="scrol centr text becc">
                                    <pre>{text}</pre>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="item ots">
                        <h2>fifo</h2>
                        <div className="tabl becc">
                            <table className="responsive-table1">
                                <thead>
                                <tr>
                                    <th>N:</th>
                                    {fifo.Буффер.map((Буффер, index) => (
                                        <th key={`${index}_${Буффер.length * Math.random()}`}>{Буффер[0]}</th>
                                    ))}
                                    <th>PF:</th>
                                </tr>
                                </thead>
                                <tbody>
                                {fifo.НомерСтраницы.map((НомерСтраницы, index) => (
                                    <tr key={index}>
                                        <td>{НомерСтраницы}</td>
                                        {fifo.Буффер.map((Буффер, key) => (
                                            <td key={`${key}_${Буффер.length * Math.random()}`}>{Буффер[index + 1] !== -1 ? Буффер[index + 1] : "."} </td>))}

                                        <td>{fifo.Pf[index]}</td>
                                    </tr>))}
                                </tbody>
                            </table>
                        </div>
                        <h4>NPF = {ЭФ_fifo}</h4>
                        <h2>WS_Clock</h2>
                        <div className="tabl becc">
                            <table className="responsive-table1">
                                <thead>
                                <tr>
                                    <th>ИВО:</th>
                                    <th>ВО:</th>
                                    <th>ОП:</th>
                                    {WS_Clock.Буффер.map((t, i) => (
                                        <tr key={`${t}_${i * Math.random()}`} style={{padding: 0, border: 0}}>
                                            <th>{i}</th>
                                            <th>БО</th>
                                            <th>БИ</th>
                                            <th>ВПИ</th>
                                        </tr>
                                    ))}
                                    <th>PF:</th>
                                </tr>
                                </thead>
                                <tbody>
                                {WS_Clock.НомерСтраницы.map((НомерСтраницы, index) => (
                                    <tr key={`${index}_${НомерСтраницы * Math.random()}`}>
                                        <td>{WS_Clock.ИзмененноеВремяОбращения[index] !== -1 ? WS_Clock.ИзмененноеВремяОбращения[index] : "."}</td>
                                        <td className={cn({
                                            ["green"]: Clacc[index][1] === 3
                                        })}>{WS_Clock.ВремяОбращения[index] !== -1 ? WS_Clock.ВремяОбращения[index] : "."}</td>

                                        <td className={cn({
                                            ["yellow"]: Clacc[index][2] === 2,
                                        })}>{НомерСтраницы !== -1 ? НомерСтраницы : "."}</td>

                                        {WS_Clock.Буффер.map((Буффер, y) => (
                                            <td key={`${y}_${Буффер.length * Math.random()}`} style={{padding: 0, border: 0}}>
                                                <td className={cn({
                                                    ["red jir"]: Clacc[index][y * 4 + 3] === 1,
                                                    ["jir"]: Clacc[index][y * 4 + 3] !== 1,
                                                })}>{Буффер.ТекущаяСтраница[index] !== -1 ? Буффер.ТекущаяСтраница[index] : "."} </td>
                                                <td>{Буффер.ТекущаяСтраница[index] !== -1 ? Буффер.БитОбращения[index] : "."} </td>
                                                <td className={cn({
                                                    ["green"]: Clacc[index][y * 4 + 5] === 3,
                                                })}>{Буффер.ТекущаяСтраница[index] !== -1 ? Буффер.БитИзменения[index] : "."} </td>
                                                <td>{Буффер.ТекущаяСтраница[index] !== -1 ? Буффер.ВремяПоследнегоИзменения[index] : "."} </td>
                                            </td>))}

                                        <td className="">{WS_Clock.Pf[index] !== -1 ? WS_Clock.Pf[index] : "."}</td>
                                    </tr>))}
                                </tbody>
                            </table>
                        </div>
                        <h4>NPF = {ЭФ_WS_Clock}</h4>
                        <div style={{width: 20}}/>
                    </div>
                    <div style={{height: 50}}/>
                </div>
            </Route>
            <Redirect to="/"/>
        </div>
    )
}