


interface FuncionarioProps{
    nomeCompleto:string,
    cpf:string,
    rg:string,
    nascimento:Date|null,
    cep:string,
    endereco:string,
    numero:string,
    bairro:string,
    cidade:string,
    uf:string,
    telefone:string,
    email:string,
    dataAdmissao:Date |null,
    CNH_categoria:string,
    titulo_eleitor:string,
    zona:number,
    secao:number,
    PIS_PASEP:string,
    escolaridade:string,
    nome_conjuge:string,
    n_dep:number,
    n_dep14:number,
    caso_emergencia:string,
    salario:number,
    contrato_exp:number,
    prorrogacao:number,
    situacao:string,
  
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
                    <input type="text" value={dadosFuncionario.nomeCompleto} onChange={e => {setarDadosFuncionario({...dadosFuncionario,nomeCompleto:e.target.value}) }} className="block w-full  pt-1 pb-1 pl-2 pr-2  border  rounded-lg  sm:text-xs  bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500" />
                </div>

                <div className=" col-span-1">
                    <label className="block  text-xs font-medium  text-white">CPF</label>
                    <input type="text" value={dadosFuncionario.cpf} onChange={e => {setarDadosFuncionario({...dadosFuncionario,cpf:e.target.value}) }} className="block w-full  pt-1 pb-1 pl-2 pr-2  border  rounded-lg  sm:text-xs  bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500" />
                </div>
                <div className=" col-span-1">
                    <label className="block  text-xs font-medium  text-white">RG</label>
                    <input type="text" value={dadosFuncionario.rg} onChange={e => {setarDadosFuncionario({...dadosFuncionario,rg:e.target.value}) }} className="block w-full  pt-1 pb-1 pl-2 pr-2  border  rounded-lg  sm:text-xs  bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500" />
                </div>
                <div className=" col-span-1">
                    <label className="block  text-xs font-medium  text-white">NASCIMENTO</label>
                    <input type="text" value={dadosFuncionario.nascimento?.toLocaleDateString()} onChange={e => setarDadosFuncionario({...dadosFuncionario,nascimento:new Date(e.target.value)})} className="block w-full  pt-1 pb-1 pl-2 pr-2  border  rounded-lg  sm:text-xs  bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500" />
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
                    <input type="text" value={dadosFuncionario.bairro} onChange={e => { }} className="block w-full  pt-1 pb-1 pl-2 pr-2  border  rounded-lg  sm:text-xs  bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500" />
                </div>
                <div className=" col-span-1">
                    <label className="block  text-xs font-medium  text-white">CIDADE</label>
                    <input type="text" value={''} onChange={e => { }} className="block w-full  pt-1 pb-1 pl-2 pr-2  border  rounded-lg  sm:text-xs  bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500" />
                </div>
                <div className=" col-span-1">
                    <label className="block  text-xs font-medium  text-white">UF</label>
                    <input type="text" value={''} onChange={e => { }} className="block w-full  pt-1 pb-1 pl-2 pr-2  border  rounded-lg  sm:text-xs  bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500" />
                </div>
                <div className=" col-span-1">
                    <label className="block  text-xs font-medium  text-white">TELEFONE</label>
                    <input type="text" value={''} onChange={e => { }} className="block w-full  pt-1 pb-1 pl-2 pr-2  border  rounded-lg  sm:text-xs  bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500" />
                </div>
                <div className=" col-span-1">
                    <label className="block  text-xs font-medium  text-white">E-MAIL</label>
                    <input type="text" value={''} onChange={e => { }} className="block w-full  pt-1 pb-1 pl-2 pr-2  border  rounded-lg  sm:text-xs  bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500" />
                </div>
                <div className=" col-span-1">
                    <label className="block  text-xs font-medium  text-white">DATA ADMISSÃO</label>
                    <input type="text" value={''} onChange={e => { }} className="block w-full  pt-1 pb-1 pl-2 pr-2  border  rounded-lg  sm:text-xs  bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500" />
                </div>
                <div className=" col-span-1">
                    <label className="block  text-xs font-medium  text-white">CNH_CATEGORIA</label>
                    <input type="text" value={''} onChange={e => { }} className="block w-full  pt-1 pb-1 pl-2 pr-2  border  rounded-lg  sm:text-xs  bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500" />
                </div>
                <div className=" col-span-1">
                    <label className="block  text-xs font-medium  text-white">TITULO ELEITOR</label>
                    <input type="text" value={''} onChange={e => { }} className="block w-full  pt-1 pb-1 pl-2 pr-2  border  rounded-lg  sm:text-xs  bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500" />
                </div>
                <div className=" col-span-1">
                    <label className="block  text-xs font-medium  text-white">ZONA</label>
                    <input type="text" value={''} onChange={e => { }} className="block w-full  pt-1 pb-1 pl-2 pr-2  border  rounded-lg  sm:text-xs  bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500" />
                </div>
                <div className=" col-span-1">
                    <label className="block  text-xs font-medium  text-white">SEÇÃO</label>
                    <input type="text" value={''} onChange={e => { }} className="block w-full  pt-1 pb-1 pl-2 pr-2  border  rounded-lg  sm:text-xs  bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500" />
                </div>
                <div className=" col-span-1">
                    <label className="block  text-xs font-medium  text-white">PIS/PASEP</label>
                    <input type="text" value={''} onChange={e => { }} className="block w-full  pt-1 pb-1 pl-2 pr-2  border  rounded-lg  sm:text-xs  bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500" />
                </div>
                <div className=" col-span-1">
                    <label className="block  text-xs font-medium  text-white">ESCOLARIDADE</label>
                    <input type="text" value={''} onChange={e => { }} className="block w-full  pt-1 pb-1 pl-2 pr-2  border  rounded-lg  sm:text-xs  bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500" />
                </div>
                <div className=" col-span-2">
                    <label className="block  text-xs font-medium  text-white">NOME CONJUGE</label>
                    <input type="text" value={''} onChange={e => { }} className="block w-full  pt-1 pb-1 pl-2 pr-2  border  rounded-lg  sm:text-xs  bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500" />
                </div>
                <div className=" col-span-1">
                    <label className="block  text-xs font-medium  text-white">Nº DEPENDENTES TOTAL</label>
                    <input type="text" value={''} onChange={e => { }} className="block w-full  pt-1 pb-1 pl-2 pr-2  border  rounded-lg  sm:text-xs  bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500" />
                </div>
                <div className=" col-span-1">
                    <label className="block  text-xs font-medium  text-white">MENORES DE 14 ANOS</label>
                    <input type="text" value={''} onChange={e => { }} className="block w-full  pt-1 pb-1 pl-2 pr-2  border  rounded-lg  sm:text-xs  bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500" />
                </div>
                <div className=" col-span-1">
                    <label className="block  text-xs font-medium  text-white">CASO EMERGÊNCIA</label>
                    <input type="text" value={''} onChange={e => { }} className="block w-full  pt-1 pb-1 pl-2 pr-2  border  rounded-lg  sm:text-xs  bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500" />
                </div>
                <div className=" col-span-1">
                    <label className="block  text-xs font-medium  text-white">SALÁRIO</label>
                    <input type="text" value={''} onChange={e => { }} className="block w-full  pt-1 pb-1 pl-2 pr-2  border  rounded-lg  sm:text-xs  bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500" />
                </div>
                <div className=" col-span-1">
                    <label className="block  text-xs font-medium  text-white">CONTRATO EXP</label>
                    <input type="text" value={''} onChange={e => { }} className="block w-full  pt-1 pb-1 pl-2 pr-2  border  rounded-lg  sm:text-xs  bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500" />
                </div>
                <div className=" col-span-1">
                    <label className="block  text-xs font-medium  text-white">PRORROGAÇÃO CONT.</label>
                    <input type="text" value={''} onChange={e => { }} className="block w-full  pt-1 pb-1 pl-2 pr-2  border  rounded-lg  sm:text-xs  bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500" />
                </div>
                <div className=" col-span-1">
                    <label className="block  text-xs font-medium  text-white">SITUAÇÃO</label>
                    <input type="text" value={''} onChange={e => { }} className="block w-full  pt-1 pb-1 pl-2 pr-2  border  rounded-lg  sm:text-xs  bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500" />
                </div>

            </div>
        </div>
    )
}
