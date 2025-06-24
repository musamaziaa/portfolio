// Advanced Portfolio Website JavaScript
class PortfolioWebsite {
    constructor() {
        this.init();
    }

    init() {
        this.setupNavigation();
        this.setupSmoothScrolling();
        this.setupAnimations();
        this.setupSkillBars();
        this.setupProjectCards();
        this.setupContactForm();
        this.setupParallaxEffects();
        this.setupTypingEffect();
        this.setupParticleEffects();
        this.setupScrollProgress();
        this.setupThemeToggle();
        this.setupCounterAnimations();
        this.triggerPageAnimations();
    }


    setupNavigation() {
        const navToggle = document.querySelector('.nav-toggle');
        const navLinks = document.querySelector('.nav-links');
        const header = document.querySelector('header');

        // Mobile navigation toggle
        if (navToggle && navLinks) {
            navToggle.addEventListener('click', () => {
                navLinks.classList.toggle('active');
                navToggle.classList.toggle('active');
            });

            // Close mobile menu when clicking on a link
            navLinks.querySelectorAll('a').forEach(link => {
                link.addEventListener('click', () => {
                    navLinks.classList.remove('active');
                    navToggle.classList.remove('active');
                });
            });
        }

        // Navbar background on scroll
        window.addEventListener('scroll', () => {
            if (window.scrollY > 100) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });
    }

    setupSmoothScrolling() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(anchor.getAttribute('href'));
                if (target) {
                    const headerHeight = document.querySelector('header').offsetHeight;
                    const targetPosition = target.offsetTop - headerHeight;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }

    setupAnimations() {
        // Intersection Observer for scroll animations
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate__fadeIn');
                    
                    // Add staggered animations for child elements
                    const children = entry.target.querySelectorAll('.animate-stagger');
                    children.forEach((child, index) => {
                        setTimeout(() => {
                            child.classList.add('animate__fadeInUp');
                        }, index * 100);
                    });
                }
            });
        }, observerOptions);

        // Observe sections and elements
        document.querySelectorAll('section, .animate-on-scroll').forEach(el => {
            observer.observe(el);
        });
    }

    setupSkillBars() {
        const skillBars = document.querySelectorAll('.skill-progress');
        
        const skillObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const progressBar = entry.target;
                    const width = progressBar.style.width;
                    progressBar.style.width = '0%';
                    
                    setTimeout(() => {
                        progressBar.style.width = width;
                        progressBar.classList.add('animate-progress');
                    }, 500);
                    
                    skillObserver.unobserve(progressBar);
                }
            });
        }, { threshold: 0.5 });

        skillBars.forEach(bar => skillObserver.observe(bar));
    }

    setupProjectCards() {
        const projectCards = document.querySelectorAll('.project-card');
        
        projectCards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                card.style.transform = 'translateY(-15px) scale(1.02)';
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.transform = 'translateY(0) scale(1)';
            });
        });
    }

    setupContactForm() {
        const form = document.querySelector('.contact-form');
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                
                // Get form data
                const formData = new FormData(form);
                const data = Object.fromEntries(formData);
                
                // Show success message
                this.showNotification('Message sent successfully!', 'success');
                
                // Reset form
                form.reset();
            });
        }
    }

    setupParallaxEffects() {
        const stars = document.querySelectorAll('.star1, .star2');
        
        const updateStars = () => {
            const scrolled = window.pageYOffset;
            stars.forEach((star, index) => {
                const speed = 0.5 + (index * 0.2);
                if (scrolled === 0) {
                    star.style.transform = '';
                } else {
                    star.style.transform = `translateY(${scrolled * speed}px) rotate(${scrolled * 0.1}deg)`;
                }
            });
        };
        
        window.addEventListener('scroll', updateStars);
        // Ensure correct position on load
        updateStars();
    }

    setupTypingEffect() {
        const typingElement = document.querySelector('.typing-text');
        if (typingElement) {
            const texts = ['Developer', 'Designer', 'Genius', 'Innovator'];
            let textIndex = 0;
            let charIndex = 0;
            let isDeleting = false;
            
            const type = () => {
                const currentText = texts[textIndex];
                
                if (isDeleting) {
                    typingElement.textContent = currentText.substring(0, charIndex - 1);
                    charIndex--;
                } else {
                    typingElement.textContent = currentText.substring(0, charIndex + 1);
                    charIndex++;
                }
                
                let typeSpeed = 100;
                
                if (isDeleting) {
                    typeSpeed /= 2;
                }
                
                if (!isDeleting && charIndex === currentText.length) {
                    typeSpeed = 2000;
                    isDeleting = true;
                } else if (isDeleting && charIndex === 0) {
                    isDeleting = false;
                    textIndex = (textIndex + 1) % texts.length;
                    typeSpeed = 500;
                }
                
                setTimeout(type, typeSpeed);
            };
            
            type();
        }
    }

    setupParticleEffects() {
        // Create floating particles
        const particleContainer = document.createElement('div');
        particleContainer.className = 'particle-container';
        document.body.appendChild(particleContainer);
        
        // Increased particle density from 20 to 40
        for (let i = 0; i < 70; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.left = Math.random() * 100 + '%';
            particle.style.animationDelay = Math.random() * 20 + 's';
            particle.style.animationDuration = (Math.random() * 10 + 10) + 's';
            particleContainer.appendChild(particle);
        }
    }

    setupScrollProgress() {
        const progressBar = document.createElement('div');
        progressBar.className = 'scroll-progress';
        document.body.appendChild(progressBar);
        
        window.addEventListener('scroll', () => {
            const scrolled = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
            progressBar.style.width = scrolled + '%';
        });
    }

    setupThemeToggle() {
        // Add theme toggle functionality if needed
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
        
        // Auto-detect system theme preference
        if (prefersDark.matches) {
            document.body.classList.add('dark-theme');
        }
    }

    setupCounterAnimations() {
        const counters = document.querySelectorAll('.stat-number[data-target]');
        
        const counterObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const counter = entry.target;
                    const target = parseInt(counter.getAttribute('data-target'));
                    const duration = 2000;
                    const increment = target / (duration / 16);
                    let current = 0;
                    
                    const updateCounter = () => {
                        current += increment;
                        if (current < target) {
                            counter.textContent = Math.floor(current) + (target === 100 ? '%' : '+');
                            requestAnimationFrame(updateCounter);
                        } else {
                            counter.textContent = target + (target === 100 ? '%' : '+');
                        }
                    };
                    
                    updateCounter();
                    counterObserver.unobserve(counter);
                }
            });
        }, { threshold: 0.5 });

        counters.forEach(counter => counterObserver.observe(counter));
    }

    triggerPageAnimations() {
        // Trigger initial page animations immediately
        document.body.classList.add('page-loaded');
        
        // Animate hero elements with proper timing
        const heroElements = document.querySelectorAll('.hero-content > *');
        heroElements.forEach((el, index) => {
            setTimeout(() => {
                el.classList.add('animate__fadeInUp');
            }, index * 300); // Increased delay for better visual flow
        });

        // Animate stars with slight delay
        const stars = document.querySelectorAll('.star1, .star2');
        stars.forEach((star, index) => {
            setTimeout(() => {
                star.classList.add('animate__rotateIn');
            }, 1000 + (index * 200));
        });
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);
        
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }

    // Utility functions
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }
}

