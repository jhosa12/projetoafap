import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Controller, useFormContext } from "react-hook-form"
import { listacheckida, listacheckvolta } from "@/app/dashboard/servicos/_mock/dados-checklist"


export const DadosCheckList = () => {

  const { control } = useFormContext()


  return (
    <div>
      <Card className="bg-white border-gray-200 shadow-none ">
        <CardHeader>

          <CardTitle>
            Checklist de Procedimentos
          </CardTitle>
          <CardDescription>
            Utilize o checklist para garantir que todas as etapas do
            processo foram realizadas corretamente.
            Marque cada item conforme for concluído.
          </CardDescription>
        </CardHeader>

        <CardContent className="flex justify-center gap-4 sm:gap-8 md:gap-16 lg:gap-32">
          <Card>
            <CardHeader>
              <CardTitle>
                Checklist de Ida
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-2">
                {listacheckida.map((item, idx) => (
                  <Controller
                    key={item.id_check}
                    name={`listacheckida.${idx}.status`}
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
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>
                Checklist de Volta
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-2">
                {listacheckvolta.map((item, idx) => (
                  <Controller
                    key={item.id_check}
                    name={`listacheckvolta.${idx}.status`}
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
            </CardContent>

          </Card>
        </CardContent>

      </Card>
    </div>
  )
}