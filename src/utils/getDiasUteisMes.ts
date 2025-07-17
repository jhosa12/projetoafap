import { eachDayOfInterval, isWeekend} from "date-fns";




export const getDiasUteisMes = (start: Date, end: Date) => {

  const diasUteis = eachDayOfInterval({start,end}).filter((day)=>!isWeekend(day));
   
  return diasUteis.length;
};
