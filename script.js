const properties = [
    { 
        id: 1, 
        name: "Luxury Villa", 
        location: "New York", 
        price: 500, 
        image: "https://plus.unsplash.com/premium_photo-1682377521753-58d1fd9fa5ce?q=80&w=2670...",
        description: "A stunning 5-bedroom villa with a private pool, ocean views, and modern amenities. Perfect for luxury getaways.", // Added
        link: "property.html?id=1" 
    },
    { 
        id: 2, 
        name: "Beach House", 
        location: "Miami", 
        price: 350, 
        image: "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?q=80...",
        description: "Cozy beachfront cottage with direct access to the sand. Includes a porch with hammocks and BBQ grill.", // Added
        link: "property.html?id=2" 
    },
    {
        id: 3, 
        name: "City Apartment", 
        location: "Los Angeles", 
        price: 200, 
        image: "https://images.unsplash.com/photo-1472835560847-37d024ebacdc?q=80&w=2574&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        description: "Modern downtown loft with skyline views, walking distance to restaurants and theaters. Includes rooftop access and smart home features.",
        link: "property.html?id=3"
    }
];

// Stripe initialization (only loads on pages with payment form)
let stripe, elements;

function initStripe() {
    if (!document.getElementById('card-element')) return;
    
    stripe = Stripe('pk_test_your_test_key');
    elements = stripe.elements();
    
    const card = elements.create('card', {
        style: {
            base: {
                fontSize: '16px',
                color: '#32325d',
                '::placeholder': { color: '#aab7c4' }
            },
            invalid: { color: '#fa755a' }
        }
    });
    card.mount('#card-element');
    
    // Update price when dates change
    document.getElementById('checkIn')?.addEventListener('change', updateBookingTotal);
    document.getElementById('checkOut')?.addEventListener('change', updateBookingTotal);
}

function updateBookingTotal() {
    const property = JSON.parse(localStorage.getItem("selectedProperty"));
    if (!property) return;
    
    const checkIn = document.getElementById('checkIn')?.value;
    const checkOut = document.getElementById('checkOut')?.value;
    
    if (checkIn && checkOut) {
        const nights = (new Date(checkOut) - new Date(checkIn)) / (86400000);
        const total = nights * property.price;
        document.getElementById('total-amount').textContent = total.toFixed(2);
    }
}

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

    // Display property details
    document.getElementById("property-details").innerHTML = `
        <img src="${property.image}" alt="${property.name}" class="property-image">
        <h2>${property.name}</h2>
        <p>Location: ${property.location}</p>
        <p class="price">${formatPrice(property.price)}</p>
        <p>${property.description || "No additional details available."}</p>
    `;

    // === NEW LINE ADDED === //
    document.getElementById("propertyId").value = property.id; // Sets the hidden form field
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

    document.addEventListener("DOMContentLoaded", function() {
        // Initialize Stripe only on pages that need it
        initStripe();
        
        // Your existing page detection logic
        if (document.getElementById("property-list")) {
            displayProperties();
        }
        if (document.getElementById("property-details")) {
            displayPropertyDetails();
            updateBookingTotal(); // Initialize price display
        }
        if (document.getElementById("bookings-list")) {
            displayBookings();
        }
        
        // Your existing form/button listeners
        const bookingForm = document.getElementById("bookingForm");
        if (bookingForm) bookingForm.addEventListener("submit", handleBookingSubmission);
    }); 

});

