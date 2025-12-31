// Load reviews from server on page load
async function loadReviews() {
    try {
        const response = await fetch('/api/reviews');
        const reviews = await response.json();
        const reviewsGrid = document.querySelector('.reviews-grid');

        reviews.forEach(review => {
            const reviewCard = document.createElement('div');
            reviewCard.className = 'review-card';
            reviewCard.innerHTML = `
                <div class="stars">${review.stars}</div>
                <p>"${review.text}"</p>
                <p class="reviewer">- ${review.name}, ${review.location}</p>
            `;
            reviewsGrid.appendChild(reviewCard);
        });
    } catch (error) {
        console.error('Failed to load reviews:', error);
    }
}

// Load reviews from server (if available) on DOM ready
document.addEventListener('DOMContentLoaded', async function() {
    try {
        await loadReviews();
    } catch (error) {
        // If no server endpoint exists, fail silently (we load local reviews elsewhere)
        console.debug('No server review endpoint or failed to fetch reviews.');
    }
});
