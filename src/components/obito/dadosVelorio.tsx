import DatePicker from 'react-datepicker'
import pt from 'date-fns/locale/pt'


interface VelorioProps{
    local_velorio:string,
    dt_velorio:Date,
    hr_velorio:string,
    dt_retorno:Date,
    copeira:string,
    enfermeira:string
}

interface DadosProps{
    servico:Partial<VelorioProps>
    setarServico:(fields:Partial<VelorioProps>)=>void
}
export function DadosVelorio({servico,setarServico}:DadosProps) {
  return (
    <div className="rounded-lg p-6 grid grid-flow-row-dense grid-cols-4 gap-5  h-full">
                        <div className="flex flex-col col-span-1">
                            <label className="block  text-xs font-medium  ">Endereço do Velório</label>
                            <input value={servico.local_velorio} className="whitespace-nowrap uppercase  py-1 px-0 w-full text-xs  bg-transparent border-0 border-b-2  appearance-none  border-gray-600  focus:outline-none focus:ring-0 focus:border-blue-600 peer" ></input>
                        </div>
                        <div className="flex flex-col col-span-1 ">
                            <label className="block  text-xs font-medium  ">Número</label>
                            <input className="whitespace-nowrap uppercase  py-1 px-0 w-full text-xs  bg-transparent border-0 border-b-2  appearance-none  border-gray-600  focus:outline-none focus:ring-0 focus:border-blue-600 peer" ></input>
                        </div>

                        <div className="flex flex-col col-span-1 ">
                            <label className="block  text-xs font-medium  ">Bairro</label>
                            <input className="whitespace-nowrap uppercase  py-1 px-0 w-full text-xs  bg-transparent border-0 border-b-2  appearance-none  border-gray-600  focus:outline-none focus:ring-0 focus:border-blue-600 peer" ></input>
                        </div>
                        <div className="flex flex-col col-span-2 ">
                            <label className="block  text-xs font-medium  ">Ponto de Referência</label>
                            <input className="whitespace-nowrap uppercase  py-1 px-0 w-full text-xs  bg-transparent border-0 border-b-2  appearance-none  border-gray-600  focus:outline-none focus:ring-0 focus:border-blue-600 peer" ></input>
                        </div>
                        <div className="flex flex-row gap-x-4 col-span-1 ">
                            <div className="flex flex-col">
                                <label className="block  text-xs font-medium  ">Cidade</label>
                                <input className="whitespace-nowrap uppercase py-1 px-0 w-full text-xs  bg-transparent border-0 border-b-2  appearance-none  border-gray-600  focus:outline-none focus:ring-0 focus:border-blue-600 peer" ></input>
                            </div>
                            <div className="flex flex-col">
                                <label className="block  text-xs font-medium  ">UF</label>
                                <input className="whitespace-nowrap uppercase py-1  px-0 w-full text-xs  bg-transparent border-0 border-b-2  appearance-none  border-gray-600  focus:outline-none focus:ring-0 focus:border-blue-600 peer" ></input>
                            </div>

                        </div>
                        <div className="flex flex-row gap-x-4 col-span-1 ">
                            <div className="flex flex-col">
                                <label className="block  text-xs font-medium  ">Data de Saída</label>
                                <DatePicker dateFormat={"dd/MM/yyyy"} locale={pt} selected={servico.dt_velorio} onChange={e => e && setarServico({ dt_velorio: e })} className="whitespace-nowrap uppercase py-1 px-0 w-full text-xs  bg-transparent border-0 border-b-2  appearance-none  border-gray-600  focus:outline-none focus:ring-0 focus:border-blue-600 peer" >{ }</DatePicker>
                            </div>
                            <div className="flex flex-col">
                                <label className="block  text-xs font-medium  ">Hora de Saída</label>

                               {/* <InputMask
                                    mask={"99:99"}
                                    value={servico.hr_velorio}
                                    onChange={e => {
                                        setarServico({ hr_velorio: e.target.value })
                                    }}
                                    className="whitespace-nowrap uppercase py-1 px-0 w-full text-xs bg-transparent border-0 border-b-2 appearance-none  border-gray-600 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                                />*/
}
                            </div>
                        </div>
                        <div className="flex flex-row gap-x-4 col-span-1 ">
                            <div className="flex flex-col">
                                <label className="block  text-xs font-medium  ">Data de Retorno</label>
                                <DatePicker dateFormat={"dd/MM/yyyy"} locale={"pt"} selected={servico.dt_retorno} onChange={e => e && setarServico({ dt_retorno: e })} className="whitespace-nowrap uppercase py-1 px-0 w-full text-xs  bg-transparent border-0 border-b-2  appearance-none  border-gray-600  focus:outline-none focus:ring-0 focus:border-blue-600 peer" ></DatePicker>
                            </div>
                            <div className="flex flex-col">
                                <label className="block  text-xs font-medium  ">Hora de Retorno</label>
                                <input className="whitespace-nowrap uppercase py-1  px-0 w-full text-xs  bg-transparent border-0 border-b-2  appearance-none  border-gray-600  focus:outline-none focus:ring-0 focus:border-blue-600 peer" ></input>
                            </div>
                        </div>
                        <div className="flex flex-col col-span-1 ">
                            <label className="block  text-xs font-medium  ">Copeira</label>
                            <input value={servico.copeira} onChange={e => setarServico({ copeira: e.target.value })} className="whitespace-nowrap uppercase  py-1 px-0 w-full text-xs  bg-transparent border-0 border-b-2  appearance-none  border-gray-600  focus:outline-none focus:ring-0 focus:border-blue-600 peer" ></input>
                        </div>
                        <div className="flex flex-col col-span-1 ">
                            <label className="block  text-xs font-medium  ">Enfermeira</label>
                            <input value={servico.enfermeira} onChange={e => setarServico({ enfermeira: e.target.value })} className="whitespace-nowrap uppercase  py-1 px-0 w-full text-xs  bg-transparent border-0 border-b-2  appearance-none  border-gray-600  focus:outline-none focus:ring-0 focus:border-blue-600 peer" ></input>
                        </div>
                        <div className="flex flex-col col-span-1 ">
                            <label className="block  text-xs font-medium  ">Veiculo Retirada</label>
                            <input className="whitespace-nowrap uppercase  py-1 px-0 w-full text-xs  bg-transparent border-0 border-b-2  appearance-none  border-gray-600  focus:outline-none focus:ring-0 focus:border-blue-600 peer" ></input>
                        </div>
                        <div className="flex flex-col col-span-1 ">
                            <label className="block  text-xs font-medium  ">Veiculo Cortejo</label>
                            <input className="whitespace-nowrap uppercase  py-1 px-0 w-full text-xs  bg-transparent border-0 border-b-2  appearance-none  border-gray-600  focus:outline-none focus:ring-0 focus:border-blue-600 peer" ></input>
                        </div>

                    </div>
  )
}
