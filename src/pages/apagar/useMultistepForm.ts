import { ReactElement, useState } from "react";


export function useMultistep(steps:ReactElement[]){
    const [currentIndex,setCurrentIndex] =useState(0)

    function next(){
        setCurrentIndex(i=>{
            if(i==steps.length-1) return i
            return i+1
        })
    }

    function back(){
        setCurrentIndex(i=>{
            if(i==0) return i
            return i-1
        })

    }


return{
    currentIndex,
    step:steps[currentIndex],
    steps,
    next,
    back
}
}