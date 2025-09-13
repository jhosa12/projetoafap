import { ResponseCaixaProps } from "../_types/types"



interface Props{
    saldo:number,
    despesas:number,
    valorForma:Record<string, number>|undefined,
    data:Partial<ResponseCaixaProps>|undefined
}


export const CardValuesCaixa = ({saldo,despesas,valorForma,data}:Props) => {




    return(
         <div className="flex flex-col whitespace-nowrap ml-4 bg-gray-50 px-2 py-1 text-[11px] rounded-md font-semibold">
                      <div className="inline-flex items-center gap-4">
                        <div>
                          <span>SALDO:</span>
                          <span>
                            {" "}
                            {Number(data?.dif).toLocaleString("pt-BR", {
                              style: "currency",
                              currency: "BRL",
                            })}
                          </span>
                        </div>
        
                        <div>
                          <span>DIA ANTERIOR:</span>
                          <span>
                            {" "}
                            {Number(data?.valorAnterior).toLocaleString("pt-BR", {
                              style: "currency",
                              currency: "BRL",
                            })}
                          </span>
                        </div>
                      </div>
        
                      <div className="inline-flex items-center gap-4">
                        <div>
                          <span>SALDO DIA:</span>
                          <span>R$ {saldo.toFixed(2)}</span>
                        </div>
        
                        <div>
                          <span>DESPESAS:</span>
                          <span>
                            {" "}
                            {Number(despesas).toLocaleString("pt-BR", {
                              style: "currency",
                              currency: "BRL",
                            })}
                          </span>
                        </div>
        
                        <div>
                          <span>RECEITAS:</span>
                          <span>
                            {" "}
                            {Number(saldo + despesas).toLocaleString("pt-BR", {
                              style: "currency",
                              currency: "BRL",
                            })}
                          </span>
                        </div>
                      </div>
        
                      <ul className="inline-flex gap-4">
                        {valorForma &&
                          Object.entries(valorForma).map(([forma, valor]) => (
                            <li key={forma}>
                              <strong>{forma}:</strong>{" "}
                              {Number(valor).toLocaleString("pt-BR", {
                                style: "currency",
                                currency: "BRL",
                              })}
                            </li>
                          ))}
                      </ul>
                    </div>
    )
}