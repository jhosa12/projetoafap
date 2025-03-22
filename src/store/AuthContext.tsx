import { ReactNode, createContext, useCallback, useContext, useEffect, useState } from 'react';
import { api } from "../lib/axios/apiClient"
import { destroyCookie, setCookie} from "nookies"
import Router from 'next/router';
import { toast } from 'react-toastify';
import {  AssociadoProps, ConvProps, DadosCadastro,  ObitoProps } from '@/types/associado';
import { SignInProps, UserProps } from '@/types/user';
import { EmpresaProps } from '@/types/empresa';
import { PlanosProps } from '@/types/planos';
import { CidadesProps } from '@/types/cidades';
import { ConsultoresProps } from '@/types/consultores';
import { decode } from 'jsonwebtoken';
import useApiPost from '@/hooks/useApiPost';




type AuthContextData = {
    usuario: UserProps | undefined,
   // userLogged(): boolean,
    consultores: Array<ConsultoresProps>,
    cidades:Array<CidadesProps>,
    planos:Array<PlanosProps>,
    sign: (credentials: SignInProps) => Promise<void>,
    signOut: () => void,
    closeModa: (fields: Partial<DadosCadastro>) => void,
    setarServico: (fields: Partial<ObitoProps>) => void,
    servico: Partial<ObitoProps>,
    data: Partial<DadosCadastro>,
    dadosassociado: Partial<AssociadoProps> | undefined,
    carregarDados: (id:number) => Promise<void>,
    setarListaConv: (fields: Partial<ConvProps>) => void,
    listaConv: Partial<ConvProps>,
    limparDados:()=>void,
    setarDadosAssociado:(fields:Partial<AssociadoProps>)=>void
    permissoes:Array<string>
    setPermissoes:(array:Array<string>)=>void,
    empresas:Array<EmpresaProps>
    getDadosFixos:()=>Promise<void>
    selectEmp:string,
    setSelectEmp:(empresa:string)=>void,
    loading:boolean
    loadingInfo:boolean
    infoEmpresa:EmpresaProps|null
}



export const AuthContext = createContext({} as AuthContextData)


export function signOut() {
    
    try {
        destroyCookie(undefined, '@nextauth.token')
        Router.push('/')
    } catch (err) {
       toast.error('Erro ao deslogar')
    }
};


export function useAuth() {
    return useContext(AuthContext);
  }

