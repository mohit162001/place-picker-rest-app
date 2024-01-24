import { useEffect, useState } from "react";
import Places from "./Places.jsx";
import Error from "./Error.jsx";
import { sortPlacesByDistance } from "../loc.js";

export default function AvailablePlaces({ onSelectPlace }) {
  const [availablePlaces, setAvailablePlaces] = useState([]);
  const [isLoading,setIsLoading] = useState(true);
  const [showError,setShowError] = useState(null)

  useEffect(()=>{
    async function fetchPlaces(){
      setIsLoading(true)
      try{
      const response = await fetch("http://localhost:5000/places");
      const data = await response.json();
      if(!response.ok){
        throw new Error('failed to fetch')
      }
      navigator.geolocation.getCurrentPosition((position)=>{
        const sortedPlaces = sortPlacesByDistance(data.places,position.coords.latitude,position.coords.longitude)
        setAvailablePlaces(sortedPlaces);
        setIsLoading(false)
      })
      }catch(error){
          setShowError(error)  
      }
    }
    fetchPlaces();
  },[])
  
  
  if(showError){
    return <Error/>
  }

  return (
    <Places
      title="Available Places"
      isLoading={isLoading}
      loadingText='Loading....'
      places={availablePlaces}
      fallbackText="No places available."
      onSelectPlace={onSelectPlace}
    />
  );
}
