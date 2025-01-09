document.addEventListener('DOMContentLoaded', () => {
	// Animate elements on scroll
	const animateOnScroll = () => {
		const elements = document.querySelectorAll('.category-card, .tour-card, .feature-card, .step');
		
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

	// Tour card hover effects
	const tourCards = document.querySelectorAll('.tour-card');
	tourCards.forEach(card => {
		card.addEventListener('mouseenter', () => {
			card.querySelector('.tour-image img').style.transform = 'scale(1.1)';
		});

		card.addEventListener('mouseleave', () => {
			card.querySelector('.tour-image img').style.transform = 'scale(1)';
		});
	});

	// Mobile menu toggle
	const toggle = document.querySelector('.toggle');
	const navLinks = document.querySelector('.nav-links');

	toggle.addEventListener('click', () => {
		navLinks.classList.toggle('active');
		toggle.classList.toggle('active');
	});

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

	// Tour booking functionality
	const bookButtons = document.querySelectorAll('.btn');
	bookButtons.forEach(button => {
		button.addEventListener('click', (e) => {
			e.preventDefault();
			const tourCard = button.closest('.tour-card');
			const tourName = tourCard.querySelector('h3').textContent;
			const tourPrice = tourCard.querySelector('.price').textContent;
			
			// Show booking confirmation
			showBookingModal(tourName, tourPrice);
		});
	});

	// Booking modal
	function showBookingModal(tourName, tourPrice) {
		const modal = document.createElement('div');
		modal.className = 'booking-modal';
		modal.innerHTML = `
			<div class="modal-content">
				<span class="close-modal">&times;</span>
				<h2>Book Your Tour</h2>
				<p>Tour: ${tourName}</p>
				<p>Price: ${tourPrice}</p>
				<form id="booking-form">
					<input type="text" placeholder="Full Name" required>
					<input type="email" placeholder="Email" required>
					<input type="date" placeholder="Preferred Date" required>
					<input type="number" placeholder="Number of Travelers" min="1" required>
					<button type="submit" class="btn">Confirm Booking</button>
				</form>
			</div>
		`;

		document.body.appendChild(modal);

		// Close modal functionality
		const closeBtn = modal.querySelector('.close-modal');
		closeBtn.addEventListener('click', () => {
			modal.remove();
		});

		// Close modal when clicking outside
		window.addEventListener('click', (e) => {
			if (e.target === modal) {
				modal.remove();
			}
		});

		// Handle form submission
		const form = modal.querySelector('#booking-form');
		form.addEventListener('submit', (e) => {
			e.preventDefault();
			// Here you would typically send the form data to a server
			modal.innerHTML = `
				<div class="modal-content">
					<h2>Booking Confirmed!</h2>
					<p>Thank you for booking ${tourName}.</p>
					<p>We'll send you a confirmation email shortly.</p>
					<button class="btn" onclick="this.closest('.booking-modal').remove()">Close</button>
				</div>
			`;
		});
	}

	// Add CSS for modal
	const modalStyle = document.createElement('style');
	modalStyle.textContent = `
		.booking-modal {
			position: fixed;
			top: 0;
			left: 0;
			width: 100%;
			height: 100%;
			background: rgba(0,0,0,0.8);
			display: flex;
			justify-content: center;
			align-items: center;
			z-index: 1000;
		}

		.modal-content {
			background: white;
			padding: 40px;
			border-radius: 15px;
			max-width: 500px;
			width: 90%;
			position: relative;
		}

		.close-modal {
			position: absolute;
			top: 20px;
			right: 20px;
			font-size: 24px;
			cursor: pointer;
		}

		#booking-form {
			display: flex;
			flex-direction: column;
			gap: 15px;
			margin-top: 20px;
		}

		#booking-form input {
			padding: 12px;
			border: 1px solid #ddd;
			border-radius: 5px;
		}

		.animate {
			animation: fadeInUp 0.6s ease forwards;
			opacity: 0;
		}

		@keyframes fadeInUp {
			from {
				opacity: 0;
				transform: translateY(30px);
			}
			to {
				opacity: 1;
				transform: translateY(0);
			}
		}
	`;
	document.head.appendChild(modalStyle);
});