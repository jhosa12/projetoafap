import {ReactNode} from 'react'
interface Props{
    title:string,
    children:ReactNode
}
export function FormWrapper({title,children}:Props){
  return <>
    <h2 className='text-center m-0 mb-2'>{title}</h2>
    <div className='flex '>{children}</div>
  </>  
}