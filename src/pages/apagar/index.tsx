import { useMultistep } from "./useMultistepForm";



export default function Apagar(){
    const {step,currentIndex,next,back,steps} = useMultistep([<div>One</div>,<div>Two</div>,<div>Three</div>])

    return <div className="relative p-8 m-8 border-[1px] border-solid border-black rounded-lg">
        <form>
            <div className="absolute top-2 right-2">
                    {currentIndex}/{steps.length-1}
            </div>
            {step}
            <div className="mt-4 flex justify-end gap-3 ">
               {currentIndex>0 && <button type="button" onClick={back}>Back</button>}
                <button type="button" onClick={next}>Next</button>
            </div>
        </form>
    </div>
}