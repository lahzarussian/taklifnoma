document.addEventListener('DOMContentLoaded', function() {
    // Cache DOM elements
    const invitationCard = document.querySelector('.invitation-card');
    const introNumber = document.querySelector('.intro-number');
    const headerImage = document.querySelector('.header-image');
    const foodItems = document.querySelectorAll('.food-item');
    const rsvpButton = document.getElementById('rsvpButton');
    const rsvpPopup = document.getElementById('rsvpPopup');
    const closePopup = document.getElementById('closePopup');
    
    // Check if required elements exist
    if (!invitationCard || !introNumber || !headerImage || !foodItems.length || !rsvpButton || !rsvpPopup || !closePopup) {
        console.error('Required elements not found in the DOM');
        return;
    }
    
    // Track animation state
    let isAnimating = false;
    
    // Initialize animations
    const initAnimations = () => {
        // Add initial styles to food items
        foodItems.forEach(item => {
            item.style.opacity = '0';
            item.style.transform = 'translateY(20px) translateZ(0)';
        });
        
        // Add animation class to header image
        if (headerImage) {
            headerImage.classList.add('animate-scale-in');
        }
        
        // Setup scroll reveal
        setupScrollReveal();
    };
    
    // Setup scroll reveal functionality
    const setupScrollReveal = () => {
        if (isAnimating) return;
        
        const revealOnScroll = () => {
            if (!invitationCard) return;
            
            const scrollPosition = window.scrollY + (window.innerHeight * 0.8);
            const cardPosition = invitationCard.offsetTop + (invitationCard.offsetHeight * 0.2);
            
            if (scrollPosition > cardPosition) {
                isAnimating = true;
                invitationCard.classList.add('visible');
                animateFoodItems();
                window.removeEventListener('scroll', revealOnScroll);
            }
        };
        
        // Use passive event listener for better scroll performance
        window.addEventListener('scroll', revealOnScroll, { passive: true });
        // Initial check in case page is already scrolled
        revealOnScroll();
        
        return revealOnScroll;
    };
    
    // Animate food items with staggered delay
    const animateFoodItems = () => {
        foodItems.forEach((item, index) => {
            if (item) {
                // Use requestAnimationFrame for smoother animations
                requestAnimationFrame(() => {
                    setTimeout(() => {
                        item.classList.add('visible');
                    }, index * 100);
                });
            }
        });
    };
    
    // Setup popup functionality
    const setupPopup = () => {
        if (!rsvpButton || !rsvpPopup || !closePopup) return;
        
        const handleEscapeKey = (e) => {
            if (e.key === 'Escape' && rsvpPopup.classList.contains('active')) {
                closePopupHandler();
            }
        };
        
        const closePopupHandler = () => {
            if (!rsvpPopup.classList.contains('active')) return;
            
            rsvpPopup.classList.remove('active');
            document.body.style.overflow = '';
            document.removeEventListener('keydown', handleEscapeKey);
        };
        
        // Show popup when RSVP button is clicked
        rsvpButton.addEventListener('click', (e) => {
            e.preventDefault();
            if (rsvpPopup.classList.contains('active')) return;
            
            // Add active class to show popup
            rsvpPopup.classList.add('active');
            
            // Prevent background scrolling
            document.body.style.overflow = 'hidden';
            
            // Add escape key listener
            document.addEventListener('keydown', handleEscapeKey);
            
            // Scroll to the top to ensure popup is visible
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
            
            // Force reflow to ensure the popup is in the DOM before animating
            void rsvpPopup.offsetWidth;
            
            // Add active class to content after a small delay to trigger animation
            const popupContent = rsvpPopup.querySelector('.popup-content');
            if (popupContent) {
                setTimeout(() => {
                    popupContent.classList.add('active');
                }, 10);
            }
        });
        
        // Close popup when close button is clicked
        closePopup.addEventListener('click', (e) => {
            e.preventDefault();
            closePopupHandler();
        });
        
        // Close popup when clicking outside the popup content
        rsvpPopup.addEventListener('click', (e) => {
            if (e.target === rsvpPopup) {
                closePopupHandler();
            }
        });
        
        return { handleEscapeKey, closePopupHandler };
    };
    
    // Add vibration animation to the document
    const addVibrationAnimation = () => {
        if (document.getElementById('vibration-animation')) return;
        
        const style = document.createElement('style');
        style.id = 'vibration-animation';
        style.textContent = `
            @keyframes vibrate {
                0%, 100% { 
                    transform: translateX(0) rotate(0deg) translateZ(0);
                }
                25% { 
                    transform: translateX(-1px) rotate(-0.5deg) translateZ(0);
                }
                75% { 
                    transform: translateX(1px) rotate(0.5deg) translateZ(0);
                }
            }
            @media (prefers-reduced-motion: reduce) {
                .intro-number {
                    animation: none !important;
                }
            }
        `;
        document.head.appendChild(style);
    };
    
    // Smooth scroll helper function
    const smoothScrollTo = (element, duration = 800) => {
        const targetPosition = element.getBoundingClientRect().top + window.pageYOffset - 50;
        const startPosition = window.pageYOffset;
        const distance = targetPosition - startPosition;
        let startTime = null;
        
        const animation = (currentTime) => {
            if (startTime === null) startTime = currentTime;
            const timeElapsed = currentTime - startTime;
            const run = easeInOutQuad(timeElapsed, startPosition, distance, duration);
            window.scrollTo(0, run);
            if (timeElapsed < duration) {
                requestAnimationFrame(animation);
            }
        };
        
        // Easing function
        const easeInOutQuad = (t, b, c, d) => {
            t /= d/2;
            if (t < 1) return c/2*t*t + b;
            t--;
            return -c/2 * (t*(t-2) - 1) + b;
        };
        
        requestAnimationFrame(animation);
    };
    
    // Initialize everything
    const init = () => {
        // Add vibration animation
        addVibrationAnimation();
        
        // Set up event listeners after a delay
        setTimeout(() => {
            // Start vibration effect on the number
            if (introNumber) {
                introNumber.style.animation = 'vibrate 0.15s ease-in-out 3';
            }
            
            // Set up popup functionality
            const { handleEscapeKey } = setupPopup();
            
            // Initialize animations
            initAnimations();
            
            // Auto-scroll to the invitation card after intro
            if (invitationCard) {
                if ('scrollBehavior' in document.documentElement.style) {
                    // Use native smooth scrolling if supported
                    window.scrollTo({
                        top: invitationCard.offsetTop - 50,
                        behavior: 'smooth'
                    });
                } else {
                    // Fallback for browsers that don't support smooth scrolling
                    smoothScrollTo(invitationCard);
                }
            }
            
            // Return cleanup function
            return () => {
                window.removeEventListener('scroll', setupScrollReveal);
                document.removeEventListener('keydown', handleEscapeKey);
            };
            
        }, 2000); // Initial delay for the intro animation
    };
    
    // Start the initialization
    const cleanup = init();
    
    // Clean up event listeners when the page is unloaded
    window.addEventListener('beforeunload', () => {
        if (cleanup && typeof cleanup === 'function') {
            cleanup();
        }
    });
});
