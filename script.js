const properties = [
    {
        id: 1,
        name: "Luxury Villa",
        location: "New York",
        price: 500,
        image: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?q=80&w=1200&auto=format&fit=crop",
        description: "A stunning 5-bedroom villa with a private pool, ocean views, and modern amenities. Perfect for luxury getaways.",
        link: "property.html?id=1"
    },
    {
        id: 2,
        name: "Beach House",
        location: "Miami",
        price: 350,
        image: "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?q=80&w=1200&auto=format&fit=crop",
        description: "Cozy beachfront cottage with direct access to the sand. Includes a porch with hammocks and BBQ grill.",
        link: "property.html?id=2"
    },
    {
        id: 3,
        name: "City Apartment",
        location: "Los Angeles",
        price: 200,
        image: "https://images.unsplash.com/photo-1472835560847-37d024ebacdc?q=80&w=1200&auto=format&fit=crop",
        description: "Modern downtown loft with skyline views, walking distance to restaurants and theaters. Includes rooftop access and smart home features.",
        link: "property.html?id=3"
    }
];

let stripe;
let elements;

function formatPrice(price) {
    return `$${price} per night`;
}

function calculateTotal(checkIn, checkOut, price) {
    const nights = Math.max(0, (new Date(checkOut) - new Date(checkIn)) / (1000 * 60 * 60 * 24));
    return nights * price;
}

function getSelectedProperty() {
    try {
        return JSON.parse(localStorage.getItem("selectedProperty"));
    } catch (error) {
        return null;
    }
}

function saveProperty(id) {
    const selectedProperty = properties.find(property => property.id === id);
    localStorage.setItem("selectedProperty", JSON.stringify(selectedProperty));
}

function renderBookingSummary() {
    const property = getSelectedProperty();
    const checkIn = document.getElementById("checkIn")?.value;
    const checkOut = document.getElementById("checkOut")?.value;
    const summaryText = document.getElementById("bookingSummaryText");
    const summaryNightlyRate = document.getElementById("summaryNightlyRate");
    const summaryNights = document.getElementById("summaryNights");
    const summaryTotal = document.getElementById("summaryTotal");

    if (!summaryText || !summaryNightlyRate || !summaryNights || !summaryTotal) {
        return;
    }

    if (!property) {
        summaryNightlyRate.textContent = "$0";
        summaryNights.textContent = "0";
        summaryTotal.textContent = "$0";
        summaryText.textContent = "Select a property to start your booking.";
        return;
    }

    summaryNightlyRate.textContent = formatPrice(property.price);

    if (!checkIn || !checkOut) {
        summaryNights.textContent = "0";
        summaryTotal.textContent = "$0";
        summaryText.textContent = "Select your check-in and check-out dates to see the total cost.";
        return;
    }

    const nights = Math.max(0, (new Date(checkOut) - new Date(checkIn)) / (1000 * 60 * 60 * 24));
    const total = nights > 0 ? nights * property.price : 0;

    summaryNights.textContent = String(nights);
    summaryTotal.textContent = `$${total.toFixed(2)}`;

    if (nights > 0) {
        summaryText.textContent = `${property.name} • ${nights} night${nights === 1 ? "" : "s"} • Total ${summaryTotal.textContent}.`;
    } else {
        summaryText.textContent = "Choose a checkout date after your check-in date to see the total.";
    }
}

function updateBookingTotal() {
    const property = getSelectedProperty();
    const checkIn = document.getElementById("checkIn")?.value;
    const checkOut = document.getElementById("checkOut")?.value;
    const totalAmount = document.getElementById("total-amount");

    if (!property || !checkIn || !checkOut || !totalAmount) {
        if (totalAmount) {
            totalAmount.textContent = "0";
        }
        renderBookingSummary();
        return;
    }

    const nights = Math.max(0, (new Date(checkOut) - new Date(checkIn)) / (1000 * 60 * 60 * 24));
    totalAmount.textContent = nights > 0 ? (nights * property.price).toFixed(2) : "0";
    renderBookingSummary();
}

function initStripe() {
    if (!document.getElementById("card-element") || typeof Stripe === "undefined") {
        return;
    }

    if (!stripe) {
        stripe = Stripe("pk_test_your_test_key");
        elements = stripe.elements();

        const card = elements.create("card", {
            style: {
                base: {
                    fontSize: "16px",
                    color: "#172033",
                    "::placeholder": { color: "#94a3b8" }
                },
                invalid: { color: "#fa755a" }
            }
        });

        card.mount("#card-element");
        card.on("change", event => {
            const errors = document.getElementById("card-errors");
            if (errors) {
                errors.textContent = event.error ? event.error.message : "";
            }
        });
    }

    document.getElementById("checkIn")?.addEventListener("change", updateBookingTotal);
    document.getElementById("checkOut")?.addEventListener("change", updateBookingTotal);
    updateBookingTotal();
}

