

export interface ActionsFunctionsApi{
    actions?:{
        success:()=>void|Promise<void>,
        error?:()=>void|Promise<void>
    }
}