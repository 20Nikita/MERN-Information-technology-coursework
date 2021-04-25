import {Redirect, Route} from "react-router-dom"
import React, {useEffect, useState} from 'react';
import { useHttp } from './hooks/http.hooks';
import { Генерация } from './Генерация';

export const Rout = () =>{
    let [text, setText] = useState("")
    let [tabl, settabl] = useState({Буффер: [],НомерСтраницы:[],Ft: []})
    let t = ""
    const {loading, request, error, clearError}= useHttp()
    const[form, setForm] = useState({
      Название: "", 
      РазмерБуффера: 0, 
      КоличествоЭлементов: 0, 
      КоличествоСтраниц: 0,
      РабочееМножество: 0, 
      СбросОбращения: 0,
      Содержимое: []
    })
    useEffect( () => {
        clearError()
        if (window.M && error) {
            window.M.toast({html: error})
            setText(error) 
        }
    }, [error,clearError])

    const ОбновитьФорму = event =>{
        setForm({ ...form, [event.target.name]: event.target.value})        
      }

      const ОтправитьФорму = async () => {
        try{
          form.Содержимое = Генерация(form.КоличествоСтраниц,form.КоличествоЭлементов,form.СбросОбращения)
          Пичать(form)
          const data = await request("/api/start/Add", "POST", {...form})
            if (window.M && data.message) {
                window.M.toast({html: data.message})
            }

        } catch (e) {}
      }
      const Пичать = (data, fifo = null) =>{
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
        t += "\nСодержимое: ["
        for (let index = 0; index < data.Содержимое.length; index++) {
          t += "\nНомер cтраницы: "
          t += data.Содержимое[index].НомерСтраницы
          t += " Время обращения: "
          t += data.Содержимое[index].ВремяОбращения
          t += " Запись: "
          t += data.Содержимое[index].Запись
        }
        t += "\n]\n"
        setText(t) 
      }
      const СчитатьДанных = async () => {
        try{
          const data = await request("/api/start/getOne", "POST", {...form})
            if (window.M && data.message) {
                window.M.toast({html: data.message})
            }
            data.fifo = await JSON.parse(data.fifo)
            Пичать(data.source,data.fifo)
            console.log(data.fifo)
            settabl({Буффер: [],НомерСтраницы:[],Ft: []})
            settabl(data.fifo)
        } catch (e) {console.log(e)}
      }

      const ЧтениеДанных = async () => {
        try{
          const data = await request("/api/start/Get", "get")
            if (window.M && data.message) {
                window.M.toast({html: data.message})
            }
        t = ""
        for (let index = 0; index < data.exists.length; index++) {
            t += data.exists[index].Название
            t +="\n"
        }
        setText(t) 
        } catch (e) {}
      }

      const УдалениеДанных = async () => {
        try{
          const data = await request("/api/start/Delete", "delete", {...form})
            if (window.M && data.message) {
                window.M.toast({html: data.message})
            }
        } catch (e) {}
      }

    

    

    return(
        <div>
            <Route path = "/" exact>
                    <div className="container">
                    <div className = "row">
                    <div className = "col s6 offset-s3" >
                    <div className="card blue-grey darken-1">
                        <div className="card-content white-text">
                            <span className="card-title">Что мне сделать?</span>
                            <div>

                                <div className="input-field">
                                <input placeholder="Название"
                                id="Название" 
                                name="Название" 
                                type="text" 
                                className="validate" 
                                onChange={ОбновитьФорму}/>
            
                                <button className="waves-effect waves-light btn" style={{marginRight: 10}}
                                onClick = {СчитатьДанных}
                                >считать данные</button>

                                <button className="waves-effect waves-light btn" style={{marginRight: 10}}
                                onClick = {УдалениеДанных}
                                >Удалить данные</button>

                                <input placeholder="Размер буффера" 
                                id="РазмерБуффера" 
                                name="РазмерБуффера" 
                                type="Number" 
                                className="validate" 
                                onChange={ОбновитьФорму}/>

                                <input placeholder="Количество элементов" 
                                id="КоличествоЭлементов" 
                                name="КоличествоЭлементов" 
                                type="Number" 
                                className="validate" 
                                onChange={ОбновитьФорму}/>

                                <input placeholder="Количество страниц" 
                                id="КоличествоСтраниц" 
                                name="КоличествоСтраниц" 
                                type="Number" 
                                className="validate" 
                                onChange={ОбновитьФорму}/>

                                <input placeholder="Рабочее множество" 
                                id="РабочееМножество" 
                                name="РабочееМножество" 
                                type="Number" 
                                className="validate" 
                                onChange={ОбновитьФорму}/>

                                <input placeholder="Время сброса обращения" 
                                id="СбросОбращения" 
                                name="СбросОбращения" 
                                type="Number" 
                                className="validate" 
                                onChange={ОбновитьФорму}/>
                                </div>
                            </div>
                        </div>
                        <div className="card-action">

                            <button className="waves-effect waves-light btn" style={{marginRight: 10}}
                            onClick = {ОтправитьФорму}
                            disabled = {loading}
                            >Сгенерировать данные</button>
                            
                            <button className="waves-effect waves-light btn" style={{marginRight: 10}}
                            onClick = {ЧтениеДанных}
                            >прочитать данные</button>

                        </div>
                    </div>
                    </div>
                    <div className="container">
                    <pre>{text}</pre>
                    </div>
                    </div>
                    </div>

                     
                    <table className="responsive-table highlight">
                      <thead>
                        <tr>
                            <th>N:</th>
                            {tabl.Буффер.map((Буффер) => (
                                    <th>{Буффер[0]}</th>
                                ))}
                            <th>PF:</th>
                        </tr>
                      </thead>
                      <tbody>
                      {tabl.НомерСтраницы.map((НомерСтраницы, index) => (
                        <tr>
                          <td>{НомерСтраницы}</td>
                          {tabl.Буффер.map((Буффер) => (
                              <td>{ Буффер[index+1] !=-1 ? Буффер[index+1] : "!"} </td> ))}

                          <td>{tabl.Pf[index]}</td>
                        </tr>))}

                      </tbody>
                    </table>
                    
            </Route>
            <Redirect to ="/"/>
        </div>
    )
}