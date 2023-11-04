// Get references to HTML elements
const ipAdd = document.getElementsByClassName("ip")[0];
const startBtn = document.getElementById("get-started");


async function fetchIP() {
    try {
        const response = await fetch(`https://api.ipify.org/?format=json`);
        const data = await response.json();
        ipAdd.innerText = data.ip;
        // Store the IP address in local storage
        storeIp(data);
    } catch (error) {
        console.log(error);
    }
}

fetchIP();


startBtn.addEventListener("click", async () => {
   
    await navigator.geolocation.getCurrentPosition(success, failed);
});


function storeIp(data) {
    localStorage.setItem("ip", data.ip);
}


function success(position) {
    console.log(position);
   
    localStorage.setItem("lat", position.coords.latitude);
    localStorage.setItem("long", position.coords.longitude);
  
    window.location.href = "./main.html";
}

// Error callback function when geolocation is not available or denied
function failed() {
    alert("Please grant access to your location for this application.");
}