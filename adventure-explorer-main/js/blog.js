document.addEventListener('DOMContentLoaded', () => {
	// Blog search functionality
	const searchInput = document.querySelector('.blog-search input');
	const searchButton = document.querySelector('.blog-search button');
	const blogPosts = document.querySelectorAll('.blog-post, .featured-post');

	function searchPosts() {
		const searchTerm = searchInput.value.toLowerCase();
		
		blogPosts.forEach(post => {
			const title = post.querySelector('h2').textContent.toLowerCase();
			const content = post.querySelector('p').textContent.toLowerCase();
			
			if (title.includes(searchTerm) || content.includes(searchTerm)) {
				post.style.display = 'block';
			} else {
				post.style.display = 'none';
			}
		});
	}

	searchButton.addEventListener('click', searchPosts);
	searchInput.addEventListener('keyup', (e) => {
		if (e.key === 'Enter') {
			searchPosts();
		}
	});

	// Category filtering
	const categoryTags = document.querySelectorAll('.category-tag');
	
	categoryTags.forEach(tag => {
		tag.addEventListener('click', (e) => {
			e.preventDefault();
			const category = tag.textContent.toLowerCase();
			
			// Update active state
			categoryTags.forEach(t => t.classList.remove('active'));
			tag.classList.add('active');
			
			// Filter posts
			if (category === 'all') {
				blogPosts.forEach(post => post.style.display = 'block');
			} else {
				blogPosts.forEach(post => {
					const postCategory = post.querySelector('.post-category').textContent.toLowerCase();
					post.style.display = postCategory === category ? 'block' : 'none';
				});
			}
		});
	});

	// Post interactions
	const likeButtons = document.querySelectorAll('.post-stats .fa-heart');
	const shareButtons = document.querySelectorAll('.post-stats .fa-share-square');
	
	likeButtons.forEach(button => {
		button.addEventListener('click', () => {
			const countSpan = button.parentElement;
			const currentCount = parseInt(countSpan.textContent);
			
			if (button.classList.contains('far')) {
				button.classList.replace('far', 'fas');
				countSpan.textContent = ` ${currentCount + 1}`;
				showNotification('Post added to favorites');
			} else {
				button.classList.replace('fas', 'far');
				countSpan.textContent = ` ${currentCount - 1}`;
				showNotification('Post removed from favorites');
			}
		});
	});

	shareButtons.forEach(button => {
		button.addEventListener('click', () => {
			const post = button.closest('article');
			const postTitle = post.querySelector('h2').textContent;
			const shareUrl = window.location.href;
			
			// Create share dialog
			const shareData = {
				title: postTitle,
				text: 'Check out this interesting article!',
				url: shareUrl
			};

			if (navigator.share) {
				navigator.share(shareData)
					.catch(err => showNotification('Error sharing post'));
			} else {
				// Fallback for browsers that don't support Web Share API
				copyToClipboard(shareUrl);
				showNotification('Link copied to clipboard!');
			}
		});
	});

	// Newsletter subscription
	const newsletterForm = document.querySelector('.newsletter-form');
	
	newsletterForm.addEventListener('submit', (e) => {
		e.preventDefault();
		const email = newsletterForm.querySelector('input').value;
		
		if (validateEmail(email)) {
			// Here you would typically send the email to a server
			showNotification('Thank you for subscribing!');
			newsletterForm.reset();
		} else {
			showNotification('Please enter a valid email address');
		}
	});

	// Utility functions
	function validateEmail(email) {
		const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		return re.test(email);
	}

	function copyToClipboard(text) {
		const textarea = document.createElement('textarea');
		textarea.value = text;
		document.body.appendChild(textarea);
		textarea.select();
		document.execCommand('copy');
		document.body.removeChild(textarea);
	}

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

		// Add CSS for notification if not already present
		if (!document.querySelector('#notification-style')) {
			const style = document.createElement('style');
			style.id = 'notification-style';
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

				.notification-content {
					display: flex;
					align-items: center;
					gap: 10px;
				}
			`;
			document.head.appendChild(style);
		}

		setTimeout(() => {
			notification.remove();
		}, 3500);
	}

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
});