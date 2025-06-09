import api from "/modules/api.js";

window.addEventListener("load", () => {
  loadData();
});

const newUserButton = document.getElementById("refresh-users");
newUserButton.addEventListener("click", () => {
  loadData();
});

async function loadData() {
  const contentHolder = document.getElementById("card--holder");
  const loader = document.getElementById("loader");
  
  const result = await api.getFiveUsers();
  let users = result.results;

  if(!users){
    contentHolder.style.display = "none";
    loader.style.display = "block"
  }else{
    contentHolder.style.display = "flex";
    loader.style.display = "none"
  }
  
  for (let i = 0; i < users.length; i++) {
    const card = document.getElementById(i);
    card.querySelector(".user-info h2").textContent =
      users[i].name.first + " " + users[i].name.last;

    card.querySelector(".user-info p").textContent =
      users[i].location.city + ", " + users[i].location.country;

    card.querySelector(".card__img").src = users[i].picture.medium;

  }
}
