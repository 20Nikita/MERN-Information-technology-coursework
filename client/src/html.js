import {Redirect, Route} from "react-router-dom"
import React, {useEffect, useState} from 'react';
import cn from "classnames";
import { useHttp } from './hooks/http.hooks';
import materialize from "materialize-css";
import BannerBgImg1 from "./unnamed.jpg";



export const Rout = () =>{
  let [text, setText] = useState("")
  let [fifo, setfifo] = useState({Буффер: [],НомерСтраницы:[],Pf: []})
  let [ЭФ_fifo, setЭФ_fifo] = useState(0)
  let [WS_Clock, setWS_Clock] = useState({ИзмененноеВремяОбращения: [],
      ВремяОбращения: [], НомерСтраницы: [], Буффер:[], Pf: [], Стили: []})
  let [ЭФ_WS_Clock, setЭФ_WS_Clock] = useState(0)
  let t = ""
  let [Кнопка, setКнопка] = useState(0)
  let [ФайлПрочитан, setФайлПрочитан] = useState(0)
  const {loading, request, error, clearError}= useHttp()
  const[form, setForm] = useState({
    Название: "", 
    РазмерБуффера: 0, 
    КоличествоЭлементов: 0, 
    КоличествоСтраниц: 0,
    РабочееМножество: 0, 
    СбросОбращения: 0,
    ВЗД: 0,
    Содержимое: []
  })
  useEffect( () => {
      clearError()
      if (window.M && error) {
        window.M.toast({html: error})
      }
      if (error) {setText(error) }
    }, [error,clearError])

  const ОбновитьФорму = event =>{
    setForm({ ...form, [event.target.name]: event.target.value})        
  }
  
  const ClearForm = event =>{
    document.getElementById("Название").value = ""
    document.getElementById("РазмерБуффера").value = ""
    document.getElementById("КоличествоЭлементов").value = ""
    document.getElementById("КоличествоСтраниц").value = ""
    document.getElementById("РабочееМножество").value = ""
    document.getElementById("СбросОбращения").value = ""
    document.getElementById("ВЗД").value = ""
    form.Название = 0
    form.РазмерБуффера = 0
    form.КоличествоЭлементов = 0
    form.КоличествоСтраниц = 0
    form.РабочееМножество = 0
    form.СбросОбращения = 0
    form.ВЗД = 0
    form.Содержимое = []
  }
  let [КогоЗагрузить, setКогоЗагрузить] = useState(-1)
  const ОбновитьSelect = event =>{
    setКогоЗагрузить(event.target.value)
    setФайлПрочитан(0)
    if(event.target.value !== "0"){
      document.getElementById("Название").value = СохранДанные[event.target.value-1].Название
      document.getElementById("РазмерБуффера").value = СохранДанные[event.target.value-1].РазмерБуффера
      document.getElementById("КоличествоЭлементов").value = СохранДанные[event.target.value-1].КоличествоЭлементов
      document.getElementById("КоличествоСтраниц").value = СохранДанные[event.target.value-1].КоличествоСтраниц
      document.getElementById("РабочееМножество").value = СохранДанные[event.target.value-1].РабочееМножество
      document.getElementById("СбросОбращения").value = СохранДанные[event.target.value-1].СбросОбращения
      document.getElementById("ВЗД").value = СохранДанные[event.target.value-1].ВЗД
      form.Название = СохранДанные[event.target.value-1].Название
      form.РазмерБуффера = СохранДанные[event.target.value-1].РазмерБуффера
      form.КоличествоЭлементов = СохранДанные[event.target.value-1].КоличествоЭлементов
      form.КоличествоСтраниц = СохранДанные[event.target.value-1].КоличествоСтраниц
      form.РабочееМножество = СохранДанные[event.target.value-1].РабочееМножество
      form.СбросОбращения = СохранДанные[event.target.value-1].СбросОбращения
      form.ВЗД = СохранДанные[event.target.value-1].ВЗД
    }
  }
  let [СохранДанные, setСохранДанные] = useState([])
  useEffect( () => {
    var elems = document.querySelector('select');
    elems.length = 2
    materialize.FormSelect.init(elems, materialize.options);
    for (let index = 0; index < СохранДанные.length; index++) {
      var elems = document.querySelector('select');
      elems.add(new Option(`${СохранДанные[index].Название}`,`${index+1}`))
      materialize.FormSelect.init(elems, materialize.options);
    }
    if(Кнопка==0)
    elems.value = -1
    if(Кнопка==1)
    elems.value = КогоЗагрузить
    if(Кнопка==2){
      elems.value = СохранДанные.length
      setКогоЗагрузить(СохранДанные.length)
      }
    if(Кнопка==3){
      setКогоЗагрузить(-1)
      elems.value = -1
    }
    materialize.FormSelect.init(elems, materialize.options);
  }, [СохранДанные])
  const ЧтениеДанных = async () => {
    try{
      const data = await request("/api/start/Get", "get")
      if (window.M && data.message) {
          window.M.toast({html: data.message})
      }
      setСохранДанные(data.exists)
    } catch (e) {}
  }
  let [Загрузить, setЗагрузить] = useState(true)
  if(Загрузить){
    ЧтениеДанных()
    setЗагрузить(!Загрузить)
  }

  
  const Пичать = (data) =>{
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
  const ЗагрузитьДанные = async () => {
    try{
      if(СохранДанные[КогоЗагрузить-1]){
        const data = await request("/api/start/getOne", "POST", СохранДанные[КогоЗагрузить-1])
        if (window.M && data.message) {
            window.M.toast({html: data.message})
        }
        data.fifo = await JSON.parse(data.fifo)
        data.WS_Clock = await JSON.parse(data.WS_Clock)
        setКнопка(1)
        Пичать(data.source)
        setfifo({Буффер: [],НомерСтраницы:[],Pf: []})
        setWS_Clock({ИзмененноеВремяОбращения: [], ВремяОбращения: [], НомерСтраницы: [], Буффер:[], Pf: [], Стили: []})
        clacc(data.WS_Clock.Стили,data.WS_Clock.Pf.length - 1,data.WS_Clock.Буффер.length*4+3)
        setfifo(data.fifo)
        t=0
        for (let i = 0; i < data.fifo.Pf.length; i++) {
          t+=data.fifo.Pf[i]
        }
        setЭФ_fifo(t)
        t=0
        for (let i = 0; i < data.WS_Clock.Pf.length; i++) {
          if(data.WS_Clock.Pf[i]!=-1)
            t+=data.WS_Clock.Pf[i]
        }
        setЭФ_WS_Clock(t)
        setЗагрузить(!Загрузить)
        setWS_Clock(data.WS_Clock)
        console.log(data.WS_Clock.Стили)
      }
    } catch (e) {console.log(e)}
  }

  const Сгенерировать = async () => {
    try{
      form.Содержимое = await request("/api/start/Gen", "POST", {...form})
      form.Содержимое = form.Содержимое.Содержимое
      const data = await request("/api/start/Add", "POST", {...form})
      if (window.M && data.message) {
        window.M.toast({html: data.message})
      }
      setКнопка(2)
      setЗагрузить(!Загрузить)
      data.fifo = await JSON.parse(data.fifo)
      data.WS_Clock = await JSON.parse(data.WS_Clock)
      Пичать(form)
      setfifo({Буффер: [],НомерСтраницы:[],Pf: []})
      setWS_Clock({ИзмененноеВремяОбращения: [], ВремяОбращения: [], НомерСтраницы: [], Буффер:[], Pf: []})
      clacc(data.WS_Clock.Стили,data.WS_Clock.Pf.length,data.WS_Clock.Буффер.length*4+3)
      setfifo(data.fifo)
      setWS_Clock(data.WS_Clock)
      t=0
      for (let i = 0; i < data.fifo.Pf.length; i++) {
        t+=data.fifo.Pf[i]
      }
      setЭФ_fifo(t)
      t=0
      for (let i = 0; i < data.WS_Clock.Pf.length; i++) {
        if(data.WS_Clock.Pf[i]!=-1)
          t+=data.WS_Clock.Pf[i]
      }
      setЭФ_WS_Clock(t)
    } catch (e) {console.log(e)}
  }

  const УдалениеДанных = async () => {
    try{
      if(СохранДанные[КогоЗагрузить-1]){
        const data = await request("/api/start/Delete", "delete", СохранДанные[КогоЗагрузить-1])
        if (window.M && data.message) {
            window.M.toast({html: data.message})
        }
        t =  data.message
        setКнопка(3)
        setText(t)
        setЗагрузить(!Загрузить)
        setfifo({Буффер: [],НомерСтраницы:[],Pf: []})
        setWS_Clock({ИзмененноеВремяОбращения: [],
        ВремяОбращения: [], НомерСтраницы: [], Буффер:[], Pf: [], Стили: []})
        setЭФ_fifo(0)
        setЭФ_WS_Clock(0)
        if (data.message)
          setText(data.message)
      }
    } catch (e) {}
  }
  let [Clacc, setClacc] = useState("")
  const clacc = async (Стили,x,y) => {
    t = Array.from(Array(x), () => new Array(y))
    
    for (let i = 0; i < Стили.length; i++) {
      t[Стили[i][0]][Стили[i][1]] = Стили[i][2]
    }
    setClacc(t)
    console.log(t)
  }
  return(
    <div>
      <Route path = "/" exact>
        <div className = "vertical">
          <div style={{height: 20}}></div>
          <div className = "item">
            <div className = "horizontal ">
              <div className = "item zag3 zag4">
                <div className = "centr catr">
                  <div className="card blue-grey darken-1" style={{margin:0}}>
                    <div className="card-content white-text">
                      <span className="card-title cen zag1">Загрузить данные</span>
                        <div style={{height: 5}}></div>
                        <div className=" horizontal input-field">
                          <div className="item">
                            <div className="btn zag4 notBor t">
                            <select onChange={ОбновитьSelect} class="materialSelect" id="myDropdown">
                                <option value="-1" disabled selected name="Название">ОТКУДА?</option>
                                <optgroup label="с файла">
                                  <option value="0">С файла</option>
                                </optgroup>
                                <optgroup label="с сервера">
                                </optgroup>
                              </select>
                            </div>
                          </div>
                          <div style={{width: 10}}></div>
                            <button className="waves-effect waves-light btn item zag4" 
                            onClick = {ЗагрузитьДанные}
                            disabled = {!((КогоЗагрузить != -1) * !loading)}
                            >Загрузить</button>
                      </div>
                      <div style={{height: 30}}></div>
                      <span className="card-title cen zag2">Сгенерировать новые</span>
                      <div style={{height: 5}}></div>
                      <div>
                        <div className="input-field">
                          <div className = "horizontal">
                            <p className = "cen "
                            style={{width: 200}}
                            >Название</p>

                            <input placeholder="Должно быть уникальным"
                            style={{height: 30 }}
                            id="Название" 
                            name="Название" 
                            type="text" 
                            className="validate cen" 
                            onChange={ОбновитьФорму}/>
                          <div style={{width: 20}}></div>
                          <button className="waves-effect waves-light btn zag4 ing"
                          onClick = {ClearForm}></button>
                      
                          </div>

                          <div className = "horizontal">
                            <p className = "cen"
                            style={{width: 350}}
                            >Размер буффера</p>

                            <input placeholder=" > 0" 
                            id="РазмерБуффера" 
                            name="РазмерБуффера" 
                            type="Number" 
                            className="validate rig" 
                            onChange={ОбновитьФорму}/>
                          </div>

                          <div className = "horizontal">
                            <p className = "cen"
                            style={{width: 350}}
                            >Количество элементов</p>

                            <input placeholder=" > 0 " 
                            id="КоличествоЭлементов" 
                            name="КоличествоЭлементов" 
                            type="Number" 
                            className="validate rig" 
                            onChange={ОбновитьФорму}/>
                          </div>

                          <div className = "horizontal">
                            <p className = "cen"
                            style={{width: 350}}
                            >Количество страниц</p>

                            <input placeholder=" > 0 "
                            id="КоличествоСтраниц" 
                            name="КоличествоСтраниц" 
                            type="Number" 
                            className="validate rig" 
                            onChange={ОбновитьФорму}/>
                          </div>

                          <div className = "horizontal">
                            <p className = "cen"
                            style={{width: 350}}
                            >Рабочее множество</p>

                            <input placeholder=" > 0 " 
                            id="РабочееМножество" 
                            name="РабочееМножество" 
                            type="Number" 
                            className="validate rig" 
                            onChange={ОбновитьФорму}/>
                          </div>

                          <div className = "horizontal">
                              <p className = "cen"
                              style={{width: 350}}
                              >Время сброса обращения</p>

                              <input placeholder=" > 2 " 
                              id="СбросОбращения" 
                              name="СбросОбращения" 
                              type="Number" 
                              className="validate rig" 
                              onChange={ОбновитьФорму}/>
                            </div>

                            <div className = "horizontal">
                              <p className = "cen"
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
                          onClick = {Сгенерировать}
                          disabled = {loading}
                          >Сгенерировать</button>
                          <div style={{width: 10}}></div>
                          <button className="waves-effect waves-light btn item zag4" 
                          style={{}}
                          onClick = {УдалениеДанных}
                          disabled = {!((КогоЗагрузить != -1 * ФайлПрочитан) * !loading)}
                          >Удалить</button>
                      </div>
                  </div>
                </div>
              </div>
                <div className = "item">
                <div className="scrol centr text becc">
                  <pre >{text}</pre>
                </div>
              </div>
            </div>
            </div>

            <div className = "item ots">
                  <h2>fifo</h2>
                  <div className = "tabl becc">
                    <table className="responsive-table1">
                      <thead>
                        <tr>
                            <th>N:</th>
                            {fifo.Буффер.map((Буффер) => (
                                    <th>{Буффер[0]}</th>
                                ))}
                            <th>PF:</th>
                        </tr>
                      </thead>
                      <tbody>
                      {fifo.НомерСтраницы.map((НомерСтраницы, index) => (
                        <tr>
                          <td>{НомерСтраницы}</td>
                          {fifo.Буффер.map((Буффер) => (
                              <td>{ Буффер[index+1] !=-1 ? Буффер[index+1] : "."} </td> ))}

                          <td>{fifo.Pf[index]}</td>
                        </tr>))}
                      </tbody>
                    </table>
                  </div>
                  <h4>NPF = {ЭФ_fifo}</h4>
                  <h2>WS_Clock</h2>
                  <div className = "tabl becc">
                    <table className="responsive-table1">
                      <thead>
                        <tr>
                        <th>ИВО:</th>
                        <th>ВО:</th>
                            <th>ОП:</th>
                            {WS_Clock.Буффер.map((t,i) => (
                              <td style={{padding:0,border:0}}>
                              <th>{i}</th>
                              <th>БО</th>
                              <th>БИ</th>
                              <th>ВПИ</th>
                              </td>
                            ))}
                            <th>PF:</th>
                        </tr>
                      </thead>
                      <tbody>
                      {WS_Clock.НомерСтраницы.map((НомерСтраницы, index) => (
                        <tr>
                          <td>{WS_Clock.ИзмененноеВремяОбращения[index] !=-1 ? WS_Clock.ИзмененноеВремяОбращения[index] : "."}</td>
                          <td className = {cn({
                            ["green"]: Clacc[index][1] === 3
                          })}>{WS_Clock.ВремяОбращения[index] !=-1 ? WS_Clock.ВремяОбращения[index] : "."}</td>
                          
                          <td className = {cn({
                            ["yellow"]: Clacc[index][2] === 2,
                        })}>{НомерСтраницы !=-1 ? НомерСтраницы : "."}</td>
                          
                          {WS_Clock.Буффер.map((Буффер,y) => (
                            <td style={{padding:0,border:0}}>
                              <td className = {cn({
                                ["red jir"]: Clacc[index][y*4+3] === 1,
                                ["jir"]: Clacc[index][y*4+3] !== 1, 
                                })}>{ Буффер.ТекущаяСтраница[index] !=-1 ? Буффер.ТекущаяСтраница[index] : "."} </td>
                              <td>{ Буффер.ТекущаяСтраница[index] !=-1 ? Буффер.БитОбращения[index] : "."} </td>
                              <td className = {cn({
                                ["green"]: Clacc[index][y*4+5] === 3, 
                                })}>{ Буффер.ТекущаяСтраница[index] !=-1 ? Буффер.БитИзменения[index] : "."} </td>
                              <td>{ Буффер.ТекущаяСтраница[index] !=-1 ? Буффер.ВремяПоследнегоИзменения[index] : "."} </td>
                              </td>))}

                      <td className="">{WS_Clock.Pf[index] !=-1 ? WS_Clock.Pf[index] : "."}</td>
                    </tr>))}
                  </tbody>
                </table>
              </div>
              <h4>NPF = {ЭФ_WS_Clock}</h4>
            <div style={{width: 20}}></div>
            </div>
            <div style={{height: 50}}></div>
          </div>
        </Route>
      <Redirect to ="/"/>
    </div>
  )
}