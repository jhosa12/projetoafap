import {ReactElement,useState} from "react"

export function MultiStep(steps:ReactElement[]){
    const [currentStepIndex,setCurrentStepIndex]= useState(0)

    function next(){
        setCurrentStepIndex(i=>{
            if(i>=steps.length-1)return i
            return i+1
        })
    }

    function back(){
        setCurrentStepIndex(i=>{
            if(i<=0) return i
            return i-1
        })
    }

    function goTo(index:number){
        setCurrentStepIndex(index)
    }

    return {
        currentStepIndex,
        step:steps[currentStepIndex],
        steps,
        goTo, 
        next,
        back,
        setCurrentStepIndex
    
    } 

}