function showStatus(message) {
    const status = document.getElementById("filterStatus");
    if (status) {
        status.textContent = message;
    }
}

function toggleEmptyState(show) {
    const emptyState = document.getElementById("emptyState");
    if (emptyState) {
        emptyState.classList.toggle("hidden", !show);
    }
}

function displayProperties(filteredProperties = properties) {
    const container = document.getElementById("property-list");
    const summary = document.getElementById("resultsSummary");

    if (!container) {
        return;
    }

    container.innerHTML = "";

    if (!filteredProperties.length) {
        toggleEmptyState(true);
        if (summary) {
            summary.textContent = "No homes match the current filters.";
        }
        showStatus("No properties match your current filters.");
        return;
    }

    toggleEmptyState(false);

    filteredProperties.forEach(property => {
        const card = document.createElement("div");
        card.classList.add("property-card");
        card.innerHTML = `
            <img src="${property.image}" alt="${property.name}" class="property-image">
            <div class="property-card-content">
                <h3>${property.name}</h3>
                <p>${property.description}</p>
                <div class="property-meta">
                    <span>${property.location}</span>
                    <span class="property-price">${formatPrice(property.price)}</span>
                </div>
                <a href="${property.link}" class="view-more-btn" onclick="saveProperty(${property.id})">View more</a>
            </div>
        `;
        container.appendChild(card);
    });

    if (summary) {
        summary.textContent = `Showing ${filteredProperties.length} home${filteredProperties.length === 1 ? "" : "s"}.`;
    }

    showStatus(`Showing ${filteredProperties.length} home${filteredProperties.length === 1 ? "" : "s"} that match your search.`);
}

function applyFilters(event) {
    if (event) {
        event.preventDefault();
    }

    const locationFilter = document.getElementById("locationFilter")?.value || "";
    const searchQuery = document.getElementById("searchQuery")?.value.trim().toLowerCase() || "";
    const sortBy = document.getElementById("sortBy")?.value || "featured";
    const minPrice = parseInt(document.getElementById("minPrice")?.value, 10) || 0;
    const maxPrice = parseInt(document.getElementById("maxPrice")?.value, 10) || Infinity;

    if (maxPrice < minPrice) {
        showStatus("Max price cannot be lower than min price.");
        return;
    }

    const filtered = properties.filter(property => {
        const matchesLocation = !locationFilter || property.location.toLowerCase() === locationFilter.toLowerCase();
        const matchesPrice = property.price >= minPrice && property.price <= maxPrice;
        const matchesSearch = !searchQuery ||
            property.name.toLowerCase().includes(searchQuery) ||
            property.location.toLowerCase().includes(searchQuery) ||
            property.description.toLowerCase().includes(searchQuery);

        return matchesLocation && matchesPrice && matchesSearch;
    });

    const sorted = [...filtered].sort((a, b) => {
        switch (sortBy) {
            case "price-asc":
                return a.price - b.price;
            case "price-desc":
                return b.price - a.price;
            case "name-asc":
                return a.name.localeCompare(b.name);
            case "name-desc":
                return b.name.localeCompare(a.name);
            default:
                return 0;
        }
    });

    displayProperties(sorted);
}

function displayPropertyDetails() {
    const property = getSelectedProperty();
    const detailsContainer = document.getElementById("property-details");

    if (!detailsContainer) {
        return;
    }

    if (!property) {
        detailsContainer.innerHTML = "<p>No property selected.</p>";
        return;
    }

    detailsContainer.innerHTML = `
        <img src="${property.image}" alt="${property.name}" class="property-image">
        <h2>${property.name}</h2>
        <div class="property-detail-meta">
            <span>${property.location}</span>
            <span>${formatPrice(property.price)}</span>
        </div>
        <p>${property.description || "No additional details available."}</p>
    `;

    const hiddenPropertyId = document.getElementById("propertyId");
    if (hiddenPropertyId) {
        hiddenPropertyId.value = property.id;
    }

    updateBookingTotal();
}

