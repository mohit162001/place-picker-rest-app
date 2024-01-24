import { useRef, useState, useEffect} from 'react';

import Places from './components/Places.jsx';
import Modal from './components/Modal.jsx';
import DeleteConfirmation from './components/DeleteConfirmation.jsx';
import logoImg from './assets/logo.png';
import AvailablePlaces from './components/AvailablePlaces.jsx';
import { updateUserData } from './components/http.js';
import Error from './components/Error.jsx';

function App() {
  const selectedPlace = useRef();

  const [userPlaces, setUserPlaces] = useState([]);

  const [modalIsOpen, setModalIsOpen] = useState(false);

  const [isLoading,setIsLoading] = useState(true);

  const [showError,setShowError] = useState(null)

  useEffect(()=>{
    async function fetchUsersPlaces(){
      setIsLoading(true)
      try{
      const response = await fetch("http://localhost:5000/user-places");
      const data = await response.json();
      if(!response.ok){
        throw new Error('failed to fetch')
      }
      setUserPlaces(data.places)
      }catch(error){
          setShowError(error)  
      }
      setIsLoading(false);
    }
    fetchUsersPlaces();
  },[])

  function handleStartRemovePlace(place) {
    setModalIsOpen(true);
    selectedPlace.current = place;
  }

  function handleStopRemovePlace() {
    setModalIsOpen(false);
  }

  async function handleSelectPlace(selectedPlace) {
    setUserPlaces((prevPickedPlaces) => {
      if (!prevPickedPlaces) {
        prevPickedPlaces = [];
      }
      if (prevPickedPlaces.some((place) => place.id === selectedPlace.id)) {
        return prevPickedPlaces;
      }
      return [selectedPlace, ...prevPickedPlaces];
    });  
    try{
      const response = await updateUserData([selectedPlace,...userPlaces])
      if(!response.ok){
        throw new Error('something went wrong')
      }
    }catch(error){
      console.log(error)
    }
    
  }

  async function handleRemovePlace() {
    setUserPlaces((prevPickedPlaces) =>
      prevPickedPlaces.filter((place) => place.id !== selectedPlace.current.id)
    );
    await updateUserData(userPlaces.filter((place) => place.id !== selectedPlace.current.id))
    setModalIsOpen(false);
  }
  
  return (
    <>
      <Modal open={modalIsOpen} onClose={handleStopRemovePlace}>
        <DeleteConfirmation
          onCancel={handleStopRemovePlace}
          onConfirm={handleRemovePlace}
        />
      </Modal>

      <header>
        <img src={logoImg} alt="Stylized globe" />
        <h1>Place Picker</h1>
        <p>
          Create your personal collection of places you would like to visit or
          you have visited.
        </p>
      </header>
      <main>
        {showError?<Error/>:''}
        {!showError?<Places
          title="I'd like to visit ..."
          isLoading={isLoading}
          loadingText='Loading....'
          fallbackText="Select the places you would like to visit below."
          places={userPlaces}
          onSelectPlace={handleStartRemovePlace}
        />:''}

        <AvailablePlaces onSelectPlace={handleSelectPlace} />
      </main>
    </>
  );
}

export default App;
