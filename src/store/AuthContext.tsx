"use client";

import {
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { api } from "../lib/axios/apiClient";
import { destroyCookie } from "nookies";
import { AssociadoProps } from "@/app/dashboard/admcontrato/_types/associado";
import { SignInProps, UserProps } from "@/types/user";
import { EmpresaProps } from "@/types/empresa";
import { PlanosProps } from "@/types/planos";
import { BairroProps, CidadesProps } from "@/types/cidades";
import { ConsultoresProps } from "@/types/consultores";
import { useAuthActions } from "@/hooks/useAuthActions";
import useApiGet from "@/hooks/useApiGet";
import { toast } from "sonner";
import { UfProps } from "@/types/ufs"
import { PlanoContasProps } from "@/app/dashboard/financeiro/_types/plano-contas";
import useActionsPlanoContas from "@/app/dashboard/financeiro/_hooks/use_actions_planoContas";


type AuthContextData = {
  usuario?: UserProps;
  consultores: ConsultoresProps[];
  cidades: CidadesProps[];
  planos: PlanosProps[];
  signIn: (credentials: SignInProps) => Promise<void>;
  signOut: () => void;
  carregarDados: (id: number) => Promise<void>;
  limparDados: () => void;
  dadosassociado: Partial<AssociadoProps> | AssociadoProps;
  setarDadosAssociado: (fields: Partial<AssociadoProps>) => void;
  permissoes: string[];
  empresas: EmpresaProps[];
  getDadosFixos: () => Promise<void>;
  selectEmp: string;
  setSelectEmp: (empresa: string) => void;
  loading: boolean;
  loadingInfo: boolean;
  infoEmpresa: EmpresaProps | null;
  bairrosEmpresa: Array<{ cidade: string; bairro: string }>;
  cidadesEmpresa: Array<string>
  bairrosUnicos: Array<string>
  getBairrosUnicos: () => Promise<void>
  ufs: UfProps[]
  actions_plano_contas: {
    array_plano_contas?: Array<PlanoContasProps>,
    post_conta: () => Promise<void>,
    put_conta: () => Promise<void>
  }
};

export const AuthContext = createContext({} as AuthContextData);

export function signOut() {

  try {
    window.location.href = "/";
    destroyCookie(undefined, "@nextauth.token");
    delete api.defaults.headers["Authorization"];
  } catch (err) {
    toast.error("Erro ao deslogar");
  }
}

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [dadosassociado, setDadosAssociado] = useState<Partial<AssociadoProps>>(
    {}
  );
  const [empresas, setEmpresas] = useState<Array<EmpresaProps>>([]);
  const [cidades, setCidades] = useState<Array<CidadesProps>>([]);
  const [consultores, setConsultores] = useState<Array<ConsultoresProps>>([]);
  const [bairrosUnicos, setBairrosUnicos] = useState<Array<BairroProps>>([]);
  const [selectEmp, setSelectEmp] = useState("");
  const [loading, setLoading] = useState(false);
  const [ufs, setUfs] = useState<UfProps[]>([]);
  const { permissoes, signIn, usuario, signOut } = useAuthActions();
  const actions_plano_contas = useActionsPlanoContas(usuario)

  const {
    data: infoEmpresa,
    loading: loadingInfo,
    postData: reqInfoEmpresa,
  } = useApiGet<EmpresaProps, { id: string }>("/empresa/infoEmpresa");


  const getBairros = async () => {
    const res = await api.post("/bairro/listar", { id_empresa: selectEmp })
    setBairrosUnicos(res.data)
  }

  const getDadosFixos = async () => {
    if (
      empresas.length > 0 &&
      cidades.length > 0 &&
      consultores.length > 0
      // planos.length > 0
    )
      return;

    try {
      const response = await api.post("/dadosFixos");
      const cidadesData = response.data.cidades || [];
      setEmpresas(response.data.empresas || []);
      setCidades(cidadesData);
      setConsultores(response.data.consultores || []);
      // setPlanos(response.data.planos || []);

      if (cidadesData.length > 0) {
        // Usamos um Map para garantir UFs únicas, guardando o ID e a sigla
        const ufsMap = new Map<number, UfProps>();

        cidadesData.forEach((cidade: CidadesProps) => {
          // Verifica se já adicionamos esta UF (pela chave, que é o ID do estado)
          if (!ufsMap.has(cidade.estado)) {

            ufsMap.set(cidade.estado, {
              id: cidade.estado,
              sigla: cidade.uf,

            });
          }
        });

        // Converte os valores do Map (os objetos UfProps) em um array
        const ufsFormatadas = Array.from(ufsMap.values());

        // Opcional, mas recomendado: Ordena a lista final alfabeticamente pela sigla
        ufsFormatadas.sort((a, b) => a.sigla.localeCompare(b.sigla));

        // Salva no estado. Agora o tipo está correto!
        setUfs(ufsFormatadas);
      }
    } catch (error) {
      console.log(error);
    }
  };


  useEffect(() => {
    if (!usuario) signOut();
    if (usuario) getBairros()
  }, [usuario]);

  useEffect(() => {
    if (selectEmp) {
      reqInfoEmpresa({ id: selectEmp });
      // limparDados()
    }
  }, [selectEmp]);

  // useEffect(() => {
  //   if (permissoes && permissoes.length > 0) {
  //     const emp = permissoes?.find((item: string) => item.startsWith("EMP"));
  //     emp && setSelectEmp(emp?.split("EMP")[1] ?? "");
  //   }
  // }, [permissoes]);

  const carregarDados = async (id: number) => {

    setLoading(true);
    if(dadosassociado.id_global) limparDados();
    try {
      const response = await api.post("/associado", {
        id_global: id,
        empresa: selectEmp,
      });

      setDadosAssociado(response.data);
      // return response.data; 
    } catch (error) {
      toast.error("Erro na requisição");
    }
    setLoading(false);
  };

  const setarDadosAssociado = useCallback((fields: Partial<AssociadoProps>) => {
    setDadosAssociado((prev) => ({ ...prev, ...fields }));
  }, []);

  const limparDados = useCallback(() => {
    setDadosAssociado({} as AssociadoProps);
  }, []);


  return (
    <AuthContext.Provider
      value={{
        bairrosUnicos: bairrosUnicos.map((item) => item.nome_bairro),
        getBairrosUnicos: getBairros,
        infoEmpresa,
        loadingInfo,
        loading,
        selectEmp,
        setSelectEmp,
        getDadosFixos,
        planos: infoEmpresa?.planos ?? [],
        consultores,
        cidades,
        ufs,
        empresas,
        permissoes,
        setarDadosAssociado,
        limparDados,
        usuario,
        signIn,
        signOut,
        dadosassociado,
        carregarDados,
        bairrosEmpresa: infoEmpresa?.bairros ?? [],
        cidadesEmpresa: infoEmpresa?.cidades?.map(item=>item.cidade) ?? [],
        actions_plano_contas
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