export function AuthProvider({ children }: { children: ReactNode }) {
    const [usuario, setUser] = useState<UserProps>();
    const [listaConv, setLista] = useState<Partial<ConvProps>>({ convalescenca_prod: [] });
    const [dadosassociado, setDadosAssociado] = useState<Partial<AssociadoProps>>({});
    const [data, setData] = useState<Partial<DadosCadastro>>({});
    const [empresas,setEmpresas] = useState<Array<EmpresaProps>>([])
    const [planos, setPlanos] = useState<Array<PlanosProps>>([]);
   const [cidades, setCidades] = useState<Array<CidadesProps>>([]);
   const [consultores, setConsultores] = useState<Array<ConsultoresProps>>([]);
   const [selectEmp,setSelectEmp] = useState('')
  const [loading, setLoading] = useState(false) 
    const [servico, setServico] = useState<Partial<ObitoProps>>({ hr_sepultamento: new Date(), end_hora_falecimento: new Date(), end_hora_informaram: new Date() });
    const [permissoes,setPermissoes] =useState<Array<string>>([])
    const {data:infoEmpresa,loading:loadingInfo,postData:reqInfoEmpresa}= useApiPost<EmpresaProps,{id:string}>('/empresa/infoEmpresa')
   /* const [token,setToken] = useState(()=>{
        const { "@nextauth.token": tokenAuth } = parseCookies();
        if(tokenAuth){
            return tokenAuth
        }
        return ""
    })*/

  /*  const userLogged = useCallback(() => {
        const { "@nextauth.token": tokenAuth } = parseCookies();
        if (tokenAuth) {
          return true;
        }
        return false;
      }, []);*/


      const getDadosFixos = async() => {
            if(empresas.length>0) return
     
        try {
            const response = await api.post("/dadosFixos")
           
            setEmpresas(response.data.empresas||[]);
            setCidades(response.data.cidades||[]);
            setConsultores(response.data.consultores||[]);
            setPlanos(response.data.planos||[]);
        } catch (error) {
            console.log(error)
        }
       
      }



      useEffect(()=>{
        if(selectEmp){
            reqInfoEmpresa({id:selectEmp})
           // limparDados()
        }
      },[selectEmp])




    const sign = useCallback(async ({ user, password }: SignInProps) => {
        try {
            const response = await api.post('/session', { usuario: user.trim(), password });
            const { id, tokenAuth, cargo, dir, nome, image } = response.data;

         

            if (typeof window !== 'undefined') {
                localStorage.setItem('@user.image', image);
            }
            const decodeToken = decode(tokenAuth);
            const { permissoes } = decodeToken as { permissoes: string };
            const parsedPermissoes = typeof permissoes === 'string' ? JSON.parse(permissoes) : permissoes ?? [];
            const emp = parsedPermissoes.find((item: string) => item.includes('EMP'));
           setSelectEmp(emp.split('EMP')[1]);
     
            setCookie(undefined, '@nextauth.token', tokenAuth, {
                maxAge: 60 * 60 * 24 * 1,
                path: "/",
               // httpOnly: true,// Oculta o cookie do JavaScript no cliente
            });
          //  setToken(tokenAuth)

           // await userToken();
       //  const  parsedPermissoes = typeof permissoes === 'string' ? JSON.parse(permissoes) : permissoes ?? [];
            api.defaults.headers["Authorization"] = `Bearer ${tokenAuth}`;
           setUser({ id: id, nome: nome.toUpperCase(), cargo, dir, image: image ?? '' });
            Router.push("/dashboard/admcontrato");

        } catch (err) {
            toast.error('Erro no Login');
           // console.log(err)
        }
    }, []);

   

    const closeModa = useCallback((fields: Partial<DadosCadastro>) => {
        setData(prev => ({ ...prev, ...fields }));
    }, []);

    const setarServico = useCallback((fields: Partial<ObitoProps>) => {
        setServico(prev => ({ ...prev, ...fields }));
    }, []);

    const setarListaConv = useCallback((fields: Partial<ConvProps>) => {
        setLista(prev => ({ ...prev, ...fields }));
    }, []);




    const carregarDados = async (id:number) => {
     setLoading(true)
        limparDados();
        try {
            const response = await api.post('/associado', {
                id_global: id,
                empresa: data.empresa
            });
           
            setDadosAssociado(response.data);
        } catch (error) {
            toast.error('Erro na requisição');
        }
        setLoading(false)
    };

    const setarDadosAssociado = useCallback((fields: Partial<AssociadoProps>) => {
        setDadosAssociado(prev => ({ ...prev, ...fields }));
    }, []);

    const limparDados = useCallback(() => {
        setDadosAssociado({
            id_global:null,
            acordo: [],
            bairro: '',
            celular1: '',
            celular2: '',
            cep: '',
            cidade: '',
            nome: undefined,
            id_associado: undefined,
            endereco: '',
            mensalidade: [],
            data_nasc: undefined,
            cpfcnpj: undefined,
            dependentes: [],
            telefone: undefined,
            uf: undefined,
            contrato: undefined,
            guia_rua: undefined,
            email: undefined,
            numero: undefined,
            profissao: undefined,
            rg: undefined,
            sexo: undefined
        });
    }, []);




    return (
        <AuthContext.Provider value={{infoEmpresa,loadingInfo,loading,selectEmp,setSelectEmp,getDadosFixos,planos,consultores,cidades,empresas,permissoes,setPermissoes, setarDadosAssociado, limparDados, usuario, sign, signOut, data, closeModa, dadosassociado, carregarDados, setarServico, servico, listaConv, setarListaConv }}>
            {children}
        </AuthContext.Provider>
    );
}