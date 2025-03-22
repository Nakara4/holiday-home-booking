// Sample property data
const properties = [
    { id: 1, name: "Beachfront Villa", location: "Miami", price: "$200/night", image: "https://via.placeholder.com/300", description: "A beautiful villa with ocean views." },
    { id: 2, name: "Mountain Cabin", location: "Denver", price: "$150/night", image: "https://via.placeholder.com/300", description: "Cozy cabin surrounded by nature." },
    { id: 3, name: "City Apartment", location: "New York", price: "$180/night", image: "https://via.placeholder.com/300", description: "Modern apartment in the heart of the city." }
];

// Function to display properties on the home page
function displayProperties() {
    const propertyList = document.getElementById("property-list");
    propertyList.innerHTML = "";

    properties.forEach(property => {
        const propertyDiv = document.createElement("div");
        propertyDiv.classList.add("property");
        propertyDiv.innerHTML = `
            <img src="${property.image}" alt="${property.name}" width="100%">
            <h3>${property.name}</h3>
            <p>${property.location}</p>
            <p><strong>${property.price}</strong></p>
            <button onclick="viewProperty(${property.id})">View More</button>
        `;
        propertyList.appendChild(propertyDiv);
    });
}

// Function to redirect to property details page
function viewProperty(propertyId) {
    localStorage.setItem("selectedProperty", JSON.stringify(properties.find(p => p.id === propertyId)));
    window.location.href = "property.html";
}

// Function to display property details on `property.html`
function displayPropertyDetails() {
    const property = JSON.parse(localStorage.getItem("selectedProperty"));
    if (!property) {
        document.getElementById("property-details").innerHTML = "<p>No property selected.</p>";
        return;
    }

    document.getElementById("property-details").innerHTML = `
        <img src="${property.image}" alt="${property.name}">
        <h2>${property.name}</h2>
        <p>${property.location}</p>
        <p><strong>${property.price}</strong></p>
        <p>${property.description}</p>
        <button class="book-now">Book Now</button>
    `;
}

// Load the property details only if on `property.html`
if (window.location.pathname.includes("property.html")) {
    displayPropertyDetails();
}

// Load properties on home page
if (window.location.pathname.includes("index.html") || window.location.pathname === "/") {
    window.onload = displayProperties;
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

// Function to handle form submission
document.addEventListener("DOMContentLoaded", function () {
    const bookingForm = document.getElementById("bookingForm");

    if (bookingForm) {
        bookingForm.addEventListener("submit", function (event) {
            event.preventDefault();

            const name = document.getElementById("name").value;
            const email = document.getElementById("email").value;
            const checkIn = document.getElementById("check-in").value;
            const checkOut = document.getElementById("check-out").value;

            if (name && email && checkIn && checkOut) {
                document.getElementById("confirmationMessage").innerText = `Thank you, ${name}! Your booking has been confirmed from ${checkIn} to ${checkOut}.`;
                document.getElementById("confirmationMessage").classList.remove("hidden");

                // Optionally, clear the form after submission
                bookingForm.reset();
            }
        });
    }
});

// Function to handle form submission and store booking details
document.addEventListener("DOMContentLoaded", function () {
    const bookingForm = document.getElementById("bookingForm");

    if (bookingForm) {
        bookingForm.addEventListener("submit", function (event) {
            event.preventDefault();

            const name = document.getElementById("name").value;
            const email = document.getElementById("email").value;
            const checkIn = document.getElementById("check-in").value;
            const checkOut = document.getElementById("check-out").value;

            if (name && email && checkIn && checkOut) {
                const booking = { name, email, checkIn, checkOut };
                let bookings = JSON.parse(localStorage.getItem("bookings")) || [];
                bookings.push(booking);
                localStorage.setItem("bookings", JSON.stringify(bookings));

                document.getElementById("confirmationMessage").innerText = `Thank you, ${name}! Your booking is confirmed from ${checkIn} to ${checkOut}.`;
                document.getElementById("confirmationMessage").classList.remove("hidden");

                bookingForm.reset();
            }
        });
    }
});

// Function to display stored bookings (for future implementation)
function displayBookings() {
    let bookings = JSON.parse(localStorage.getItem("bookings")) || [];
    console.log("Saved Bookings:", bookings);
}

