console.log("Holiday Home Booking website loaded!");
// Sample property data
const properties = [
    { name: "Beachfront Villa", location: "Miami", price: "$200/night", image: "https://via.placeholder.com/300" },
    { name: "Mountain Cabin", location: "Denver", price: "$150/night", image: "https://via.placeholder.com/300" },
    { name: "City Apartment", location: "New York", price: "$180/night", image: "https://via.placeholder.com/300" }
];

// Function to display properties
function displayProperties() {
    const propertyList = document.getElementById("property-list");
    propertyList.innerHTML = ""; // Clear existing content

    properties.forEach(property => {
        const propertyDiv = document.createElement("div");
        propertyDiv.classList.add("property");
        propertyDiv.innerHTML = `
            <img src="${property.image}" alt="${property.name}" width="100%">
            <h3>${property.name}</h3>
            <p>${property.location}</p>
            <p><strong>${property.price}</strong></p>
            <button>Book Now</button>
        `;
        propertyList.appendChild(propertyDiv);
    });
}

// Function to filter properties based on search input
function searchHomes() {
    const locationInput = document.getElementById("location").value.toLowerCase();
    const filteredProperties = properties.filter(property => property.location.toLowerCase().includes(locationInput));
    
    if (filteredProperties.length > 0) {
        properties.length = 0;
        properties.push(...filteredProperties);
    }
    
    displayProperties();
}

// Load properties on page load
window.onload = displayProperties;
