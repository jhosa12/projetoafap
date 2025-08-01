import { ClientUpdateProps, RouteProps } from "@/types/cobranca";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"



export function AtualizacoesTab({ atualizacoes }: { atualizacoes: Array<ClientUpdateProps> }) {

return (
    <div className="grid gap-4">
                {atualizacoes?.map((update) => (
                  <Card key={update.id_global}>
                    <CardHeader>
                      <CardTitle className="text-base">{update.nome}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <div className="text-sm">
                            <span className="text-muted-foreground">Novo endereço:</span>
                            <span className="ml-2">
                              {update.endereco}, {update.numero}
                            </span>
                          </div>
                          <div className="text-sm">
                            <span className="text-muted-foreground">Bairro:</span>
                            <span className="ml-2">{update.bairro}</span>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="text-sm">
                            <span className="text-muted-foreground">Celular:</span>
                            <span className="ml-2">{update.celular}</span>
                          </div>
                          <div className="text-sm">
                            <span className="text-muted-foreground">Data:</span>
                            <span className="ml-2">{update.dt_created && new Date(update.dt_created).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
)
}

