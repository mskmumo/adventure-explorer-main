// Filter and Search Functionality
document.addEventListener('DOMContentLoaded', () => {
	const regionFilter = document.getElementById('region-filter');
	const activityFilter = document.getElementById('activity-filter');
	const durationFilter = document.getElementById('duration-filter');
	const searchInput = document.querySelector('.search-bar input');
	const searchButton = document.querySelector('.search-bar button');

	// Filter destinations based on selected criteria
	function filterDestinations() {
		const selectedRegion = regionFilter.value;
		const selectedActivity = activityFilter.value;
		const selectedDuration = durationFilter.value;
		const searchTerm = searchInput.value.toLowerCase();

		const destinations = document.querySelectorAll('.destination-card');

		destinations.forEach(destination => {
			const region = destination.querySelector('.region').textContent.toLowerCase();
			const activities = destination.querySelector('.destination-features').textContent.toLowerCase();
			const duration = destination.querySelector('.destination-features span:first-child').textContent.toLowerCase();
			const destinationText = destination.textContent.toLowerCase();

			const matchesRegion = !selectedRegion || region.includes(selectedRegion);
			const matchesActivity = !selectedActivity || activities.includes(selectedActivity);
			const matchesDuration = !selectedDuration || duration.includes(selectedDuration);
			const matchesSearch = !searchTerm || destinationText.includes(searchTerm);

			if (matchesRegion && matchesActivity && matchesDuration && matchesSearch) {
				destination.style.display = 'block';
			} else {
				destination.style.display = 'none';
			}
		});
	}

	// Event listeners for filters and search
	regionFilter.addEventListener('change', filterDestinations);
	activityFilter.addEventListener('change', filterDestinations);
	durationFilter.addEventListener('change', filterDestinations);
	searchButton.addEventListener('click', filterDestinations);
	searchInput.addEventListener('keyup', (e) => {
		if (e.key === 'Enter') {
			filterDestinations();
		}
	});

	// Initialize map
	function initMap() {
		// This function will be implemented when integrating with a map service
		// Example using Google Maps or Leaflet.js
		console.log('Map initialization will be implemented');
	}

	// Smooth scroll for navigation
	document.querySelectorAll('a[href^="#"]').forEach(anchor => {
		anchor.addEventListener('click', function (e) {
			e.preventDefault();
			const target = document.querySelector(this.getAttribute('href'));
			if (target) {
				target.scrollIntoView({
					behavior: 'smooth',
					block: 'start'
				});
			}
		});
	});

	// Lazy loading for images
	const images = document.querySelectorAll('img[data-src]');
	const imageObserver = new IntersectionObserver((entries, observer) => {
		entries.forEach(entry => {
			if (entry.isIntersecting) {
				const img = entry.target;
				img.src = img.dataset.src;
				img.removeAttribute('data-src');
				observer.unobserve(img);
			}
		});
	});

	images.forEach(img => imageObserver.observe(img));

	// Mobile menu toggle
	const toggle = document.querySelector('.toggle');
	const navLinks = document.querySelector('.nav-links');

	toggle.addEventListener('click', () => {
		navLinks.classList.toggle('active');
		toggle.classList.toggle('active');
	});

	// Sticky navigation
	const nav = document.querySelector('.navbar');
	const filters = document.querySelector('.destination-filters');
	let lastScroll = 0;

	window.addEventListener('scroll', () => {
		const currentScroll = window.pageYOffset;

		if (currentScroll > lastScroll && currentScroll > 100) {
			nav.style.transform = 'translateY(-100%)';
			filters.style.top = '0';
		} else {
			nav.style.transform = 'translateY(0)';
			filters.style.top = '80px';
		}

		lastScroll = currentScroll;
	});

	// Initialize the page
	initMap();
});

// Animation on scroll
const animateOnScroll = () => {
	const elements = document.querySelectorAll('.destination-card, .tip-card');
	
	elements.forEach(element => {
		const elementTop = element.getBoundingClientRect().top;
		const elementBottom = element.getBoundingClientRect().bottom;
		
		if (elementTop < window.innerHeight && elementBottom > 0) {
			element.classList.add('animate');
		}
	});
};

window.addEventListener('scroll', animateOnScroll);
window.addEventListener('load', animateOnScroll);