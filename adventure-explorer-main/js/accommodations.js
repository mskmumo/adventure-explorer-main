document.addEventListener('DOMContentLoaded', () => {
	// Price range slider
	const priceRange = document.querySelector('.price-range');
	const priceValue = document.querySelector('.price-value');
	
	priceRange.addEventListener('input', (e) => {
		priceValue.textContent = `$${e.target.value}/night`;
		filterAccommodations();
	});

	// Accommodation filtering
	const filterSelects = document.querySelectorAll('.filter-group select');
	filterSelects.forEach(select => {
		select.addEventListener('change', filterAccommodations);
	});

	function filterAccommodations() {
		const selectedPrice = parseInt(priceRange.value);
		const selectedType = document.querySelector('select[name="property-type"]').value;
		const selectedLocation = document.querySelector('select[name="location"]').value;
		const selectedRating = document.querySelector('select[name="rating"]').value;

		const accommodations = document.querySelectorAll('.accommodation-card');
		accommodations.forEach(accommodation => {
			const price = parseInt(accommodation.querySelector('.booking-platforms span').textContent.replace(/[^0-9]/g, ''));
			const type = accommodation.dataset.type;
			const location = accommodation.dataset.location;
			const rating = parseFloat(accommodation.querySelector('.accommodation-rating span').textContent);

			const matchesPrice = price <= selectedPrice;
			const matchesType = !selectedType || type === selectedType;
			const matchesLocation = !selectedLocation || location === selectedLocation;
			const matchesRating = !selectedRating || rating >= parseInt(selectedRating);

			if (matchesPrice && matchesType && matchesLocation && matchesRating) {
				accommodation.style.display = 'block';
			} else {
				accommodation.style.display = 'none';
			}
		});

		updateMap();
	}

	// Map functionality
	let map;
	let markers = [];

	function initMap() {
		// This would be replaced with actual map initialization code
		// Example using Google Maps:
		/*
		map = new google.maps.Map(document.getElementById('accommodation-map'), {
			zoom: 8,
			center: { lat: -1.2921, lng: 36.8219 } // Nairobi coordinates
		});
		*/
		console.log('Map initialization will be implemented');
	}

	function updateMap() {
		// Clear existing markers
		markers.forEach(marker => marker.setMap(null));
		markers = [];

		// Add markers for visible accommodations
		const visibleAccommodations = document.querySelectorAll('.accommodation-card[style*="block"]');
		visibleAccommodations.forEach(accommodation => {
			const lat = parseFloat(accommodation.dataset.lat);
			const lng = parseFloat(accommodation.dataset.lng);
			
			// Add marker to map
			/*
			const marker = new google.maps.Marker({
				position: { lat, lng },
				map: map,
				title: accommodation.querySelector('h3').textContent
			});
			markers.push(marker);
			*/
		});
	}

	// Accommodation details modal
	const viewDetailsButtons = document.querySelectorAll('.view-details');
	const accommodationModal = document.querySelector('.accommodation-modal');
	const closeModal = document.querySelector('.close-modal');

	viewDetailsButtons.forEach(button => {
		button.addEventListener('click', () => {
			const accommodationCard = button.closest('.accommodation-card');
			showAccommodationDetails(accommodationCard);
		});
	});

	function showAccommodationDetails(accommodationCard) {
		const modalBody = accommodationModal.querySelector('.modal-body');
		const name = accommodationCard.querySelector('h3').textContent;
		const image = accommodationCard.querySelector('img').src;
		const description = accommodationCard.querySelector('.accommodation-description p').textContent;
		const amenities = Array.from(accommodationCard.querySelectorAll('.amenities span')).map(span => span.textContent);
		
		modalBody.innerHTML = `
			<div class="modal-gallery">
				<img src="${image}" alt="${name}">
			</div>
			<h2>${name}</h2>
			<div class="modal-description">
				<p>${description}</p>
			</div>
			<div class="modal-amenities">
				<h3>Amenities</h3>
				<div class="amenities-grid">
					${amenities.map(amenity => `<span>${amenity}</span>`).join('')}
				</div>
			</div>
			<div class="modal-booking">
				<h3>Book Now</h3>
				<div class="booking-options">
					${accommodationCard.querySelector('.booking-platforms').innerHTML}
				</div>
			</div>
		`;

		accommodationModal.style.display = 'flex';
	}

	closeModal.addEventListener('click', () => {
		accommodationModal.style.display = 'none';
	});

	// Save accommodation functionality
	const saveButtons = document.querySelectorAll('.save-accommodation');
	saveButtons.forEach(button => {
		button.addEventListener('click', () => {
			const accommodationId = button.closest('.accommodation-card').dataset.id;
			const icon = button.querySelector('i');
			
			if (icon.classList.contains('far')) {
				icon.classList.replace('far', 'fas');
				saveAccommodation(accommodationId);
				showNotification('Accommodation saved to favorites');
			} else {
				icon.classList.replace('fas', 'far');
				removeAccommodation(accommodationId);
				showNotification('Accommodation removed from favorites');
			}
		});
	});

	function saveAccommodation(accommodationId) {
		let savedAccommodations = JSON.parse(localStorage.getItem('savedAccommodations') || '[]');
		if (!savedAccommodations.includes(accommodationId)) {
			savedAccommodations.push(accommodationId);
			localStorage.setItem('savedAccommodations', JSON.stringify(savedAccommodations));
		}
	}

	function removeAccommodation(accommodationId) {
		let savedAccommodations = JSON.parse(localStorage.getItem('savedAccommodations') || '[]');
		savedAccommodations = savedAccommodations.filter(id => id !== accommodationId);
		localStorage.setItem('savedAccommodations', JSON.stringify(savedAccommodations));
	}

	// Notification system
	function showNotification(message) {
		const notification = document.createElement('div');
		notification.className = 'notification';
		notification.innerHTML = `
			<div class="notification-content">
				<i class="fas fa-check-circle"></i>
				<p>${message}</p>
			</div>
		`;

		document.body.appendChild(notification);

		setTimeout(() => {
			notification.remove();
		}, 3000);
	}

	// Initialize the page
	initMap();
});