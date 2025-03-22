







export default function Carne(){


    return (
        <ul className="flex flex-col w-full justify-center items-center pt-4">
      
          
            <li   style={{backgroundImage: "url('/carneAtualizado.png')",
                
height: '250px',
width:'100%',
                backgroundSize:'cover',
                backgroundPosition: 'center',}} className="inline-flex w-full text-black text-xs ">
            
              {//  <Image src={carne} className=" object-cover  h-[250px]" alt="modeloCarne"  />
              }
        <div className="space-y-4">
        <h1 className="mt-2 pl-20 " style={{fontSize:'13px',paddingLeft:32 }} >ASSISTENCIA FAMILIAR PARAÍSO</h1>
              <div className="inline-flex pl-8 w-full ">
                <span>10</span>
                <span className="flex w-full justify-end">10</span>
              </div>
              <div className="inline-flex pl-10 w-full ">
            
                <span className="flex w-full justify-end">10</span>
              </div>
              <div className="inline-flex  w-full ">
            
            <span className="flex w-full justify-end">10</span>
          </div>
          <div className="inline-flex  w-full ">
            
            <span className="flex w-full justify-end">10</span>
          </div>


          <div className="inline-flex  w-full ">
            
            <span className="flex w-full justify-start pl-2">10</span>
          </div>

          <div className="inline-flex  w-full ">
            
            <span className="flex w-full justify-center pt-8 ">10</span>
          </div>
          
        </div>

 
 
 
 
 
 
 
       <div className="space-y-3">
        <h1 className="mt-2 pl-8" style={{fontSize:'13px', fontWeight: 'bold' }} >ASSISTENCIA FAMILIAR PARAÍSO</h1>

        <div className="inline-flex pl-8 pt-1 w-full ">
                <span className="pl-2">10</span>
               
              </div>
              <div className="inline-flex pl-8 w-full pt-1 ">
                <span className="pl-2">10</span>
               
              </div>
              <div className="inline-flex pl-8  w-full ">
                <span className="pl-2 ">10</span>
                <span className="pl-20  ">10</span>
                <span className=" pl-[110px] ">10</span>
                <span className=" flex w-full justify-end pl-20">10</span>
               
              </div>
        </div>
         
          
           
           
          
       
           
          
           
          
           
         {/*   <div style={{position: 'absolute', left: '720px', top: '290px',width:'300px',height:'30px',zIndex:2 }}>
                {it.n_doc && <BarCode
                 width={3}
                  height={30} 
                  fontSize={10}
                  textMargin={0}
                  margin={0}
                
                  value={it.n_doc}/>}
              
            </div>*/}
        </li>
          

        
        </ul>
    );
}