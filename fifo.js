
const WsKlok = (РазмерБуффера, КоличествоЭлементов, РабочееМножество, СбросОбращения,
    НомерСтраницы,ВремяОбращения,Запись) =>{
    let масив = {}
    масив.ИзмененноеВремяОбращения = [1,2]
    масив.ВремяОбращения = [1,2]
    масив.НомерСтраницы = [1,2]
    масив.Буффер = []
    масив.Pf = []

    let Буффер = {}
    Буффер.БитОбращения = [1,2]
    Буффер.БитИзменения = [1,2]
    Буффер.ВремяПоследнегоИзменения = [1,2]
    for (let index = 0; index < РазмерБуффера; index++) {
        масив.Буффер.push(Буффер)
    }

    for (let i = 0; i < КоличествоЭлементов; i++) {
        const element = array[i];
        
    }
    return масив
}




const fifo = (РазмерБуффера, Содержимое) =>{
    let f = 0
    let масив = {}
    масив.НомерСтраницы = []
    масив.Буффер = []
    масив.Pf = []
 
    for (let index = 1; index <= РазмерБуффера; index++)
        масив.Буффер.push([index])
    масив.Pf.push(1)
    for (let j = 0; j < Содержимое.length; j++){
        масив.НомерСтраницы.push(Содержимое[j].НомерСтраницы)
        for (let index = 0; index < РазмерБуффера; index++)
            масив.Буффер[index].push(-1)}
    for (let index = 0; index < РазмерБуффера; index++)
        масив.Буффер[0][1]=масив.НомерСтраницы[0]

    for (let i = 2; i <= Содержимое.length; i++) {
        f = 0
        for (let j = 0; j < РазмерБуффера; j++){
            if(масив.Буффер[j][i-1] == масив.НомерСтраницы[i-1]){
                f = 1
            }
        }
        if(!f){
            масив.Буффер[0][i] = масив.НомерСтраницы[i-1]
            for (let j = 1; j < РазмерБуффера; j++)
                масив.Буффер[j][i] = масив.Буффер[j-1][i-1]
            масив.Pf.push(1)
        } else{
            for (let j = 0; j < РазмерБуффера; j++)
                масив.Буффер[j][i] = масив.Буффер[j][i-1]
            масив.Pf.push(0)
        }
    }
    return масив
}

module.exports = {
    fifo: fifo
}