import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Controller, useFormContext } from "react-hook-form"
import { listacheckida, listacheckvolta } from "@/app/dashboard/servicos/_mock/dados-checklist"


export const DadosCheckList = () => {
  const { control } = useFormContext();

  // Separando por tipo
  const parametrosIda = listacheckida.filter(item => item.tipo === "parametros");
  const mantimentosIda = listacheckida.filter(item => item.tipo === "mantimentos");
  const itensIda = listacheckida.filter(item => item.tipo === "itens");

  const parametrosVolta = listacheckvolta.filter(item => item.tipo === "parametros");
  const mantimentosVolta = listacheckvolta.filter(item => item.tipo === "mantimentos");
  const itensVolta = listacheckvolta.filter(item => item.tipo === "itens");

  return (
    <div>
      <Card className="bg-white border-gray-200 shadow-none ">
        <CardHeader>
          <CardTitle>Checklist de Procedimentos</CardTitle>
          <CardDescription>
            Utilize o checklist para garantir que todas as etapas do processo foram realizadas corretamente.
            Marque cada item conforme for concluído.
          </CardDescription>
        </CardHeader>

        <CardContent className="flex flex-col gap-8">
          {/* Checklist de Ida */}
          <Card>
            <CardHeader>
              <CardTitle>Checklist de Ida</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-row gap-8">
                {/* Parâmetros */}
                <div className="flex-1">
                  <h3 className="font-semibold mb-2">Parâmetros</h3>
                  <div className="flex flex-col gap-2">
                    {parametrosIda.map((item, idx) => (
                      <Controller
                        key={item.id_check}
                        name={`listacheckida.${listacheckida.findIndex(i => i.id_check === item.id_check)}.status`}
                        control={control}
                        render={({ field }) => (
                          <Label
                            htmlFor={`ida-${item.id_check}`}
                            className={`flex border p-4 rounded-md gap-2 cursor-pointer transition
                              ${field.value ? "bg-blue-100 border-blue-500 text-blue-700" : "bg-white hover:bg-blue-50"}`}
                          >
                            <Checkbox
                              id={`ida-${item.id_check}`}
                              checked={field.value}
                              onCheckedChange={field.onChange}
                              className="data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600 data-[state=checked]:text-white"
                            />
                            <span>{item.descricao}</span>
                          </Label>
                        )}
                      />
                    ))}
                  </div>
                </div>
                {/* Mantimentos */}
                <div className="flex-1">
                  <h3 className="font-semibold mb-2">Mantimentos</h3>
                  <div className="flex flex-col gap-2">
                    {mantimentosIda.map((item, idx) => (
                      <Controller
                        key={item.id_check}
                        name={`listacheckida.${listacheckida.findIndex(i => i.id_check === item.id_check)}.status`}
                        control={control}
                        render={({ field }) => (
                          <Label
                            htmlFor={`ida-${item.id_check}`}
                            className={`flex border p-4 rounded-md gap-2 cursor-pointer transition
                              ${field.value ? "bg-blue-100 border-blue-500 text-blue-700" : "bg-white hover:bg-blue-50"}`}
                          >
                            <Checkbox
                              id={`ida-${item.id_check}`}
                              checked={field.value}
                              onCheckedChange={field.onChange}
                              className="data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600 data-[state=checked]:text-white"
                            />
                            <span>
                              {item.descricao.startsWith("01 Kit Almoço:") ? (
                                <>
                                  <strong>01 Kit Almoço:</strong>
                                  {item.descricao.replace("01 Kit Almoço:", "")}
                                </>
                              ) : (
                                item.descricao
                              )}
                            </span>
                          </Label>
                        )}
                      />
                    ))}
                  </div>
                </div>
                {/* Itens */}
                <div className="flex-1">
                  <h3 className="font-semibold mb-2">Itens</h3>
                  <div className="flex flex-col gap-2">
                    {itensIda.map((item, idx) => (
                      <Controller
                        key={item.id_check}
                        name={`listacheckida.${listacheckida.findIndex(i => i.id_check === item.id_check)}.status`}
                        control={control}
                        render={({ field }) => (
                          <Label
                            htmlFor={`ida-${item.id_check}`}
                            className={`flex border p-4 rounded-md gap-2 cursor-pointer transition
                              ${field.value ? "bg-blue-100 border-blue-500 text-blue-700" : "bg-white hover:bg-blue-50"}`}
                          >
                            <Checkbox
                              id={`ida-${item.id_check}`}
                              checked={field.value}
                              onCheckedChange={field.onChange}
                              className="data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600 data-[state=checked]:text-white"
                            />
                            <span>{item.descricao}</span>
                          </Label>
                        )}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Checklist de Volta */}
          <Card>
            <CardHeader>
              <CardTitle>Checklist de Volta</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-row gap-8">
                {/* Parâmetros */}
                <div className="flex-1">
                  <h3 className="font-semibold mb-2">Parâmetros</h3>
                  <div className="flex flex-col gap-2">
                    {parametrosVolta.map((item, idx) => (
                      <Controller
                        key={item.id_check}
                        name={`listacheckvolta.${listacheckvolta.findIndex(i => i.id_check === item.id_check)}.status`}
                        control={control}
                        render={({ field }) => (
                          <Label
                            htmlFor={`volta-${item.id_check}`}
                            className={`flex border p-4 rounded-md gap-2 cursor-pointer transition
                              ${field.value ? "bg-blue-100 border-blue-500 text-blue-700" : "bg-white hover:bg-blue-50"}`}
                          >
                            <Checkbox
                              id={`volta-${item.id_check}`}
                              checked={field.value}
                              onCheckedChange={field.onChange}
                              className="data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600 data-[state=checked]:text-white"
                            />
                            <span>{item.descricao}</span>
                          </Label>
                        )}
                      />
                    ))}
                  </div>
                </div>
                {/* Mantimentos */}
                <div className="flex-1">
                  <h3 className="font-semibold mb-2">Mantimentos</h3>
                  <div className="flex flex-col gap-2">
                    {mantimentosVolta.map((item, idx) => (
                      <Controller
                        key={item.id_check}
                        name={`listacheckvolta.${listacheckvolta.findIndex(i => i.id_check === item.id_check)}.status`}
                        control={control}
                        render={({ field }) => (
                          <Label
                            htmlFor={`volta-${item.id_check}`}
                            className={`flex border p-4 rounded-md gap-2 cursor-pointer transition
                              ${field.value ? "bg-blue-100 border-blue-500 text-blue-700" : "bg-white hover:bg-blue-50"}`}
                          >
                            <Checkbox
                              id={`volta-${item.id_check}`}
                              checked={field.value}
                              onCheckedChange={field.onChange}
                              className="data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600 data-[state=checked]:text-white"
                            />
                            <span>{item.descricao}</span>
                          </Label>
                        )}
                      />
                    ))}
                  </div>
                </div>
                {/* Itens */}
                <div className="flex-1">
                  <h3 className="font-semibold mb-2">Itens</h3>
                  <div className="flex flex-col gap-2">
                    {itensVolta.map((item, idx) => (
                      <Controller
                        key={item.id_check}
                        name={`listacheckvolta.${listacheckvolta.findIndex(i => i.id_check === item.id_check)}.status`}
                        control={control}
                        render={({ field }) => (
                          <Label
                            htmlFor={`volta-${item.id_check}`}
                            className={`flex border p-4 rounded-md gap-2 cursor-pointer transition
                              ${field.value ? "bg-blue-100 border-blue-500 text-blue-700" : "bg-white hover:bg-blue-50"}`}
                          >
                            <Checkbox
                              id={`volta-${item.id_check}`}
                              checked={field.value}
                              onCheckedChange={field.onChange}
                              className="data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600 data-[state=checked]:text-white"
                            />
                            <span>{item.descricao}</span>
                          </Label>
                        )}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </div>
  );
}