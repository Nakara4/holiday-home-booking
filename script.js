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

// Function to handle form submission and store booking details
document.addEventListener("DOMContentLoaded", function () {
    let bookingForm = document.getElementById("bookingForm");
    if (bookingForm) {
        bookingForm.addEventListener("submit", function (event) {
            event.preventDefault(); 
            
            let propertyId = document.getElementById("propertyId").value;
            let name = document.getElementById("name").value;
            let email = document.getElementById("email").value; 
            let checkIn = document.getElementById("checkIn").value;
            let checkOut = document.getElementById("checkOut").value;

            if (propertyId && name && email && checkIn && checkOut) {
                saveBooking(propertyId, name, email, checkIn, checkOut);
                window.location.href = "bookings.html"; 
            } else {
                alert("Please fill in all fields.");
            }
        });
    }
});


// Ensure script runs only after the DOM is fully loaded
document.addEventListener("DOMContentLoaded", function () {
    console.log("JavaScript loaded!");  // Debugging log

    // Check if we are on the bookings.html page
    if (document.getElementById("bookingsContainer")) {
        console.log("Calling displayBookings()...");
        displayBookings();  
    }
});

// Function to save a booking
function saveBooking(propertyId, name, email, checkIn, checkOut) {
    let bookings = JSON.parse(localStorage.getItem("bookings")) || [];

    // Check if the property is already booked during the requested dates
    let isBooked = bookings.some(booking => 
        booking.propertyId === propertyId &&
        ((checkIn >= booking.checkIn && checkIn <= booking.checkOut) || 
         (checkOut >= booking.checkIn && checkOut <= booking.checkOut))
    );

    if (isBooked) {
        alert("This property is already booked for the selected dates. Please choose different dates.");
        return;
    }

    // If not booked, save the booking
    let newBooking = { propertyId, name, email, checkIn, checkOut };
    bookings.push(newBooking);
    localStorage.setItem("bookings", JSON.stringify(bookings));

    console.log("Booking saved:", newBooking);
    alert("Booking confirmed!");
}

// Function to display bookings in bookings.html
function displayBookings() {
    let bookings = JSON.parse(localStorage.getItem("bookings")) || [];
    let container = document.getElementById("bookingsContainer");

    console.log("Bookings found:", bookings);  // Debugging log

    if (!container) {
        console.error("Error: bookingsContainer element NOT found in HTML!");
        return;
    }

    if (bookings.length === 0) {
        container.innerHTML = "<p>No bookings yet.</p>";
        console.log("No bookings to display.");
    } else {
        container.innerHTML = "";
        bookings.forEach((booking) => {
            let li = document.createElement("li");
            li.innerHTML = `<strong>${booking.name}</strong> booked from <strong>${booking.checkIn}</strong> to <strong>${booking.checkOut}</strong>`;
            container.appendChild(li);
        });

        console.log("Bookings displayed successfully.");
    }
}

document.addEventListener("DOMContentLoaded", function () {
    console.log("JavaScript loaded!");  // Debugging log

    // Run displayBookings() only if we are on bookings.html
    if (document.getElementById("bookingsContainer")) {
        console.log("Calling displayBookings()...");
        displayBookings();
    }

    // Attach event listener to the booking form if on property.html
    let bookingForm = document.getElementById("bookingForm");
    if (bookingForm) {
        bookingForm.addEventListener("submit", function (event) {
            event.preventDefault(); 
            
            let name = document.getElementById("name").value;
            let checkIn = document.getElementById("checkIn").value;
            let checkOut = document.getElementById("checkOut").value;

            if (name && checkIn && checkOut) {
                saveBooking(name, checkIn, checkOut);
                alert("Booking saved successfully!");
                window.location.href = "bookings.html"; 
            } else {
                alert("Please fill in all fields.");
            }
        });
    }
});

document.addEventListener("DOMContentLoaded", function () {
    displayProperties(); // Load properties on page load
});

function displayProperties(filteredProperties = null) {
    const properties = [
        { id: 1, name: "Luxury Villa", location: "New York", price: 500 },
        { id: 2, name: "Beach House", location: "Miami", price: 350 },
        { id: 3, name: "City Apartment", location: "Los Angeles", price: 200 }
    ];

    const container = document.getElementById("propertiesContainer");
    container.innerHTML = ""; 

    const propertiesToDisplay = filteredProperties || properties;

    propertiesToDisplay.forEach(property => {
        let card = document.createElement("div");
        card.classList.add("property-card");
        card.innerHTML = `
            <h3>${property.name}</h3>
            <p>Location: ${property.location}</p>
            <p class="price">$${property.price} per night</p>
        `;
        container.appendChild(card);
    });
}

function applyFilters() {
    const locationFilter = document.getElementById("locationFilter").value;
    const minPrice = document.getElementById("minPrice").value;
    const maxPrice = document.getElementById("maxPrice").value;

    const properties = [
        { id: 1, name: "Luxury Villa", location: "New York", price: 500 },
        { id: 2, name: "Beach House", location: "Miami", price: 350 },
        { id: 3, name: "City Apartment", location: "Los Angeles", price: 200 }
    ];

    const filtered = properties.filter(property => {
        return (!locationFilter || property.location === locationFilter) &&
               (!minPrice || property.price >= minPrice) &&
               (!maxPrice || property.price <= maxPrice);
    });

    displayProperties(filtered);
}
