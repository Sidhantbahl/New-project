const usernmaneInputElement = document.getElementById("username");
console.log(usernmaneInputElement);

usernmaneInputElement.addEventListener("keydown", async(e) =>{
    e.preventDefault();
    console.log("Key up!",e);
    
    const username=e.target.value;
    const baseUrl = "https://pokeapi.co/api/v2/evolution-chain/?limit=20&offset=20";
    console.log(baseUrl);

    try{
        const response = await fetch(baseUrl);
        const userData = await response.json();
        console.log("User's name", userData.name);
        const profileElement = document.getElementById("profile");
        profileElement.innerHTML = `
          <div>${userData.name}</div>
        `;
  } catch (err) {
    console.log("Aww...", err);
  }
});