import DatePicker,{registerLocale} from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import pt from 'date-fns/locale/pt-BR';
import ReactInputMask from "react-input-mask";


interface FuncionarioProps{
    id_consultor:number|null,
    nome: string,
    cpf: string,
    rg: string,
    data_nascimento: Date | null,
    cep: string,
    endereco: string,
    numero: string,
    bairro: string,
    cidade: string,
    uf: string,
    telefone: string,
    email: string,
    dt_admissao: Date | null,
    cnh_categoria: string,
    titulo_eleitor: string,
    zona: number,
    secao: number,
    pis_pasep: string,
    grau_instrucao: string,
    nome_conjuge: string,
    n_dependentes: number,
    menores_14: number,
    caso_emergencia: string,
    salario: number,
    contrato_exp: number,
    prorrogacao_cont: number,
    situacao: string,
  
}
interface ModalProps{
    setarDadosFuncionario:(fields:Partial<FuncionarioProps>)=>void,
    dadosFuncionario:Partial<FuncionarioProps>
}

export  function ModalDadosFuncionario({setarDadosFuncionario,dadosFuncionario}:ModalProps) {
    
    return (
        <div className=" flex flex-col  p-4 rounded-lg  shadow bg-gray-800">

            <h1 className="flex flex-row justify-start mb-4 border-b-[1px] text-lg border-gray-500 font-semibold mt-2 gap-2 text-white">DADOS FUNCIONÁRIO</h1>
            <div className="grid  grid-cols-4 gap-2  w-full">
                <div className=" col-span-2">
                    <label className="block  text-xs font-medium  text-white">NOME COMPLETO</label>
                    <input type="text" value={dadosFuncionario.nome} onChange={e => {setarDadosFuncionario({...dadosFuncionario,nome:e.target.value}) }} className="block w-full  pt-1 pb-1 pl-2 pr-2  border  rounded-lg  sm:text-xs  bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500" />
                </div>

                <div className=" col-span-1">
                    <label className="block  text-xs font-medium  text-white">CPF</label>
                    <ReactInputMask mask={'999.999.999-99'} value={dadosFuncionario.cpf} onChange={e => {setarDadosFuncionario({...dadosFuncionario,cpf:e.target.value}) }} className="block w-full  pt-1 pb-1 pl-2 pr-2  border  rounded-lg  sm:text-xs  bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500" />
                </div>
                <div className=" col-span-1">
                    <label className="block  text-xs font-medium  text-white">RG</label>
                    <input type="text" value={dadosFuncionario.rg} onChange={e => {setarDadosFuncionario({...dadosFuncionario,rg:e.target.value}) }} className="block w-full  pt-1 pb-1 pl-2 pr-2  border  rounded-lg  sm:text-xs  bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500" />
                </div>
                <div className=" col-span-1">
                    <label className="block  text-xs font-medium  text-white">NASCIMENTO</label>
                    <DatePicker selected={dadosFuncionario.data_nascimento} dateFormat={"dd/MM/yyyy"} locale={pt} onChange={e => setarDadosFuncionario({...dadosFuncionario,data_nascimento:e})} className="block w-full  pt-1 pb-1 pl-2 pr-2  border  rounded-lg  sm:text-xs  bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500" />
                </div>
                <div className=" col-span-1">
                    <label className="block  text-xs font-medium  text-white">CEP</label>
                    <input type="text" value={dadosFuncionario.cep} onChange={e => setarDadosFuncionario({...dadosFuncionario,cep:e.target.value})} className="block w-full  pt-1 pb-1 pl-2 pr-2  border  rounded-lg  sm:text-xs  bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500" />
                </div>
                <div className=" col-span-2">
                    <label className="block  text-xs font-medium  text-white">ENDEREÇO</label>
                    <input type="text" value={dadosFuncionario.endereco} onChange={e => setarDadosFuncionario({...dadosFuncionario,endereco:e.target.value})} className="block w-full  pt-1 pb-1 pl-2 pr-2  border  rounded-lg  sm:text-xs  bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500" />
                </div>
                <div className=" col-span-1">
                    <label className="block  text-xs font-medium  text-white">NÚMERO</label>
                    <input type="text" value={dadosFuncionario.numero} onChange={e => setarDadosFuncionario({...dadosFuncionario,numero:e.target.value})} className="block w-full  pt-1 pb-1 pl-2 pr-2  border  rounded-lg  sm:text-xs  bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500" />
                </div>
                <div className=" col-span-1">
                    <label className="block  text-xs font-medium  text-white">BAIRRO</label>
                    <input type="text" value={dadosFuncionario.bairro} onChange={e => setarDadosFuncionario({...dadosFuncionario,bairro:e.target.value})} className="block w-full  pt-1 pb-1 pl-2 pr-2  border  rounded-lg  sm:text-xs  bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500" />
                </div>
                <div className=" col-span-1">
                    <label className="block  text-xs font-medium  text-white">CIDADE</label>
                    <input type="text" value={dadosFuncionario.cidade} onChange={e =>  setarDadosFuncionario({...dadosFuncionario,cidade:e.target.value})} className="block w-full  pt-1 pb-1 pl-2 pr-2  border  rounded-lg  sm:text-xs  bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500" />
                </div>
                <div className=" col-span-1">
                    <label className="block  text-xs font-medium  text-white">UF</label>
                    <input type="text" value={dadosFuncionario.uf} onChange={e =>  setarDadosFuncionario({...dadosFuncionario,uf:e.target.value})} className="block w-full  pt-1 pb-1 pl-2 pr-2  border  rounded-lg  sm:text-xs  bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500" />
                </div>
                <div className=" col-span-1">
                    <label className="block  text-xs font-medium  text-white">TELEFONE</label>
                    <input type="text" value={dadosFuncionario.telefone} onChange={e =>  setarDadosFuncionario({...dadosFuncionario,telefone:e.target.value})} className="block w-full  pt-1 pb-1 pl-2 pr-2  border  rounded-lg  sm:text-xs  bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500" />
                </div>
                <div className=" col-span-1">
                    <label className="block  text-xs font-medium  text-white">E-MAIL</label>
                    <input type="text" value={dadosFuncionario.email} onChange={e =>  setarDadosFuncionario({...dadosFuncionario,email:e.target.value})} className="block w-full  pt-1 pb-1 pl-2 pr-2  border  rounded-lg  sm:text-xs  bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500" />
                </div>
                <div className=" col-span-1">
                    <label className="block  text-xs font-medium  text-white">DATA ADMISSÃO</label>
                    <DatePicker locale={pt} dateFormat={"dd/MM/yyyy"} selected={dadosFuncionario.dt_admissao} onChange={e =>  setarDadosFuncionario({...dadosFuncionario,dt_admissao:e})} className="block w-full  pt-1 pb-1 pl-2 pr-2  border  rounded-lg  sm:text-xs  bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500" />
                </div>
                <div className=" col-span-1">
                    <label className="block  text-xs font-medium  text-white">CNH_CATEGORIA</label>
                    <input type="text" value={dadosFuncionario.cnh_categoria} onChange={e =>  setarDadosFuncionario({...dadosFuncionario,cnh_categoria:e.target.value})} className="block w-full  pt-1 pb-1 pl-2 pr-2  border  rounded-lg  sm:text-xs  bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500" />
                </div>
                <div className=" col-span-1">
                    <label className="block  text-xs font-medium  text-white">TITULO ELEITOR</label>
                    <input type="text" value={dadosFuncionario.titulo_eleitor} onChange={e =>  setarDadosFuncionario({...dadosFuncionario,titulo_eleitor:e.target.value})} className="block w-full  pt-1 pb-1 pl-2 pr-2  border  rounded-lg  sm:text-xs  bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500" />
                </div>
                <div className=" col-span-1">
                    <label className="block  text-xs font-medium  text-white">ZONA</label>
                    <input type="number" value={dadosFuncionario.zona} onChange={e =>  setarDadosFuncionario({...dadosFuncionario,zona:Number(e.target.value)})} className="block w-full  pt-1 pb-1 pl-2 pr-2  border  rounded-lg  sm:text-xs  bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500" />
                </div>
                <div className=" col-span-1">
                    <label className="block  text-xs font-medium  text-white">SEÇÃO</label>
                    <input type="number" value={dadosFuncionario.secao} onChange={e =>  setarDadosFuncionario({...dadosFuncionario,secao:Number(e.target.value)})} className="block w-full  pt-1 pb-1 pl-2 pr-2  border  rounded-lg  sm:text-xs  bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500" />
                </div>
                <div className=" col-span-1">
                    <label className="block  text-xs font-medium  text-white">PIS/PASEP</label>
                    <input type="text" value={dadosFuncionario.pis_pasep} onChange={e =>  setarDadosFuncionario({...dadosFuncionario,pis_pasep:e.target.value})} className="block w-full  pt-1 pb-1 pl-2 pr-2  border  rounded-lg  sm:text-xs  bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500" />
                </div>
                <div className=" col-span-1">
                    <label className="block  text-xs font-medium  text-white">ESCOLARIDADE</label>
                    <input type="text" value={dadosFuncionario.grau_instrucao} onChange={e =>  setarDadosFuncionario({...dadosFuncionario,grau_instrucao:e.target.value})} className="block w-full  pt-1 pb-1 pl-2 pr-2  border  rounded-lg  sm:text-xs  bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500" />
                </div>
                <div className=" col-span-2">
                    <label className="block  text-xs font-medium  text-white">NOME CONJUGE</label>
                    <input type="text" value={dadosFuncionario.nome_conjuge} onChange={e =>  setarDadosFuncionario({...dadosFuncionario,nome_conjuge:e.target.value})} className="block w-full  pt-1 pb-1 pl-2 pr-2  border  rounded-lg  sm:text-xs  bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500" />
                </div>
                <div className=" col-span-1">
                    <label className="block  text-xs font-medium  text-white">Nº DEPENDENTES TOTAL</label>
                    <input type="number" value={dadosFuncionario.n_dependentes} onChange={e =>  setarDadosFuncionario({...dadosFuncionario,n_dependentes:e.target.valueAsNumber})} className="block w-full  pt-1 pb-1 pl-2 pr-2  border  rounded-lg  sm:text-xs  bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500" />
                </div>
                <div className=" col-span-1">
                    <label className="block  text-xs font-medium  text-white">MENORES DE 14 ANOS</label>
                    <input type="text" value={dadosFuncionario.menores_14} onChange={e =>  setarDadosFuncionario({...dadosFuncionario,menores_14:e.target.valueAsNumber})} className="block w-full  pt-1 pb-1 pl-2 pr-2  border  rounded-lg  sm:text-xs  bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500" />
                </div>
                <div className=" col-span-1">
                    <label className="block  text-xs font-medium  text-white">CASO EMERGÊNCIA</label>
                    <input type="text" value={dadosFuncionario.caso_emergencia} onChange={e =>  setarDadosFuncionario({...dadosFuncionario,caso_emergencia:e.target.value})} className="block w-full  pt-1 pb-1 pl-2 pr-2  border  rounded-lg  sm:text-xs  bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500" />
                </div>
                <div className=" col-span-1">
                    <label className="block  text-xs font-medium  text-white">SALÁRIO</label>
                    <input type="number" value={dadosFuncionario.salario} onChange={e =>  setarDadosFuncionario({...dadosFuncionario,salario:e.target.valueAsNumber})} className="block w-full  pt-1 pb-1 pl-2 pr-2  border  rounded-lg  sm:text-xs  bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500" />
                </div>
                <div className=" col-span-1">
                    <label className="block  text-xs font-medium  text-white">CONTRATO EXP</label>
                    <input type="number" value={dadosFuncionario.contrato_exp} onChange={e =>  setarDadosFuncionario({...dadosFuncionario,contrato_exp:e.target.valueAsNumber})} className="block w-full  pt-1 pb-1 pl-2 pr-2  border  rounded-lg  sm:text-xs  bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500" />
                </div>
                <div className=" col-span-1">
                    <label className="block  text-xs font-medium  text-white">PRORROGAÇÃO CONT.</label>
                    <input type="number" value={dadosFuncionario.prorrogacao_cont} onChange={e =>  setarDadosFuncionario({...dadosFuncionario,prorrogacao_cont:e.target.valueAsNumber})} className="block w-full  pt-1 pb-1 pl-2 pr-2  border  rounded-lg  sm:text-xs  bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500" />
                </div>
                <div className=" col-span-1">
                    <label className="block  text-xs font-medium  text-white">SITUAÇÃO</label>
                    <input type="text" value={dadosFuncionario.situacao} onChange={e =>  setarDadosFuncionario({...dadosFuncionario,situacao:e.target.value})} className="block w-full  pt-1 pb-1 pl-2 pr-2  border  rounded-lg  sm:text-xs  bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500" />
                </div>

            </div>
        </div>
    )
}
