import { ReactNode, createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { api } from "../services/apiClient"
import { destroyCookie, setCookie, parseCookies } from "nookies"
import Router from 'next/router';
import { decode } from 'jsonwebtoken'
import { toast } from 'react-toastify';
import {  AssociadoProps, ConvProps, DadosCadastro,  ObitoProps } from '@/types/associado';
import { SignInProps, UserProps } from '@/types/auth';
import { EmpresaProps } from '@/types/empresa';
import { PlanosProps } from '@/types/planos';
import { CidadesProps } from '@/types/cidades';
import { ConsultoresProps } from '@/types/consultores';


type AuthContextData = {
    usuario: UserProps | undefined,
    userLogged(): boolean,
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
    setPermissoes:(array:Array<string>)=>void
  
    empresas:Array<EmpresaProps>
}



export const AuthContext = createContext({} as AuthContextData)


export function signOut() {
    try {
        destroyCookie(undefined, '@nextauth.token')
        Router.push('/')
    } catch (err) {
        console.log("erro ao deslogar")
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
  
    const [servico, setServico] = useState<Partial<ObitoProps>>({ hr_sepultamento: new Date(), end_hora_falecimento: new Date(), end_hora_informaram: new Date() });
    const [permissoes,setPermissoes] =useState<Array<string>>([])
    const [token,setToken] = useState(()=>{
        const { "@nextauth.token": tokenAuth } = parseCookies();
        if(tokenAuth){
            return tokenAuth
        }
        return ""
    })
    


    const userLogged = useCallback(() => {
        const { "@nextauth.token": tokenAuth } = parseCookies();
        if (tokenAuth) {
          return true;
        }
        return false;
      }, []);


      const getDadosFixos = async() => {
            if(empresas.length>0) return
     
        try {
            const response = await api.get("/dadosFixos")
           
            setEmpresas(response.data.empresas||[]);
            setCidades(response.data.cidades||[]);
            setConsultores(response.data.consultores||[]);
            setPlanos(response.data.planos||[]);
        } catch (error) {
            console.log(error)
        }
       
      };




    const sign = useCallback(async ({ user, password }: SignInProps) => {
        try {
            const response = await api.post('/session', { usuario: user.trim(), password });
            const { id, tokenAuth, cargo, dir, nome, image, permissoes } = response.data;

            if (typeof window !== 'undefined') {
                localStorage.setItem('@user.image', image);
            }
            setCookie(undefined, '@nextauth.token', tokenAuth, {
                maxAge: 60 * 60 * 24 * 1,
                path: "/"
            });
            setToken(tokenAuth)

           // await userToken();
       //  const  parsedPermissoes = typeof permissoes === 'string' ? JSON.parse(permissoes) : permissoes ?? [];
            api.defaults.headers["Authorization"] = `Bearer ${tokenAuth}`;
           setUser({ id: id, nome: nome.toUpperCase(), cargo, dir, image: image ?? '' });
            Router.push("/admcontrato");

        } catch (err) {
            toast.error('Erro no Login');
            console.log(err)
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

    useEffect(()=>{
        const { "@nextauth.token": token } = parseCookies();
        if (token) {userToken(token)}
        getDadosFixos()
            
    },[token])

    const userToken = useCallback(async (token:string) => {
       
       
        try {
         
              
                let image;
                if (typeof window !== 'undefined') {
                    image = localStorage.getItem('@user.image');
                }
                const decodeToken = decode(token);
                if (decodeToken && typeof decodeToken === 'object') {
                    const { nome, sub, dir, cargo, permissoes } = decodeToken;
                    setUser({ id: String(sub), nome: nome.toUpperCase(), cargo, dir, image: image ?? '' });
                }
            
        } catch (error) {
            toast.error('Erro ao captar Usuário');
        }
    }, []);

  


   

    const carregarDados = async (id:number) => {
     
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
    };

    const setarDadosAssociado = useCallback((fields: Partial<AssociadoProps>) => {
        setDadosAssociado(prev => ({ ...prev, ...fields }));
    }, []);

    const limparDados = useCallback(() => {
        setDadosAssociado({
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


    const Planos = useCallback(async () => {
        try {
            const response = await api.get('/plano/listar');
            setData(prev => ({ ...prev, planos: response.data }));
        } catch (error) {
            toast.error('Erro na requisição');
        }
    }, []);

    return (
        <AuthContext.Provider value={{planos,consultores,cidades,empresas,permissoes,setPermissoes, setarDadosAssociado, limparDados, usuario, userLogged, sign, signOut, data, closeModa, dadosassociado, carregarDados, setarServico, servico, listaConv, setarListaConv }}>
            {children}
        </AuthContext.Provider>
    );
}