// Initialize the portfolio website
document.addEventListener('DOMContentLoaded', () => {
    window.portfolioWebsite = new PortfolioWebsite();
});

// Add some global utility functions
window.portfolioUtils = {
    // Smooth scroll to element
    scrollToElement: (elementId, offset = 0) => {
        const element = document.getElementById(elementId);
        if (element) {
            const elementPosition = element.offsetTop - offset;
            window.scrollTo({
                top: elementPosition,
                behavior: 'smooth'
            });
        }
    },

    // Animate counter
    animateCounter: (element, target, duration = 2000) => {
        let start = 0;
        const increment = target / (duration / 16);
        
        const timer = setInterval(() => {
            start += increment;
            if (start >= target) {
                element.textContent = target;
                clearInterval(timer);
            } else {
                element.textContent = Math.floor(start);
            }
        }, 16);
    },

    // Copy to clipboard
    copyToClipboard: (text) => {
        navigator.clipboard.writeText(text).then(() => {
            // Show success notification
            if (window.portfolioWebsite) {
                window.portfolioWebsite.showNotification('Copied to clipboard!', 'success');
            }
        }).catch(() => {
            // Fallback for older browsers
            const textArea = document.createElement('textarea');
            textArea.value = text;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            
            if (window.portfolioWebsite) {
                window.portfolioWebsite.showNotification('Copied to clipboard!', 'success');
            }
        });
    }
};

document.addEventListener('DOMContentLoaded', function() {
  document.querySelectorAll('img').forEach(img => {
    if (!img.hasAttribute('loading')) {
      img.setAttribute('loading', 'lazy');
    }
  });
});