function handleBookingSubmission(event) {
    event.preventDefault();

    const propertyId = document.getElementById("propertyId")?.value;
    const name = document.getElementById("name")?.value.trim();
    const email = document.getElementById("email")?.value.trim();
    const checkIn = document.getElementById("checkIn")?.value;
    const checkOut = document.getElementById("checkOut")?.value;
    const confirmation = document.getElementById("confirmationMessage");
    const bookingForm = document.getElementById("bookingForm");

    if (!name || !email || !checkIn || !checkOut) {
        alert("Please fill in all fields.");
        return;
    }

    if (checkIn < new Date().toISOString().split("T")[0]) {
        alert("Check-in date cannot be in the past.");
        return;
    }

    if (checkOut <= checkIn) {
        alert("Check-out date must be after check-in date.");
        return;
    }

    const property = properties.find(item => String(item.id) === String(propertyId));
    if (!property) {
        alert("Please select a valid property.");
        return;
    }

    const bookings = JSON.parse(localStorage.getItem("bookings")) || [];
    const isConflicting = bookings.some(booking =>
        String(booking.propertyId) === String(propertyId) &&
        ((checkIn >= booking.checkIn && checkIn <= booking.checkOut) ||
         (checkOut >= booking.checkIn && checkOut <= booking.checkOut))
    );

    if (isConflicting) {
        alert("This property is already booked for the selected dates.");
        return;
    }

    const confirmPayment = confirm(`Proceed with payment of $${calculateTotal(checkIn, checkOut, property.price).toFixed(2)}? (This is a simulation)`);
    if (!confirmPayment) {
        alert("Booking cancelled.");
        return;
    }

    const booking = {
        id: Date.now(),
        propertyId: propertyId,
        propertyName: property.name,
        name,
        email,
        checkIn,
        checkOut,
        paymentId: `simulated_payment_${Math.random().toString(36).slice(2, 11)}`,
        amount: calculateTotal(checkIn, checkOut, property.price)
    };

    bookings.push(booking);
    localStorage.setItem("bookings", JSON.stringify(bookings));

    if (confirmation) {
        confirmation.textContent = `Booking confirmed for ${property.name}!`; 
        confirmation.style.display = "block";
        confirmation.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 300, fill: "forwards" });
    }

    if (bookingForm) {
        bookingForm.reset();
    }

    updateBookingTotal();

    setTimeout(() => {
        if (confirmation) {
            confirmation.style.display = "none";
        }
    }, 3200);
}

function displayBookings() {
    const bookings = JSON.parse(localStorage.getItem("bookings")) || [];
    const bookingsList = document.getElementById("bookings-list");

    if (!bookingsList) {
        return;
    }

    if (!bookings.length) {
        bookingsList.innerHTML = "<p class='empty-state'>No bookings found yet. Book a stay to see it here.</p>";
        return;
    }

    bookingsList.innerHTML = "";

    bookings.forEach(booking => {
        const bookedProperty = properties.find(property => String(property.id) === String(booking.propertyId));
        const propertyName = bookedProperty ? bookedProperty.name : `Property ${booking.propertyId}`;

        const bookingItem = document.createElement("div");
        bookingItem.classList.add("booking-card");
        bookingItem.innerHTML = `
            <h3>${propertyName}</h3>
            <p><strong>Guest:</strong> ${booking.name}</p>
            <p><strong>Email:</strong> ${booking.email}</p>
            <p><strong>Check-in:</strong> ${booking.checkIn}</p>
            <p><strong>Check-out:</strong> ${booking.checkOut}</p>
            <button class="delete-booking-btn" data-id="${booking.id}">Cancel booking</button>
        `;

        bookingsList.appendChild(bookingItem);
    });

    document.querySelectorAll(".delete-booking-btn").forEach(button => {
        button.addEventListener("click", function () {
            deleteBooking(this.getAttribute("data-id"));
        });
    });
}

function deleteBooking(bookingId) {
    const bookings = JSON.parse(localStorage.getItem("bookings")) || [];
    const updatedBookings = bookings.filter(booking => String(booking.id) !== String(bookingId));
    localStorage.setItem("bookings", JSON.stringify(updatedBookings));
    displayBookings();
}

function initDarkMode() {
    const toggleButton = document.getElementById("toggleDarkMode");
    if (!toggleButton) {
        return;
    }

    const isDarkMode = localStorage.getItem("darkMode") === "true";

    if (isDarkMode) {
        document.body.classList.add("dark-mode");
    }

    const renderButtonState = () => {
        const isDark = document.body.classList.contains("dark-mode");
        toggleButton.setAttribute("aria-pressed", String(isDark));
        toggleButton.innerHTML = isDark
            ? '<i class="fas fa-sun" aria-hidden="true"></i><span>Light Mode</span>'
            : '<i class="fas fa-moon" aria-hidden="true"></i><span>Dark Mode</span>';
    };

    renderButtonState();
    toggleButton.addEventListener("click", function () {
        document.body.classList.toggle("dark-mode");
        const enabled = document.body.classList.contains("dark-mode");
        localStorage.setItem("darkMode", enabled);
        renderButtonState();
    });
}

document.addEventListener("DOMContentLoaded", function () {
    initDarkMode();

    const filterForm = document.getElementById("filterForm");
    if (filterForm) {
        filterForm.addEventListener("submit", applyFilters);
    }

    if (document.getElementById("property-list")) {
        displayProperties();
    }

    if (document.getElementById("property-details")) {
        displayPropertyDetails();
    }

    if (document.getElementById("bookings-list")) {
        displayBookings();
    }

    const bookingForm = document.getElementById("bookingForm");
    if (bookingForm) {
        bookingForm.addEventListener("submit", handleBookingSubmission);
    }

    initStripe();
});

