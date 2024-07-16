
interface DeclaranteProps{
    rd_nome:string,
    cpf_cnpj:string,
    rd_rg:string,
    rd_endereco:string,
    rd_numero:string,
    rd_bairro:string,
    rd_complemento:string,
    rd_cidade:string,
    rd_uf:string
}

interface DadosProps{
    servico:Partial<DeclaranteProps>
    setarServico:(fields:Partial<DeclaranteProps>)=>void
}


export function DadosDeclarante({servico,setarServico}:DadosProps) {
  return (
    <div className="rounded-lg p-6 grid grid-flow-row-dense grid-cols-4 gap-5">
    <div className="flex flex-col col-span-1">
        <label className="block  text-xs font-medium  text-white">Nome do Declarante</label>
        <input value={servico.rd_nome} onChange={e => setarServico({ rd_nome: e.target.value })} className="whitespace-nowrap uppercase  py-1 px-0 w-full text-xs  bg-transparent border-0 border-b-2  appearance-none text-white border-gray-600  focus:outline-none focus:ring-0 focus:border-blue-600 peer" >{ }</input>
    </div>
    <div className="flex flex-col col-span-1 ">
        <label className="block  text-xs font-medium  text-white">CPF/CNPJ</label>
        <input value={servico.cpf_cnpj} onChange={e => setarServico({ cpf_cnpj: e.target.value })} className="whitespace-nowrap uppercase  py-1 px-0 w-full text-xs  bg-transparent border-0 border-b-2  appearance-none text-white border-gray-600  focus:outline-none focus:ring-0 focus:border-blue-600 peer" >{ }</input>
    </div>

    <div className="flex flex-col col-span-1 ">
        <label className="block  text-xs font-medium  text-white">RG</label>
        <input value={servico.rd_rg} onChange={e => setarServico({ rd_rg: e.target.value })} className="whitespace-nowrap uppercase  py-1 px-0 w-full text-xs  bg-transparent border-0 border-b-2  appearance-none text-white border-gray-600  focus:outline-none focus:ring-0 focus:border-blue-600 peer" >{ }</input>
    </div>

    <div className="flex flex-col col-span-1 ">
        <label className="block  text-xs font-medium  text-white">Endereço</label>
        <input value={servico.rd_endereco} onChange={e => setarServico({ rd_endereco: e.target.value })} className="whitespace-nowrap uppercase  py-1 px-0 w-full text-xs  bg-transparent border-0 border-b-2  appearance-none text-white border-gray-600  focus:outline-none focus:ring-0 focus:border-blue-600 peer" >{ }</input>
    </div>

    <div className="flex flex-col col-span-1 ">
        <label className="block  text-xs font-medium  text-white">Numero</label>
        <input value={servico.rd_numero} onChange={e => setarServico({ rd_numero: e.target.value })} className="whitespace-nowrap uppercase  py-1 px-0 w-full text-xs  bg-transparent border-0 border-b-2  appearance-none text-white border-gray-600  focus:outline-none focus:ring-0 focus:border-blue-600 peer" >{ }</input>
    </div>
    <div className="flex flex-col col-span-1 ">
        <label className="block  text-xs font-medium  text-white">Bairro</label>
        <input value={servico.rd_bairro} onChange={e => setarServico({ rd_bairro: e.target.value })} className="whitespace-nowrap uppercase  py-1 px-0 w-full text-xs  bg-transparent border-0 border-b-2  appearance-none text-white border-gray-600  focus:outline-none focus:ring-0 focus:border-blue-600 peer" >{ }</input>
    </div>
    <div className="flex flex-col col-span-1 ">
        <label className="block  text-xs font-medium  text-white">Complemento</label>
        <input value={servico.rd_complemento} onChange={e => setarServico({ rd_complemento: e.target.value })} className="whitespace-nowrap uppercase  py-1 px-0 w-full text-xs  bg-transparent border-0 border-b-2  appearance-none text-white border-gray-600  focus:outline-none focus:ring-0 focus:border-blue-600 peer" >{ }</input>
    </div>
    <div className="flex flex-row gap-x-4 col-span-1 ">
        <div className="flex flex-col">
            <label className="block  text-xs font-medium  text-white">Cidade</label>
            <input value={servico.rd_cidade} onChange={e => setarServico({ rd_cidade: e.target.value })} className="whitespace-nowrap uppercase py-1 px-0 w-full text-xs  bg-transparent border-0 border-b-2  appearance-none text-white border-gray-600  focus:outline-none focus:ring-0 focus:border-blue-600 peer" >{ }</input>
        </div>
        <div className="flex flex-col">
            <label className="block  text-xs font-medium  text-white">UF</label>
            <input value={servico.rd_uf} onChange={e => setarServico({ rd_uf: e.target.value })} className="whitespace-nowrap uppercase py-1  px-0 w-full text-xs  bg-transparent border-0 border-b-2  appearance-none text-white border-gray-600  focus:outline-none focus:ring-0 focus:border-blue-600 peer" >{ }</input>
        </div>

    </div>
</div>
  )
}
