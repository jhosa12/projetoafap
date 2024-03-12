
import {GoogleMap,LoadScript,Marker} from '@react-google-maps/api'
import React from 'react'

interface MapProps{
    lat:number,
    lng:number
}

const Map:React.FC<MapProps> =({lat,lng}:MapProps)=>{
    return(
        <LoadScript googleMapsApiKey='AIzaSyDlRkS1K2FQ8dqXsO0zK5-RPh2v7zs0HZQ'>
            <GoogleMap mapContainerStyle={{width:'100%',height:'500px'}} center={{lat,lng}} zoom={10}>
            <Marker position={{lat,lng}}/>
            </GoogleMap>

        </LoadScript>
    )

}

export default Map;