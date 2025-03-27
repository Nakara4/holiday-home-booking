const properties = [
    { id: 1, name: "Luxury Villa", location: "New York", price: 500, image: "https://plus.unsplash.com/premium_photo-1682377521753-58d1fd9fa5ce?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", link: "property.html?id=1" },
    { id: 2, name: "Beach House", location: "Miami", price: 350, image: "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", link: "property.html?id=2" },
    { id: 3, name: "City Apartment", location: "Los Angeles", price: 200, image: "https://images.unsplash.com/photo-1472835560847-37d024ebacdc?q=80&w=2574&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", link: "property.html?id=3" }
];

// Function to format price consistently
function formatPrice(price) {
    return `$${price} per night`;
}

// Function to display properties (used on index.html)
function displayProperties(filteredProperties = null) {
    const container = document.getElementById("property-list");
    if (!container) return;

    container.innerHTML = ""; 

    const propertiesToDisplay = filteredProperties?.length ? filteredProperties : properties;

    propertiesToDisplay.forEach(property => {
        let card = document.createElement("div");
        card.classList.add("property-card");
        card.innerHTML = `
            <img src="${property.image}" alt="${property.name}" class="property-image">
            <h3>${property.name}</h3>
            <p>Location: ${property.location}</p>
            <p class="price">${formatPrice(property.price)}</p>
            <a href="${property.link}" class="view-more-btn" onclick="saveProperty(${property.id})">View More</a>
        `;
        container.appendChild(card);
    });
}

// Function to save property details to localStorage before redirecting
function saveProperty(id) {
    const selectedProperty = properties.find(p => p.id === id);
    localStorage.setItem("selectedProperty", JSON.stringify(selectedProperty));
}

// Function to display property details on property.html
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
        <p class="price">${formatPrice(property.price)}</p>
        <p>${property.description || "No additional details available."}</p>
        <button class="book-now">Book Now</button>
    `;
}

// Function to apply property filters
function applyFilters() {
    const locationFilter = document.getElementById("locationFilter").value;
    const minPrice = parseInt(document.getElementById("minPrice").value) || 0;
    const maxPrice = parseInt(document.getElementById("maxPrice").value) || Infinity;

    const filtered = properties.filter(property => {
        return (!locationFilter || property.location.toLowerCase().includes(locationFilter.toLowerCase())) &&
               (property.price >= minPrice && property.price <= maxPrice);
    });

    displayProperties(filtered);
}

// Ensure the correct function runs based on the current page
document.addEventListener("DOMContentLoaded", function () {
    if (document.getElementById("property-list")) {
        displayProperties();
    }
    if (document.getElementById("property-details")) {
        displayPropertyDetails();
    }

    // Attach event listener for filter button
    const filterBtn = document.getElementById("applyFilters");
    if (filterBtn) {
        filterBtn.addEventListener("click", applyFilters);
    }
});

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

