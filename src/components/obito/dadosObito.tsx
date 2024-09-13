import DatePicker from 'react-datepicker';
import pt from 'date-fns/locale/pt-BR';

interface ObitoProps{
end_data_falecimento:Date,
end_local_falecimento:string,
dc_laudo_med:string,
dec_obito_num:string,
dc_nome_medico:string
dc_crm:string,
dt_sepultamento:Date,
caracterista_corporal:string,
jazigo:string
}

interface DadosProps{
    servico:Partial<ObitoProps>
    setarServico:(fields:Partial<ObitoProps>)=>void
}
export function DadosObito({servico,setarServico}:DadosProps) {
  return (
    <div className="rounded-lg p-6 grid grid-flow-row-dense grid-cols-4 gap-5">
                        <div className="flex flex-col col-span-1">
                            <label className="block  text-xs font-medium  ">Data do Falecimento</label>
                            <DatePicker dateFormat={"dd/MM/yyyy"} locale={pt} selected={servico.end_data_falecimento} onChange={e => e && setarServico({ end_data_falecimento: e })} className="whitespace-nowrap uppercase  py-1 px-0 w-full text-xs  bg-transparent border-0 border-b-2  appearance-none  border-gray-600  focus:outline-none focus:ring-0 focus:border-blue-600 peer" ></DatePicker>
                        </div>
                        <div className="flex flex-col col-span-1 ">
                            <label className="block  text-xs font-medium  ">Local do Falecimento</label>
                            <input value={servico.end_local_falecimento} onChange={e => setarServico({ end_local_falecimento: e.target.value.toUpperCase() })} className="whitespace-nowrap uppercase  py-1 px-0 w-full text-xs  bg-transparent border-0 border-b-2  appearance-none  border-gray-600  focus:outline-none focus:ring-0 focus:border-blue-600 peer" ></input>
                        </div>

                        <div className="flex flex-col col-span-1 ">
                            <label className="block  text-xs font-medium  ">Hora do falecimento</label>
                            <input className="whitespace-nowrap uppercase  py-1 px-0 w-full text-xs  bg-transparent border-0 border-b-2  appearance-none  border-gray-600  focus:outline-none focus:ring-0 focus:border-blue-600 peer" >{ }</input>
                        </div>

                        <div className="flex flex-col col-span-1 ">
                            <label className="block  text-xs font-medium  ">Hora da Solicitação</label>
                            <input className="whitespace-nowrap uppercase  py-1 px-0 w-full text-xs  bg-transparent border-0 border-b-2  appearance-none  border-gray-600  focus:outline-none focus:ring-0 focus:border-blue-600 peer" >{ }</input>
                        </div>

                        <div className="flex flex-col col-span-3 ">
                            <label className="block  text-xs font-medium  ">Laudo Médico (Causa Morte)</label>
                            <input value={servico.dc_laudo_med} onChange={e => setarServico({ dc_laudo_med: e.target.value })} className="whitespace-nowrap uppercase  py-1 px-0 w-full text-xs  bg-transparent border-0 border-b-2  appearance-none  border-gray-600  focus:outline-none focus:ring-0 focus:border-blue-600 peer" ></input>
                        </div>
                        <div className="flex flex-col col-span-1 ">
                            <label className="block  text-xs font-medium  ">Número da D.O.</label>
                            <input value={servico.dec_obito_num} onChange={e => setarServico({ dec_obito_num: e.target.value })} className="whitespace-nowrap uppercase  py-1 px-0 w-full text-xs  bg-transparent border-0 border-b-2  appearance-none  border-gray-600  focus:outline-none focus:ring-0 focus:border-blue-600 peer" ></input>
                        </div>
                        <div className="flex flex-col col-span-1 ">
                            <label className="block  text-xs font-medium  ">Nome do Médico</label>
                            <input value={servico.dc_nome_medico} onChange={e => setarServico({ dc_nome_medico: e.target.value.toUpperCase() })} className="whitespace-nowrap uppercase  py-1 px-0 w-full text-xs  bg-transparent border-0 border-b-2  appearance-none  border-gray-600  focus:outline-none focus:ring-0 focus:border-blue-600 peer" ></input>
                        </div>
                        <div className="flex flex-col col-span-1 ">
                            <label className="block  text-xs font-medium  ">CRM</label>
                            <input value={servico.dc_crm} onChange={e => setarServico({ dc_crm: e.target.value })} className="whitespace-nowrap uppercase  py-1 px-0 w-full text-xs  bg-transparent border-0 border-b-2  appearance-none  border-gray-600  focus:outline-none focus:ring-0 focus:border-blue-600 peer" ></input>
                        </div>


                        <div className="flex flex-row gap-x-4 col-span-1 ">
                            <div className="flex flex-col">
                                <label className="block  text-xs font-medium  ">Data Sepultamento</label>
                                <DatePicker dateFormat={"dd/MM/yyyy"} locale={pt} selected={servico.dt_sepultamento} onChange={e => e && setarServico({ dt_sepultamento: e })} className="whitespace-nowrap uppercase py-1 px-0 w-full text-xs  bg-transparent border-0 border-b-2  appearance-none  border-gray-600  focus:outline-none focus:ring-0 focus:border-blue-600 peer" ></DatePicker>
                            </div>
                            <div className="flex flex-col">
                                <label className="block  text-xs font-medium  ">Hora Sepultamento</label>
                                <input className="whitespace-nowrap uppercase py-1  px-0 w-full text-xs  bg-transparent border-0 border-b-2  appearance-none  border-gray-600  focus:outline-none focus:ring-0 focus:border-blue-600 peer" ></input>
                            </div>
                        </div>
                        <div className="flex flex-col col-span-1 ">
                            <label className="block  text-xs font-medium  ">Tipo</label>
                            <input value={servico.jazigo} onChange={e=>setarServico({...servico,jazigo:e.target.value.toUpperCase()})} className="whitespace-nowrap uppercase  py-1 px-0 w-full text-xs  bg-transparent border-0 border-b-2  appearance-none  border-gray-600  focus:outline-none focus:ring-0 focus:border-blue-600 peer" ></input>
                        </div>


                        <div className="flex flex-col col-span-3 ">
                            <label className="block  text-xs font-medium  p-1 ">Observações</label>
                            <textarea value={servico.caracterista_corporal} onChange={e => setarServico({ caracterista_corporal: e.target.value.toUpperCase()  })} rows={3} className="whitespace-nowrap uppercase rounded-lg  py-1 px-2 w-full text-xs  bg-transparent border-2    border-gray-600  focus:outline-none focus:ring-0 focus:border-blue-600 peer" ></textarea>
                        </div>
                    </div>
  )
}
