const usernameInputElement = document.getElementById("username");
console.log(usernameInputElement);

usernameInputElement.addEventListener("keydown", async (e) => {
  e.preventDefault();
  console.log("Key up!", e);

  const username = e.target.value;
  console.log(username);

  const baseUrl = "https://api.github.com/users/" + username;
  console.log(baseUrl);

  try {
    const response = await fetch(baseUrl);
    const userData = await response.json();
    console.log("User Location: ", userData.location);

    const profileElement = document.getElementById("profile");
    profileElement.innerHTML = `
      <div>${userData.location}</div>
    `;
  } catch (err) {
    console.log("Aww...", err);
  }
});