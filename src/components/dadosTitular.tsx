
import { FormWrapper } from "./organizador";
import InputMask from 'react-input-mask'




interface CidadesProps  {
  id_cidade: number,
  estado: number,
  uf: string,
  cidade: string
}
interface TitularProps{
  name:string,
  nasc:Date,
  sexo:string,
  cep:string,
  endereco:string,
  numero:number,
  profissao:string,
  bairro:string,
  referencia:string,
  uf:string,
  cidade:string,
  rg:string,
  cpf:string,
  naturalidade:string,
  email:string,
  celular1:string,
  celular2:string,
  telefone:string,
  cidades:Array<Partial<CidadesProps>>
}
interface DadosProps{
 // titular:Partial<TitularProps>
  dadosTitular:Partial<TitularProps>
  setarDados: (fields:Partial<TitularProps>)=>void
}

export function Item({dadosTitular,setarDados}:DadosProps){

 // const {dadosTitular,closeModa}= useContext(AuthContext)
 


  



    return(
        <FormWrapper title="DADOS DO TITULAR">
        <div className="flex flex-col   gap-9 p-4 rounded-lg w-full h-full ">
        <div  className="grid gap-2 grid-flow-c-dense pl-2 pr-2 w-full  md:grid-cols-4" >
        
        <div className="col-span-2">
          <label  className="block mb-1 text-sm font-medium  text-white">NOME</label>
          <input autoComplete='off' value={dadosTitular.name} onChange={e=>setarDados({...dadosTitular,name:e.target.value.toUpperCase()})}  type="text" required className="block uppercase w-full pb-1 pt-1 pr-2 pl-2 sm:text-sm border  rounded-lg bg-gray-50  dark:bg-gray-700 border-gray-600 placeholder-gray-400 text-white "/>
          </div>
          <div className="col-span-1">
          <label  className="block mb-1 text-sm font-medium  text-white">NASCIMENTO</label>
          <input value={dadosTitular.nasc && new Date(dadosTitular.nasc).toLocaleDateString('pt',{timeZone:'UTC'})} onChange={e=>setarDados({...dadosTitular,nasc:new Date(e.target.value)})} type="date" required className="block uppercase w-full pb-1 pt-1 pr-2 pl-2  border  rounded-lg bg-gray-50 sm:text-sm dark:bg-gray-700 border-gray-600 placeholder-gray-400 text-white "/>
          </div>
          <div className="col-span-1">
          <label   className="block mb-1 text-sm font-medium text-gray-900 dark:text-white">SEXO</label>
            <select value={dadosTitular.sexo} onChange={e=>setarDados({...dadosTitular,sexo:e.target.value.toUpperCase()})} className="block w-full pb-1 pt-1 pr-2 pl-2  text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
              <option   selected></option>
              <option   value="M">MASCULINO</option>
              <option   value="F">FEMININO</option>
            </select>
          </div>
       
        <div className="col-span-1">
          <label  className="block mb-1 text-sm font-medium  text-white">CEP</label>
          <InputMask value={dadosTitular.cep} onChange={e=>setarDados({...dadosTitular,cep:e.target.value})} mask={'99999-9999'} type="text" required className="block uppercase w-full pb-1 pt-1 pr-2 pl-2 sm:text-sm border  rounded-lg bg-gray-50  dark:bg-gray-700 border-gray-600 placeholder-gray-400 text-white "/>
          </div>
          <div className="col-span-2">
          <label  className="block mb-1 text-sm font-medium  text-white">ENDEREÇO</label>
          <input value={dadosTitular.endereco} onChange={e=>setarDados({...dadosTitular,endereco:e.target.value.toUpperCase()})} autoComplete="off" type="text" required className="block uppercase w-full pb-1 pt-1 pr-2 pl-2 sm:text-sm border  rounded-lg bg-gray-50  dark:bg-gray-700 border-gray-600 placeholder-gray-400 text-white "/>
          </div>
          <div className="col-span-1">
          <label  className="block mb-1 text-sm font-medium  text-white">NUMERO</label>
          <input value={dadosTitular.numero} onChange={e=>setarDados({...dadosTitular,numero:Number(e.target.value)})} autoComplete="off" type="number" required className="block uppercase w-full pb-1 pt-1 pr-2 pl-2 sm:text-sm  border  rounded-lg bg-gray-50  dark:bg-gray-700 border-gray-600 placeholder-gray-400 text-white "/>
          </div>
          <div className="col-span-1">
          <label  className="block mb-1 text-sm font-medium  text-white">BAIRRO</label>
          <input value={dadosTitular.bairro} onChange={e=>setarDados({...dadosTitular,bairro:e.target.value.toUpperCase()})} autoComplete="off" type="text" required className="block uppercase w-full pb-1 pt-1 pr-2 pl-2 sm:text-sm border  rounded-lg bg-gray-50  dark:bg-gray-700 border-gray-600 placeholder-gray-400 text-white "/>
          </div>
          <div className="col-span-2">
          <label  className="block mb-1 text-sm font-medium  text-white">PONTO REF</label>
          <input value={dadosTitular.referencia} onChange={e=>setarDados({...dadosTitular,referencia:e.target.value.toUpperCase()})} autoComplete="off" type="text" required className="block uppercase w-full pb-1 pt-1 pr-2 pl-2 sm:text-sm border  rounded-lg bg-gray-50 dark:bg-gray-700 border-gray-600 placeholder-gray-400 text-white "/>
          </div>
          <div className="col-span-1">
          <label  className="block mb-1 text-sm font-medium text-gray-900 dark:text-white">UF</label>
            <select value={dadosTitular.uf} onChange={e=>setarDados({...dadosTitular,uf:e.target.value.toUpperCase()})} className="block w-full pb-1 pt-1 pr-2 pl-2 sm:text-sm   text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
              <option selected></option>
             
                  <option>AC</option>
                  <option>AL</option>
                  <option>AM</option>
                  <option>AP</option>
                  <option>BA</option>
                  <option>CE</option>
                  <option>DF</option>
                  <option>ES</option>
                  <option>GO</option>
                  <option>MA</option>
                  <option>MG</option>
                  <option>MS</option>
                  <option>MT</option>
                  <option>DF</option>
                  <option>PA</option>
                  <option>PB</option>
                  <option>PE</option>
                  <option>PI</option>
                  <option>PR</option>
                  <option>RJ</option>
                  <option>RN</option>
                  <option>RO</option>
                  <option>RR</option>
                  <option>RS</option>
                  <option>SC</option>
                  <option>SE</option>
                  <option>SP</option>
                  <option>TO</option>

                
              
            </select>
          </div>
          <div className="col-span-1">
          <label  className="block mb-1 text-sm font-medium text-gray-900 dark:text-white">CIDADE</label>
            <select value={dadosTitular.cidade} onChange={e=>setarDados({...dadosTitular,cidade:e.target.value.toUpperCase()})} className="block w-full pb-1 pt-1 pr-2 pl-2 sm:text-sm  text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
              <option selected></option>
                {dadosTitular.cidades?.map((item)=>{
                  return(
                      item.uf===dadosTitular.uf?(<option>{item.cidade}</option>):''
                  )
                })}
            </select>
          </div>
          <div className="col-span-1">
          <label  className="block mb-1 text-sm font-medium  text-white">RG</label>
          <input value={dadosTitular.rg} onChange={e=>setarDados({...dadosTitular,rg:e.target.value})} autoComplete="off" type="text" required className="block uppercase w-full pb-1 pt-1 pr-2 pl-2 sm:text-sm border  rounded-lg bg-gray-50  dark:bg-gray-700 border-gray-600 placeholder-gray-400 text-white "/>
          </div>
          <div className="col-span-1">
          <label  className="block mb-1 text-sm font-medium  text-white">CPF</label>
          <InputMask mask={'999.999.999-99'}  value={dadosTitular.cpf} onChange={e=>setarDados({cpf:e.target.value})} autoComplete="off" type="text" required className="block uppercase w-full pb-1 pt-1 pr-2 pl-2 sm:text-sm border  rounded-lg bg-gray-50  dark:bg-gray-700 border-gray-600 placeholder-gray-400 text-white "/>
          </div>
          <div className="col-span-1">
          <label  className="block mb-1 text-sm font-medium  text-white">NATURALIDADE</label>
          <input value={dadosTitular.naturalidade} onChange={e=>setarDados({...dadosTitular,naturalidade:e.target.value.toUpperCase()})} autoComplete="off" type="text" required className="block uppercase w-full pb-1 pt-1 pr-2 pl-2 sm:text-sm border  rounded-lg bg-gray-50  dark:bg-gray-700 border-gray-600 placeholder-gray-400 text-white "/>
          </div>
          <div className="col-span-1">
          <label  className="block mb-1 text-sm font-medium  text-white">EMAIL</label>
          <input value={dadosTitular.email} onChange={e=>setarDados({...dadosTitular,email:e.target.value.toUpperCase()})} autoComplete="off" type="text" required className="block uppercase w-full pb-1 pt-1 pr-2 pl-2 sm:text-sm border  rounded-lg bg-gray-50  dark:bg-gray-700 border-gray-600 placeholder-gray-400 text-white "/>
          </div>
          <div className="col-span-1">
          <label  className="block mb-1 text-sm font-medium  text-white">CELULAR1</label>
          <InputMask value={dadosTitular.celular1} onChange={e=>setarDados({...dadosTitular,celular1:e.target.value})} mask={'(99) 9 9999-9999'} type="text" required className="block uppercase w-full pb-1 pt-1 pr-2 pl-2 sm:text-sm border  rounded-lg bg-gray-50  dark:bg-gray-700 border-gray-600 placeholder-gray-400 text-white "/>
          </div>
          <div className="col-span-1">
          <label  className="block mb-1 text-sm font-medium  text-white">CELULAR2</label>
          <InputMask value={dadosTitular.celular2} onChange={e=>setarDados({...dadosTitular,celular2:e.target.value})} mask={'(99) 9 9999-9999'} type="text"  className="block uppercase w-full pb-1 pt-1 pr-2 pl-2 sm:text-sm border  rounded-lg bg-gray-50  dark:bg-gray-700 border-gray-600 placeholder-gray-400 text-white "/>
          </div>
          <div className="col-span-1">
          <label  className="block mb-1 text-sm font-medium  text-white">TELEFONE</label>
          <InputMask value={dadosTitular.telefone} onChange={e=>setarDados({...dadosTitular,telefone:e.target.value})} mask={'(99) 9 9999-9999'} type="text"  className="block uppercase w-full pb-1 pt-1 pr-2 pl-2 sm:text-sm border  rounded-lg bg-gray-50  dark:bg-gray-700 border-gray-600 placeholder-gray-400 text-white "/>
          </div>
        </div>
        </div>
      </FormWrapper>
    )
}