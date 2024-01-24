export async function updateUserData(places){
    const response = await fetch('http://localhost:5000/user-places',{
      method:'PUT',
      body: JSON.stringify({places}),
      headers:{
        'Content-type':'application/json'
      }
    });
    console.log(response)
    const data = await response.json();

    if(!response.ok){
      throw new Error('Somthing went wrong ')
    }
    console.log(data.message)
    return data.message;
  }