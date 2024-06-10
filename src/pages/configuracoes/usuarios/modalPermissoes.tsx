import { useEffect, useState } from "react"

interface PermissoesProps {
   nome:string,
   val:boolean,
   tela:string
}

interface ModalProps{
    setarDadosPermissoes:(permissoes:Array<PermissoesProps>)=>void,
    dadosPermissoes:Array<PermissoesProps>
}
export default function ModalPermissoes({setarDadosPermissoes,dadosPermissoes}:ModalProps) {
    const [index, setIndex] = useState<number>(1)
    function handleCheckBox(index:number){
        const novoArray = [...dadosPermissoes]
        novoArray[index].val = !dadosPermissoes[index].val
        setarDadosPermissoes(novoArray)
    }

    return (
        <div className=" flex flex-col  p-4 rounded-lg  shadow bg-gray-800">

            <h1 className="flex flex-row justify-start mb-4 border-b-[1px] text-lg border-gray-500 font-semibold mt-2 gap-2 text-white">PERMISSÕES</h1>
            <ul className="flex flex-wrap text-sm font-medium text-center  border-b  rounded-t-lg  border-gray-700 text-gray-400 bg-gray-800" role="tablist">
                <li className="me-2">
                    <button type="button" onClick={() => setIndex(1)} className="inline-block p-4 font-semibold rounded-ss-lg  bg-gray-800 hover:bg-gray-700 text-blue-500">ADM CONTRATO</button>
                </li>
                <li className="me-2">
                    <button type="button" onClick={() => setIndex(2)} className="inline-block p-4  hover:bg-gray-700 hover:text-gray-300">Histórico/Movimentação</button>
                </li>
                <li className="me-2">
                    <button type="button" onClick={() => setIndex(3)} className="inline-block p-4   hover:bg-gray-700 hover:text-gray-300">Dependentes</button>
                </li>
                <li className="me-2">
                    <button type="button" onClick={() => setIndex(4)} className="inline-block p-4   hover:bg-gray-700 hover:text-gray-300">Carteiras</button>
                </li>
                <li className="me-2">
                    <button type="button" onClick={() => setIndex(5)} className="inline-block p-4   hover:bg-gray-700 hover:text-gray-300">Óbitos</button>
                </li>
                <li className="me-2">
                    <button type="button" onClick={() => setIndex(6)} className="inline-block p-4   hover:bg-gray-700 hover:text-gray-300">Documentos</button>
                </li>
            </ul>
            {index === 1 && (
                <div className="flex flex-col mt-1 w-full gap-2">
                    <div className="flex flex-col ">
                        <label htmlFor="" className=" text-sm pl-2">DADOS TITULAR/PLANO</label>
                        <div className="grid grid-cols-5 gap-3">
                            {dadosPermissoes?.map((item, index) =>  (
                              item.tela==='admContDados' &&  <div key={index} className="flex items-center ">
                                    <input type="checkbox" checked={item.val} onChange={()=>handleCheckBox(Number(index))} className="w-3 h-3 text-blue-600  rounded    bg-gray-700 border-gray-600" />
                                    <label className="ms-2  text-xs whitespace-nowrap text-gray-900 dark:text-gray-300">{item.nome}</label>
                                </div>

                            ))}
                        </div>
                    </div>

                    <div className="flex flex-col">
                        <label htmlFor="" className="pl-2 text-sm">HISTÓRICO/MENSALIDADE</label>
                        <div className="grid grid-cols-5 gap-3">
                            {dadosPermissoes.map((item, index) => (
                              item.tela=== 'admContMensal' &&  <div key={index}  className="flex items-center ">
                                    <input type="checkbox" checked={item.val} onChange={()=>handleCheckBox(Number(index))} className="w-3 h-3 text-blue-600  rounded    bg-gray-700 border-gray-600" />
                                    <label className="ms-2  text-xs whitespace-nowrap text-gray-900 dark:text-gray-300">{item.nome}</label>
                                </div>

                            ))}
                        </div>
                    </div>
                    <div className="flex flex-col">
                        <label htmlFor="" className="pl-2 text-sm">DEPENDENTES</label>
                        <div className="grid grid-cols-5 gap-3">
                            {dadosPermissoes.map((item, index) => (
                              item.tela=== 'admContDep' &&  <div key={index}  className="flex items-center ">
                                    <input type="checkbox" checked={item.val} onChange={()=>handleCheckBox(Number(index))} className="w-3 h-3 text-blue-600  rounded    bg-gray-700 border-gray-600" />
                                    <label className="ms-2  text-xs whitespace-nowrap text-gray-900 dark:text-gray-300">{item.nome}</label>
                                </div>

                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
