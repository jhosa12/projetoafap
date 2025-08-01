

interface Props {
    inLocale:{
        lat_In:number,
        lng_In:number
    },
    outLocale?:{
        lat_Out?:number,
        lng_Out?:number
    }
}


export const OpenLocaleMaps = ({inLocale,outLocale}:Props) => {
    let url
   inLocale.lat_In &&  outLocale?.lng_Out ? (url = `https://www.google.com/maps/dir/${inLocale.lat_In},${inLocale.lng_In}/${outLocale.lat_Out},${outLocale.lng_Out}`) : (url = `https://www.google.com/maps/dir/${inLocale.lat_In},${inLocale.lng_In}`);
    window.open(url, '_blank');
    
}
