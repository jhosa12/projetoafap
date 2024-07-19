import DatePicker, { registerLocale } from "react-datepicker";

interface FalecidoProps{
    nome_falecido:string,
    data_nascimento:Date,
    religiao:string,
    sexo:string,
    rg:string
    cpf:string,
    estado_civil:string,
    certidao_casado:string,
    conjuge:string,
    naturalidade:string,
    profissao:string,
    nacionalidade:string,
    cemiterio:string,
    endereco_cemiterio:string,
    end_rua:string,
    end_numero:string,
    end_bairro:string,
    end_cidade:string,
    end_uf:string


}
interface DadosProps{
    servico:Partial<FalecidoProps>
    setarServico:(fields:Partial<FalecidoProps>)=>void
    check:boolean
}

export function DadosFalecido({servico,setarServico,check}:DadosProps) {
  return (
    <div  className="rounded-lg p-6 grid grid-flow-row-dense max-h-[calc(100vh-200px)] grid-cols-4 gap-5">
    <div className="flex flex-col col-span-1">
        <label className="block  text-xs font-medium  text-white">Nome do Falecido</label>
        <input disabled={check} value={servico.nome_falecido} onChange={e => setarServico({ nome_falecido: e.target.value.toUpperCase() })} className="whitespace-nowrap uppercase  py-1 px-0 w-full text-xs  bg-transparent border-0 border-b-2  appearance-none text-white border-gray-600  focus:outline-none focus:ring-0 focus:border-blue-600 peer" >{ }</input>
    </div>
    <div className="flex flex-col col-span-1 ">
        <label className="block  text-xs font-medium  text-white">Data Nascimento</label>
        <DatePicker disabled={check} dateFormat={"dd/MM/yyyy"} locale={"pt"} selected={servico.data_nascimento} onChange={e => e && setarServico({ data_nascimento: e })} className="whitespace-nowrap uppercase  py-1 px-0 w-full text-xs  bg-transparent border-0 border-b-2  appearance-none text-white border-gray-600  focus:outline-none focus:ring-0 focus:border-blue-600 peer" >{ }</DatePicker>
    </div>
    <div className="flex flex-col col-span-1 ">
        <label className="block  text-xs font-medium  text-white">Religião</label>
        <select disabled={check} value={servico.religiao} onChange={e => setarServico({ religiao: e.target.value })} className="whitespace-nowrap uppercase  py-1 px-0 w-full text-xs bg-[#0f172a] border-0 border-b-2  appearance-none text-white border-gray-600  focus:outline-none focus:ring-0 focus:border-blue-600 peer" >
        <option value=""></option>
            <option value="CATÓLICA">CATÓLICA</option>
            <option value="EVANGÉLICA">EVANGÉLICA</option>
            <option value="EVANGÉLICA">INDETERMINADA</option>
            <option value="EVANGÉLICA">ATEU</option>
        </select>
    </div>
    <div className="flex flex-col col-span-1 ">
        <label className="block  text-xs font-medium  text-white">Sexo</label>
        <input disabled={check} value={servico.sexo} onChange={e => setarServico({ sexo: e.target.value })} className="whitespace-nowrap uppercase  py-1 px-0 w-full text-xs  bg-transparent border-0 border-b-2  appearance-none text-white border-gray-600  focus:outline-none focus:ring-0 focus:border-blue-600 peer" >{ }</input>
    </div>
    <div className="flex flex-col col-span-1 ">
        <label className="block  text-xs font-medium  text-white">RG</label>
        <input disabled={check} value={servico.rg} onChange={e => setarServico({ rg: e.target.value })} className="whitespace-nowrap uppercase  py-1 px-0 w-full text-xs  bg-transparent border-0 border-b-2  appearance-none text-white border-gray-600  focus:outline-none focus:ring-0 focus:border-blue-600 peer" >{ }</input>
    </div>
    <div className="flex flex-col col-span-1 ">
        <label className="block  text-xs font-medium  text-white">CPF</label>
        <input disabled={check} value={servico.cpf} onChange={e => setarServico({ cpf: e.target.value })} className="whitespace-nowrap uppercase  py-1 px-0 w-full text-xs  bg-transparent border-0 border-b-2  appearance-none text-white border-gray-600  focus:outline-none focus:ring-0 focus:border-blue-600 peer" >{ }</input>
    </div>
    <div className="flex flex-col col-span-1 ">
        <label className="block  text-xs font-medium  text-white">Estado Civil</label>
        <select disabled={check} value={servico.estado_civil} onChange={e => setarServico({ estado_civil: e.target.value })} className="whitespace-nowrap uppercase  py-1 px-0 w-full text-xs border-0 border-b-2  appearance-none bg-[#0f172a] text-white border-gray-600  focus:outline-none focus:ring-0 focus:border-blue-600 peer" >
        <option value=""></option>
            <option value="SOLTEIRO(A)">SOLTEIRO(A)</option>
            <option value="CASADO(A)">CASADO(A)</option>
           
        </select>
    </div>
    <div className="flex flex-col col-span-1 ">
        <label className="block  text-xs font-medium  text-white">Certidão de Casamento</label>
        <input disabled={check} value={servico.certidao_casado} onChange={e => setarServico({ certidao_casado: e.target.value })} className="whitespace-nowrap uppercase  py-1 px-0 w-full text-xs  bg-transparent border-0 border-b-2  appearance-none text-white border-gray-600  focus:outline-none focus:ring-0 focus:border-blue-600 peer" >{ }</input>
    </div>
    <div className="flex flex-col col-span-1 ">
        <label className="block  text-xs font-medium  text-white">Conjuge</label>
        <input disabled={check} value={servico.conjuge} onChange={e => setarServico({ conjuge: e.target.value.toUpperCase() })} className="whitespace-nowrap uppercase  py-1 px-0 w-full text-xs  bg-transparent border-0 border-b-2  appearance-none text-white border-gray-600  focus:outline-none focus:ring-0 focus:border-blue-600 peer" >{ }</input>
    </div>
    <div className="flex flex-col col-span-1 ">
        <label className="block  text-xs font-medium  text-white">Naturalidade</label>
        <input disabled={check} value={servico.naturalidade} onChange={e => setarServico({ naturalidade: e.target.value.toUpperCase() })} className="whitespace-nowrap uppercase  py-1 px-0 w-full text-xs  bg-transparent border-0 border-b-2  appearance-none text-white border-gray-600  focus:outline-none focus:ring-0 focus:border-blue-600 peer" ></input>
    </div>
    <div className="flex flex-col col-span-1 ">
        <label className="block  text-xs font-medium  text-white">Profissão</label>
        <input disabled={check} value={servico.profissao} onChange={e => setarServico({ profissao: e.target.value.toUpperCase() })} className="whitespace-nowrap uppercase  py-1 px-0 w-full text-xs  bg-transparent border-0 border-b-2  appearance-none text-white border-gray-600  focus:outline-none focus:ring-0 focus:border-blue-600 peer" ></input>
    </div>
    <div className="flex flex-col col-span-1 ">
        <label className="block  text-xs font-medium  text-white">Nacionalidade</label>
        <input disabled={check} value={servico.nacionalidade} onChange={e => setarServico({ nacionalidade: e.target.value.toUpperCase() })} className="whitespace-nowrap uppercase  py-1 px-0 w-full text-xs  bg-transparent border-0 border-b-2  appearance-none text-white border-gray-600  focus:outline-none focus:ring-0 focus:border-blue-600 peer" ></input>
    </div>
    <div className="flex flex-col col-span-1 ">
        <label className="block  text-xs font-medium  text-white">Tipo de Inumado</label>
        <input disabled={check} className="whitespace-nowrap uppercase  py-1 px-0 w-full text-xs  bg-transparent border-0 border-b-2  appearance-none text-white border-gray-600  focus:outline-none focus:ring-0 focus:border-blue-600 peer" ></input>
    </div>
    <div className="flex flex-col col-span-1 ">
        <label className="block  text-xs font-medium  text-white">Cemitério</label>
        <input disabled={check} value={servico.cemiterio} onChange={e => setarServico({ cemiterio: e.target.value.toUpperCase() })} className="whitespace-nowrap uppercase  py-1 px-0 w-full text-xs  bg-transparent border-0 border-b-2  appearance-none text-white border-gray-600  focus:outline-none focus:ring-0 focus:border-blue-600 peer" >{ }</input>
    </div>
    <div className="flex flex-col col-span-1 ">
        <label className="block  text-xs font-medium  text-white">Endereço do Cemitério</label>
        <input disabled={check} value={servico.endereco_cemiterio} onChange={e => setarServico({ endereco_cemiterio: e.target.value.toUpperCase() })} className="whitespace-nowrap uppercase  py-1 px-0 w-full text-xs  bg-transparent border-0 border-b-2  appearance-none text-white border-gray-600  focus:outline-none focus:ring-0 focus:border-blue-600 peer" >{ }</input>
    </div>
    <div className="flex flex-col col-span-1 ">

    </div>

    <div className="flex flex-col col-span-1 ">
        <label className="block  text-xs font-medium  text-white">Endereço</label>
        <input disabled={check} value={servico.end_rua} onChange={e => setarServico({ end_rua: e.target.value.toUpperCase() })} className="whitespace-nowrap uppercase  py-1 px-0 w-full text-xs  bg-transparent border-0 border-b-2  appearance-none text-white border-gray-600  focus:outline-none focus:ring-0 focus:border-blue-600 peer" >{ }</input>
    </div>
    <div className="flex flex-col col-span-1 ">
        <label className="block  text-xs font-medium  text-white">Número</label>
        <input disabled={check} value={servico.end_numero} onChange={e => setarServico({ end_numero: e.target.value })} className="whitespace-nowrap uppercase  py-1 px-0 w-full text-xs  bg-transparent border-0 border-b-2  appearance-none text-white border-gray-600  focus:outline-none focus:ring-0 focus:border-blue-600 peer" >{ }</input>
    </div>
    <div className="flex flex-col col-span-1 ">
        <label className="block  text-xs font-medium  text-white">Bairro</label>
        <input disabled={check} value={servico.end_bairro} onChange={e => setarServico({ end_bairro: e.target.value.toUpperCase() })} className="whitespace-nowrap uppercase  py-1 px-0 w-full text-xs  bg-transparent border-0 border-b-2  appearance-none text-white border-gray-600  focus:outline-none focus:ring-0 focus:border-blue-600 peer" >{ }</input>
    </div>
    <div className="flex flex-row gap-x-4 col-span-1 ">
        <div className="flex flex-col">
            <label className="block  text-xs font-medium  text-white">Cidade</label>
            <input disabled={check} value={servico.end_cidade} onChange={e => setarServico({ end_cidade: e.target.value.toUpperCase() })} className="whitespace-nowrap uppercase py-1 px-0 w-full text-xs  bg-transparent border-0 border-b-2  appearance-none text-white border-gray-600  focus:outline-none focus:ring-0 focus:border-blue-600 peer" >{ }</input>
        </div>
        <div className="flex flex-col">
            <label className="block  text-xs font-medium  text-white">UF</label>
            <input disabled={check} value={servico.end_uf} onChange={e => setarServico({ end_uf: e.target.value.toUpperCase() })} className="whitespace-nowrap uppercase py-1  px-0 w-full text-xs  bg-transparent border-0 border-b-2  appearance-none text-white border-gray-600  focus:outline-none focus:ring-0 focus:border-blue-600 peer" >{ }</input>
        </div>

    </div>
    </div>
  )
}