// Function to handle booking submission
async function handleBookingSubmission(event) {
    event.preventDefault();
    
    // Keep all your existing validation checks
    const propertyId = document.getElementById("propertyId").value;
    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const checkIn = document.getElementById("checkIn").value;
    const checkOut = document.getElementById("checkOut").value;
    
    // Your existing validation
    if (!name || !email || !checkIn || !checkOut) {
        alert("Please fill in all fields.");
        return;
    }
    
    // Your existing date validation
    const today = new Date().toISOString().split('T')[0];
    if (checkIn < today) {
        alert("Check-in date cannot be in the past.");
        return;
    }
    if (checkOut <= checkIn) {
        alert("Check-out date must be after check-in date.");
        return;
    }
    
    // Check for conflicts (your existing code)
    const bookings = JSON.parse(localStorage.getItem("bookings")) || [];
    const property = properties.find(p => p.id == propertyId);
    const isConflicting = bookings.some(b => 
        b.propertyId === propertyId && 
        ((checkIn >= b.checkIn && checkIn <= b.checkOut) || 
         (checkOut >= b.checkIn && checkOut <= b.checkOut))
    );
    
    if (isConflicting) {
        alert("This property is already booked for the selected dates.");
        return;
    }
    
    // ===== NEW PAYMENT PROCESSING =====
    try {
        // For school project simulation (no real payment)
        const confirmPayment = confirm(`Proceed with payment of $${calculateTotal(checkIn, checkOut, property.price)}? (This is a simulation)`);
        
        if (!confirmPayment) {
            alert("Booking cancelled");
            return;
        }
        
        // Create booking record
        const booking = {
            id: new Date().getTime(),
            propertyId: propertyId,
            propertyName: property.name,
            name: name,
            email: email,
            checkIn: checkIn,
            checkOut: checkOut,
            paymentId: 'simulated_payment_' + Math.random().toString(36).substr(2, 9),
            amount: calculateTotal(checkIn, checkOut, property.price)
        };
        
        bookings.push(booking);
        localStorage.setItem("bookings", JSON.stringify(bookings));
        
        // Show confirmation
        document.getElementById("confirmationMessage").textContent = 
            `Booking confirmed for ${property.name}!`;
        document.getElementById("confirmationMessage").style.display = "block";
        
        // Clear form after delay
        setTimeout(() => {
            document.getElementById("bookingForm").reset();
            document.getElementById("confirmationMessage").style.display = "none";
        }, 3000);
        
    } catch (error) {
        console.error("Payment error:", error);
        alert("Payment failed. Please try again.");
    }
}

// Helper function
function calculateTotal(checkIn, checkOut, price) {
    const nights = (new Date(checkOut) - new Date(checkIn)) / (1000 * 60 * 60 * 24);
    return nights * price;
}
// Attach event listener to booking form
document.addEventListener("DOMContentLoaded", function () {
    const bookingForm = document.getElementById("bookingForm");
    if (bookingForm) {
        bookingForm.addEventListener("submit", handleBookingSubmission);
    }

    // If on bookings.html, display stored bookings
    if (document.getElementById("bookings-list")) {
        displayBookings();
    }
});

// Function to display bookings on bookings.html
function displayBookings() {
    const bookings = JSON.parse(localStorage.getItem("bookings")) || [];
    const bookingsList = document.getElementById("bookings-list");

    if (bookings.length === 0) {
        bookingsList.innerHTML = "<p>No bookings found.</p>";
        return;
    }

    bookingsList.innerHTML = ""; // Clear previous content

    bookings.forEach(booking => {
        const bookingItem = document.createElement("div");
        bookingItem.classList.add("booking-card");

       // New code: Fetch property name from the original properties array
const bookedProperty = properties.find(p => p.id == booking.propertyId);
const propertyName = bookedProperty ? bookedProperty.name : `Property ${booking.propertyId}`;

bookingItem.innerHTML = `
    <h3>Booking for: ${propertyName}</h3>  <!-- Updated line -->
    <p><strong>Guest:</strong> ${booking.name}</p>  <!-- Clarified "Name" -> "Guest" -->
    <p><strong>Email:</strong> ${booking.email}</p>
    <p><strong>Check-in:</strong> ${booking.checkIn}</p>
    <p><strong>Check-out:</strong> ${booking.checkOut}</p>
    <button class="delete-booking-btn" data-id="${booking.id}">Cancel Booking</button>
`;

        bookingsList.appendChild(bookingItem);
    });


    // Attach event listeners to delete buttons
    document.querySelectorAll(".delete-booking-btn").forEach(button => {
        button.addEventListener("click", function () {
            deleteBooking(this.getAttribute("data-id"));
        });
    });
}

// Function to delete a booking
function deleteBooking(bookingId) {
    let bookings = JSON.parse(localStorage.getItem("bookings")) || [];
    bookings = bookings.filter(booking => booking.id != bookingId);
    localStorage.setItem("bookings", JSON.stringify(bookings));
    displayBookings(); // Refresh bookings list
}

