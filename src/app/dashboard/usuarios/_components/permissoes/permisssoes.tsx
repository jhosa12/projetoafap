import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Building2, Briefcase, ShoppingCart, Heart, Boxes, Wrench, Wallet, Settings } from "lucide-react";
import { TabAdministrativo } from "./administrativo/administrativo";
import { TabComercial } from "./comercial/comercial";
import { TabAfapSaude } from "./afapSaude/afapSaude";
import { TabServicos } from "./servicos/servicos";
import { TabConfiguracoes } from "./configuracoes/configuracoes";
import { TabEstoque } from "./estoque/estoquePermissions";
import { PermissoesEmpresas } from "./empresas/permissoesEmpresas";



interface DataProps{
    permissions:Array<string>,
    handlePermission:(permission:string)=>void

}

export function Permissoes({permissions,handlePermission}:DataProps){


    return(
        <Tabs defaultValue="empresas" className="w-full">
          <TabsList className="flex w-full flex-wrap gap-2">
            <TabsTrigger value="empresas" className="gap-2">
              <Building2 className="h-4 w-4" /> Empresas
            </TabsTrigger>
            <TabsTrigger value="administrativo" className="gap-2">
              <Briefcase className="h-4 w-4" /> Administrativo
            </TabsTrigger>
            <TabsTrigger value="comercial" className="gap-2">
              <ShoppingCart className="h-4 w-4" /> Comercial
            </TabsTrigger>
            <TabsTrigger value="afap-saude" className="gap-2">
              <Heart className="h-4 w-4" /> Afap Saúde
            </TabsTrigger>
            <TabsTrigger value="estoque" className="gap-2">
              <Boxes className="h-4 w-4" /> Estoque
            </TabsTrigger>
            <TabsTrigger value="servicos" className="gap-2">
              <Wrench className="h-4 w-4" /> Serviços
            </TabsTrigger>
            <TabsTrigger value="financeiro" className="gap-2">
              <Wallet className="h-4 w-4" /> Financeiro
            </TabsTrigger>
            <TabsTrigger value="configuracoes" className="gap-2">
              <Settings className="h-4 w-4" /> Configurações
            </TabsTrigger>
          </TabsList>

          <TabsContent value="empresas">
            <PermissoesEmpresas permissions={permissions} handlePermission={handlePermission}/>
          </TabsContent>
          <TabsContent value="administrativo">
            <TabAdministrativo  handlePermission={handlePermission} permissions={permissions}/>
          </TabsContent>
          <TabsContent value="comercial">
            <TabComercial  handlePermission={handlePermission} permissions={permissions}/>
          </TabsContent>
          <TabsContent value="afap-saude">
            <TabAfapSaude handlePermission={handlePermission} permissions={permissions}/>
          </TabsContent>
          <TabsContent value="estoque">
            <TabEstoque handlePermission={handlePermission} permissions={permissions}/>
          </TabsContent>
          <TabsContent value="servicos">
            <TabServicos handlePermission={handlePermission} permissions={permissions}/>
          </TabsContent>
          <TabsContent value="financeiro">
            TESTE22222
          </TabsContent>
          <TabsContent value="configuracoes">
            <TabConfiguracoes permissions={permissions} handlePermission={handlePermission}/>
          </TabsContent>
        </Tabs>
    )
}