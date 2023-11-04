// Get user's IP address and other elements from the local storage
const ip = localStorage.getItem("ip");
const about = document.getElementsByClassName("about")[0];
const moreInfo = document.getElementsByClassName("more-info")[0];
const cardContainer = document.getElementsByClassName("card-container")[0];
const map = document.getElementsByClassName("map")[0];
const searchInput = document.getElementById("post-ofc-search");
const heroPage = document.getElementById("hero-page");
const loader = document.getElementsByClassName("loader-section")[0];
const userLatitude = localStorage.getItem("lat");
const userLongitude = localStorage.getItem("long");

// Declare variables for message and postal office data
var message;
var postOfcData;

// Display the user's IP address
document.getElementsByClassName('ip-add')[0].innerText = ip;

// Get the current date
const date = new Date();

// Function to fetch and display user information
async function fetchApi(ip) {
    try {
        const response = await fetch(`https://ipapi.co/${ip}/json/`);
        const data = await response.json();

        // Render the map with user's latitude and longitude
        renderMap(data.latitude, data.longitude);

        // Fetch postal office data based on the postal code
        await fetchPostalApi(data.postal);

        // Render user's information and hide the loader
        renderData(data);
        loader.style.display = "none";
        heroPage.style.display = "block";
    } catch (error) {
        console.log(error);
        alert('Server not responding. Please try again.');
    }
}

// Fetch user information based on the IP address
fetchApi(ip);

// Function to render the map with latitude and longitude
function renderMap(lat, long) {
    map.innerHTML = `
    <iframe src="https://maps.google.com/maps?q=${userLatitude}, ${userLongitude}&output=embed" frameborder="0" style="border: 0;"></iframe>
    `;
}

// Function to fetch postal office data based on the postal code
async function fetchPostalApi(pincode) {
    try {
        const response = await fetch(`https://api.postalpincode.in/pincode/${pincode}`);
        const data = await response.json();
        message = data[0].Message;

        // Render postal office data
        renderPostalApiData(data[0].PostOffice);
        postOfcData = data[0].PostOffice;
    } catch (e) {
        console.log(e);
    }
}

// Function to render user information
function renderData(data) {
    console.log(data);
    about.innerHTML = "";
    about.innerHTML = `
    <h1>IP Address:<span class="ip-add">${data.ip}</span></h1>
    <div class="about-r-1">
        <p id="lat">Lat: <span> ${data.latitude}</span></p>
        <p>City: <span>${data.city}</span></p>
        <p>Organisation: <span>${data.org}</span></p>
    </div>
    <div class="about-r-2">
        <p>Long: <span>${data.longitude}</span></p>
        <p>Region: <span>${data.region}</span></p>
        <p>Hostname: <span>${data.network}</span></p>
    </div>
    `;

    moreInfo.innerHTML = "";
    moreInfo.innerHTML = `
    <h3>More Information About You</h3>
    <p>Time Zone: <span>${data.timezone}</span></p>
    <p>Date And Time: <span>${date}</span></p>
    <p>Pincode: <span>${data.postal}</span></p>
    <p >Message: <span>${message}</span></p>
    `;
}

// Function to render postal office data
function renderPostalApiData(data) {
    cardContainer.innerHTML = "";

    data.forEach((ele) => {
        const div = document.createElement("div");
        div.className = "card";
        div.innerHTML = `
        <h4>Name: <span>${ele.Name}</span></h4>
        <h4>Branch Type: <span>${ele.BranchType}</span></h4>
        <h4>Delivery Status: <span>${ele.DeliveryStatus}</span></h4>
        <h4>District: <span>${ele.District}</span></h4>
        <h4>Divison: <span>${ele.Division}</span></h4>
        `;

        cardContainer.appendChild(div);
    });
}


searchInput.addEventListener("keyup", (event) => {
    const searchText = event.target.value.toLowerCase();
    filterPostOfc(searchText, postOfcData);
});


function filterPostOfc(searchText, postOfcData) {
    const filterData = postOfcData.filter((ele) => {
        return ele.Name.toLowerCase().includes(searchText);
    });

    renderPostalApiData(filterData);
}