// Smooth scrolling for navigation links
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

// Show alert function for CTA button
function showAlert() {
    alert('Welcome! This is a demo static website with CI/CD pipeline.');
}

// Form submission handler
document.querySelector('.contact-form').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const name = this.querySelector('input[type="text"]').value;
    const email = this.querySelector('input[type="email"]').value;
    const message = this.querySelector('textarea').value;
    
    if (name && email && message) {
        alert(`Thank you ${name}! Your message has been received. We'll get back to you at ${email}.`);
        this.reset();
    } else {
        alert('Please fill in all fields.');
    }
});

// Add active class to current section in navigation
window.addEventListener('scroll', function() {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-links a');
    
    let current = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        
        if (scrollY >= (sectionTop - 200)) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
});

// Display build information (will be replaced by Jenkins)
document.addEventListener('DOMContentLoaded', function() {
    const buildInfo = document.getElementById('build-info');
    
    // This will be replaced by Jenkins during build
    const buildNumber = '${BUILD_NUMBER}' || 'Development';
    const buildDate = '${BUILD_DATE}' || new Date().toLocaleDateString();
    
    if (buildNumber !== '${BUILD_NUMBER}') {
        buildInfo.textContent = `Build #${buildNumber} - ${buildDate}`;
    } else {
        buildInfo.textContent = `Development - ${buildDate}`;
    }
});

// Simple animation for feature cards
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe feature cards and service cards
document.addEventListener('DOMContentLoaded', function() {
    const cards = document.querySelectorAll('.feature, .service-card');
    
    cards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(card);
    });
});
