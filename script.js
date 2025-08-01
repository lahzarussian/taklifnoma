document.addEventListener('DOMContentLoaded', function() {
    const invitationCard = document.querySelector('.invitation-card');
    
    // Show invitation card when intro animation completes
    setTimeout(() => {
        window.addEventListener('scroll', revealOnScroll);
        // Initial check in case page is already scrolled
        revealOnScroll();
    }, 2000); // Match this with the fadeOut animation duration + delay

    function revealOnScroll() {
        const scrollPosition = window.scrollY + window.innerHeight;
        const cardPosition = invitationCard.offsetTop + (invitationCard.offsetHeight / 2);
        
        if (scrollPosition > cardPosition) {
            invitationCard.classList.add('visible');
            // Remove the event listener after the animation completes
            window.removeEventListener('scroll', revealOnScroll);
        }
    }
});
