document.addEventListener('DOMContentLoaded', () => {
	// Handle contact form submission
	const contactForm = document.getElementById('contact-form');
	contactForm.addEventListener('submit', (e) => {
		e.preventDefault();
		
		// Get form values
		const formData = {
			name: document.getElementById('name').value,
			email: document.getElementById('email').value,
			inquiryType: document.getElementById('inquiry-type').value,
			message: document.getElementById('message').value
		};

		// Here you would typically send the data to a server
		// For now, show success message
		showNotification('Message sent successfully! We\'ll get back to you soon.');
		contactForm.reset();
	});

	// FAQ accordion functionality
	const faqItems = document.querySelectorAll('.faq-item');
	faqItems.forEach(item => {
		const question = item.querySelector('.faq-question');
		question.addEventListener('click', () => {
			const isActive = item.classList.contains('active');
			
			// Close all FAQ items
			faqItems.forEach(faq => faq.classList.remove('active'));
			
			// Open clicked item if it wasn't active
			if (!isActive) {
				item.classList.add('active');
			}
		});
	});

	// Floating label functionality
	const formInputs = document.querySelectorAll('.form-group input, .form-group textarea');
	formInputs.forEach(input => {
		// Check initial state
		if (input.value) {
			input.classList.add('has-value');
		}

		// Handle input changes
		input.addEventListener('input', () => {
			if (input.value) {
				input.classList.add('has-value');
			} else {
				input.classList.remove('has-value');
			}
		});
	});

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

		// Add CSS for notification
		const style = document.createElement('style');
		style.textContent = `
			.notification {
				position: fixed;
				top: 20px;
				right: 20px;
				background: #4CAF50;
				color: white;
				padding: 15px 25px;
				border-radius: 5px;
				box-shadow: 0 3px 10px rgba(0,0,0,0.2);
				transform: translateX(120%);
				animation: slideIn 0.5s forwards, slideOut 0.5s forwards 3s;
				z-index: 1000;
			}

			.notification-content {
				display: flex;
				align-items: center;
				gap: 10px;
			}

			@keyframes slideIn {
				to {
					transform: translateX(0);
				}
			}

			@keyframes slideOut {
				to {
					transform: translateX(120%);
				}
			}
		`;
		document.head.appendChild(style);

		// Remove notification after animation
		setTimeout(() => {
			notification.remove();
		}, 3500);
	}

	// Initialize map (placeholder for actual map implementation)
	function initMap() {
		// This function would initialize your map service (Google Maps, Leaflet, etc.)
		console.log('Map initialization will be implemented');
	}

	// Animate elements on scroll
	const animateOnScroll = () => {
		const elements = document.querySelectorAll('.info-card, .form-wrapper, .faq-item');
		
		elements.forEach(element => {
			const elementTop = element.getBoundingClientRect().top;
			const elementBottom = element.getBoundingClientRect().bottom;
			
			if (elementTop < window.innerHeight && elementBottom > 0) {
				element.classList.add('animate');
			}
		});
	};

	window.addEventListener('scroll', animateOnScroll);
	window.addEventListener('load', () => {
		animateOnScroll();
		initMap();
	});
});