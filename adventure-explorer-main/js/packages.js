document.addEventListener('DOMContentLoaded', () => {
	// Price range slider
	const priceRange = document.querySelector('.price-range');
	const priceValue = document.querySelector('.price-value');
	
	priceRange.addEventListener('input', (e) => {
		priceValue.textContent = `$${e.target.value}`;
		filterPackages();
	});

	// Package filtering
	const filterSelects = document.querySelectorAll('.filter-group select');
	filterSelects.forEach(select => {
		select.addEventListener('change', filterPackages);
	});

	function filterPackages() {
		const selectedPrice = parseInt(priceRange.value);
		const selectedDuration = document.querySelector('select[name="duration"]').value;
		const selectedDifficulty = document.querySelector('select[name="difficulty"]').value;
		const selectedTheme = document.querySelector('select[name="theme"]').value;

		const packages = document.querySelectorAll('.package-card');
		packages.forEach(package => {
			const price = parseInt(package.querySelector('.amount').textContent.replace(/[^0-9]/g, ''));
			const duration = package.querySelector('.package-meta span:first-child').textContent;
			const difficulty = package.querySelector('.package-meta span:last-child').textContent.toLowerCase();
			const theme = package.dataset.theme;

			const matchesPrice = price <= selectedPrice;
			const matchesDuration = !selectedDuration || duration.includes(selectedDuration);
			const matchesDifficulty = !selectedDifficulty || difficulty === selectedDifficulty;
			const matchesTheme = !selectedTheme || theme === selectedTheme;

			if (matchesPrice && matchesDuration && matchesDifficulty && matchesTheme) {
				package.style.display = 'block';
			} else {
				package.style.display = 'none';
			}
		});
	}

	// Package comparison
	const compareButtons = document.querySelectorAll('.add-to-compare');
	const comparisonSection = document.querySelector('.package-comparison');
	const comparisonTable = document.querySelector('.comparison-table');
	const clearComparisonBtn = document.getElementById('clear-comparison');
	let comparedPackages = [];

	compareButtons.forEach(button => {
		button.addEventListener('click', () => {
			const packageCard = button.closest('.package-card');
			const packageId = packageCard.dataset.packageId;

			if (button.classList.contains('active')) {
				removeFromComparison(packageId);
				button.classList.remove('active');
			} else if (comparedPackages.length < 3) {
				addToComparison(packageCard);
				button.classList.add('active');
			} else {
				showNotification('You can compare up to 3 packages at a time');
			}
		});
	});

	function addToComparison(packageCard) {
		const packageData = {
			id: packageCard.dataset.packageId,
			name: packageCard.querySelector('h3').textContent,
			price: packageCard.querySelector('.amount').textContent,
			duration: packageCard.querySelector('.package-meta span:first-child').textContent,
			difficulty: packageCard.querySelector('.package-meta span:last-child').textContent,
			inclusions: Array.from(packageCard.querySelectorAll('.package-details li')).map(li => li.textContent)
		};

		comparedPackages.push(packageData);
		updateComparisonTable();
	}

	function removeFromComparison(packageId) {
		comparedPackages = comparedPackages.filter(p => p.id !== packageId);
		updateComparisonTable();
	}

	function updateComparisonTable() {
		if (comparedPackages.length > 0) {
			comparisonSection.classList.add('active');
			
			let tableHTML = `
				<table>
					<thead>
						<tr>
							<th>Features</th>
							${comparedPackages.map(p => `<th>${p.name}</th>`).join('')}
						</tr>
					</thead>
					<tbody>
						<tr>
							<td>Price</td>
							${comparedPackages.map(p => `<td>${p.price}</td>`).join('')}
						</tr>
						<tr>
							<td>Duration</td>
							${comparedPackages.map(p => `<td>${p.duration}</td>`).join('')}
						</tr>
						<tr>
							<td>Difficulty</td>
							${comparedPackages.map(p => `<td>${p.difficulty}</td>`).join('')}
						</tr>
						<tr>
							<td>Inclusions</td>
							${comparedPackages.map(p => `
								<td>
									<ul>
										${p.inclusions.map(i => `<li>${i}</li>`).join('')}
									</ul>
								</td>
							`).join('')}
						</tr>
					</tbody>
				</table>
			`;
			
			comparisonTable.innerHTML = tableHTML;
		} else {
			comparisonSection.classList.remove('active');
		}
	}

	clearComparisonBtn.addEventListener('click', () => {
		comparedPackages = [];
		document.querySelectorAll('.add-to-compare.active').forEach(btn => {
			btn.classList.remove('active');
		});
		updateComparisonTable();
	});

	// Booking functionality
	const bookButtons = document.querySelectorAll('.book-now');
	const bookingModal = document.querySelector('.booking-modal');
	const closeModal = document.querySelector('.close-modal');

	bookButtons.forEach(button => {
		button.addEventListener('click', () => {
			const packageCard = button.closest('.package-card');
			const packageName = packageCard.querySelector('h3').textContent;
			const packagePrice = packageCard.querySelector('.amount').textContent;
			
			showBookingForm(packageName, packagePrice);
		});
	});

	function showBookingForm(packageName, packagePrice) {
		const bookingForm = document.getElementById('booking-form');
		bookingForm.innerHTML = `
			<h3>${packageName}</h3>
			<p>Price: ${packagePrice} per person</p>
			<div class="form-group">
				<input type="text" id="booking-name" required>
				<label for="booking-name">Full Name</label>
			</div>
			<div class="form-group">
				<input type="email" id="booking-email" required>
				<label for="booking-email">Email Address</label>
			</div>
			<div class="form-group">
				<input type="date" id="booking-date" required>
				<label for="booking-date">Preferred Date</label>
			</div>
			<div class="form-group">
				<input type="number" id="booking-guests" min="1" required>
				<label for="booking-guests">Number of Guests</label>
			</div>
			<button type="submit" class="btn">Confirm Booking</button>
		`;

		bookingModal.style.display = 'flex';

		bookingForm.addEventListener('submit', handleBookingSubmit);
	}

	function handleBookingSubmit(e) {
		e.preventDefault();
		// Here you would typically send the booking data to a server
		showNotification('Booking confirmed! Check your email for details.');
		bookingModal.style.display = 'none';
	}

	closeModal.addEventListener('click', () => {
		bookingModal.style.display = 'none';
	});

	// Countdown timer
	const countdowns = document.querySelectorAll('.countdown');
	countdowns.forEach(countdown => {
		const endDate = new Date(countdown.dataset.end);
		
		function updateCountdown() {
			const now = new Date();
			const distance = endDate - now;

			if (distance < 0) {
				countdown.textContent = 'Offer Expired';
				return;
			}

			const days = Math.floor(distance / (1000 * 60 * 60 * 24));
			const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
			countdown.textContent = `${days}d ${hours}h left`;
		}

		updateCountdown();
		setInterval(updateCountdown, 1000 * 60); // Update every minute
	});

	// Save for later functionality
	const saveButtons = document.querySelectorAll('.save-for-later');
	saveButtons.forEach(button => {
		button.addEventListener('click', () => {
			const packageId = button.closest('.package-card').dataset.packageId;
			const icon = button.querySelector('i');
			
			if (icon.classList.contains('far')) {
				icon.classList.replace('far', 'fas');
				savePackage(packageId);
				showNotification('Package saved to favorites');
			} else {
				icon.classList.replace('fas', 'far');
				removePackage(packageId);
				showNotification('Package removed from favorites');
			}
		});
	});

	function savePackage(packageId) {
		let savedPackages = JSON.parse(localStorage.getItem('savedPackages') || '[]');
		if (!savedPackages.includes(packageId)) {
			savedPackages.push(packageId);
			localStorage.setItem('savedPackages', JSON.stringify(savedPackages));
		}
	}

	function removePackage(packageId) {
		let savedPackages = JSON.parse(localStorage.getItem('savedPackages') || '[]');
		savedPackages = savedPackages.filter(id => id !== packageId);
		localStorage.setItem('savedPackages', JSON.stringify(savedPackages));
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
});