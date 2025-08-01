document.addEventListener('DOMContentLoaded', function() {
    const invitationCard = document.querySelector('.invitation-card');
    const introNumber = document.querySelector('.intro-number');
    const headerImage = document.querySelector('.header-image');
    const foodItems = document.querySelectorAll('.food-item');
    
    // Add initial styles for animations
    foodItems.forEach(item => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(20px)';
        item.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    });
    
    // Add vibration effect to the number before fading out
    setTimeout(() => {
        introNumber.style.animation = 'vibrate 0.1s linear 3';
    }, 2000);
    
    // Show invitation card when intro animation completes
    setTimeout(() => {
        // Add scroll event listener for reveal on scroll
        window.addEventListener('scroll', revealOnScroll);
        // Initial check in case page is already scrolled
        revealOnScroll();
        
        // Auto-scroll to the invitation card after intro
        window.scrollTo({
            top: invitationCard.offsetTop - 50,
            behavior: 'smooth'
        });
        
        // Trigger animations for header and food items
        setTimeout(() => {
            headerImage.style.animation = 'scaleIn 0.8s ease-out forwards';
            
            foodItems.forEach((item, index) => {
                setTimeout(() => {
                    item.style.opacity = '1';
                    item.style.transform = 'translateY(0)';
                }, index * 100); // Staggered animation
            });
        }, 500);
        
    }, 2500); // Slightly longer initial delay to allow the 777 to be fully visible

    function revealOnScroll() {
        const scrollPosition = window.scrollY + (window.innerHeight * 0.8);
        const cardPosition = invitationCard.offsetTop + (invitationCard.offsetHeight * 0.2);
        
        if (scrollPosition > cardPosition) {
            invitationCard.classList.add('visible');
            // Remove the event listener after the animation completes
            window.removeEventListener('scroll', revealOnScroll);
        }
    }
    
    // Add vibration animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes vibrate {
            0% { transform: translateX(0) rotate(0deg); }
            25% { transform: translateX(-2px) rotate(-1deg); }
            50% { transform: translateX(2px) rotate(1deg); }
            75% { transform: translateX(-2px) rotate(0deg); }
            100% { transform: translateX(0) rotate(0); }
        }
    `;
    document.head.appendChild(style);
});
