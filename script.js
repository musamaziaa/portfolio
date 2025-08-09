// Advanced Portfolio Website JavaScript
class PortfolioWebsite {
    constructor() {
        this.init();
    }

    init() {
        this.setupPreloader();
        this.setupNavigation();
        this.setupSmoothScrolling();
        this.setupAnimations();
        this.setupSkillBars();
        this.setupProjectCards();
        this.setupContactForm();
        this.setupCustomCursor();
        if (this.isDesktop()) {
            this.setupParallaxEffects();
            this.setupThemeToggle();
            this.setupHeroParallax();
            this.setupSectionParallax();
        }
    }

    setupPreloader() {
        const preloader = document.getElementById('preloader');

        if (preloader) {
            setTimeout(() => {
                preloader.classList.add('fade-out');
                preloader.addEventListener('transitionend', () => {
                    preloader.remove();
                    document.body.classList.add('page-loaded');
                    this.triggerPostPreloaderAnimations();
                }, { once: true });
            }, 3000);
        }
    }

    triggerPostPreloaderAnimations() {
        // Trigger typing effect
        this.setupTypingEffect();

        // Trigger particle effects
        this.setupParticleEffects();

        // Trigger scroll progress
        this.setupScrollProgress();

        // Trigger counter animations
        this.setupCounterAnimations();

        // Trigger page animations
        this.triggerPageAnimations();

        // Trigger hero parallax
        this.setupHeroParallax();
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

    setupCustomCursor() {
        // Only setup custom cursor on desktop devices
        if (this.isTouchDevice()) {
            return;
        }

        // Create custom cursor element
        const cursor = document.createElement('div');
        cursor.className = 'custom-cursor';
        document.body.appendChild(cursor);

        // Variables for smooth movement
        let mouseX = 0;
        let mouseY = 0;
        let cursorX = 0;
        let cursorY = 0;
        let isVisible = false;

        // Mouse move handler
        const handleMouseMove = (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;

            if (!isVisible) {
                cursor.classList.add('visible');
                document.body.classList.add('custom-cursor-active');
                isVisible = true;
            }
        };

        // Smooth cursor movement with easing
        const updateCursor = () => {
            // Much more responsive interpolation
            cursorX += (mouseX - cursorX) * 0.9;
            cursorY += (mouseY - cursorY) * 0.9;

            cursor.style.left = cursorX + 'px';
            cursor.style.top = cursorY + 'px';

            requestAnimationFrame(updateCursor);
        };

        // Hover effects for interactive elements
        const interactiveElements = document.querySelectorAll('a, button, .nav-link, .project-card, .social-link, .contact-item p[onclick], .scroll-indicator, .btn, .nav-toggle, .tech-tag');

        interactiveElements.forEach(element => {
            element.addEventListener('mouseenter', () => {
                cursor.classList.add('hover');
            });

            element.addEventListener('mouseleave', () => {
                cursor.classList.remove('hover');
            });
        });

        // Hide cursor when leaving window
        document.addEventListener('mouseleave', () => {
            cursor.classList.remove('visible');
            document.body.classList.remove('custom-cursor-active');
            isVisible = false;
        });

        // Show cursor when entering window
        document.addEventListener('mouseenter', () => {
            if (!this.isTouchDevice()) {
                cursor.classList.add('visible');
                document.body.classList.add('custom-cursor-active');
                isVisible = true;
            }
        });

        // Start the cursor animation
        updateCursor();

        // Add mouse move listener
        document.addEventListener('mousemove', handleMouseMove);
    }

    isTouchDevice() {
        return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    }

    setupParallaxEffects() {
        const stars = document.querySelectorAll('.star1, .star2');

        const updateStars = () => {
            // Only run parallax effects if page is loaded
            if (!document.body.classList.contains('page-loaded')) {
                return;
            }

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

    setupHeroParallax() {
        const heroH1 = document.querySelector('.hero h1.hi');
        const heroH2 = document.querySelector('.hero h2.a');

        const updateHeroParallax = () => {
            // Only run parallax effects if page is loaded
            if (!document.body.classList.contains('page-loaded')) {
                return;
            }

            const scrolled = window.pageYOffset;
            const heroSection = document.querySelector('.hero');

            if (heroSection && heroH1 && heroH2) {
                const heroHeight = heroSection.offsetHeight;
                const heroTop = heroSection.offsetTop;

                // Only apply parallax when hero section is in view
                if (scrolled >= heroTop && scrolled <= heroTop + heroHeight) {
                    const progress = (scrolled - heroTop) / heroHeight;
                    const maxOffset = 500; // Maximum pixels to move

                    // H1 moves to the right
                    const h1Offset = progress * maxOffset;
                    heroH1.style.transform = `translateX(${h1Offset}px)`;

                    // H2 moves to the left
                    const h2Offset = progress * -maxOffset;
                    heroH2.style.transform = `translateX(${h2Offset}px)`;
                } else if (scrolled < heroTop) {
                    // Reset position when above hero section
                    heroH1.style.transform = 'translateX(0)';
                    heroH2.style.transform = 'translateX(0)';
                }
            }
        };

        window.addEventListener('scroll', updateHeroParallax);
        // Ensure correct position on load
        updateHeroParallax();
    }

    setupSectionParallax() {
        const sections = document.querySelectorAll('section');

        const updateSectionParallax = () => {
            if (!document.body.classList.contains('page-loaded')) return;

            const scrolled = window.pageYOffset;
            const windowHeight = window.innerHeight;

            sections.forEach((section) => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.offsetHeight;

                if (scrolled + windowHeight > sectionTop && scrolled < sectionTop + sectionHeight) {
                    const progress = (scrolled - sectionTop + windowHeight) / (windowHeight + sectionHeight);
                    const maxOffset = 1300;

                    // About section parallax
                    if (section.id === 'about') {
                        const aboutText = section.querySelector('.about-text');
                        const aboutImage = section.querySelector('.about-image');
                        if (aboutText) aboutText.style.transform = `translateX(${progress * maxOffset * 10}px)`;
                        if (aboutImage) aboutImage.style.transform = `translateX(${progress * -maxOffset * 0.6}px)`;
                    }

                    // Skills section parallax
                    if (section.id === 'skills') {
                        const skillsGrid = section.querySelector('.skills-grid');
                        if (skillsGrid) skillsGrid.style.transform = `translateY(${progress * maxOffset * 0.5}px)`;
                    }

                    // Projects section parallax
                    if (section.id === 'projects') {
                        const projectsGrid = section.querySelector('.projects-grid');
                        if (projectsGrid) projectsGrid.style.transform = `translateY(${progress * maxOffset * 0.4}px)`;
                    }

                    // Contact section parallax
                    if (section.id === 'contact') {
                        const contactInfo = section.querySelector('.contact-info');
                        const contactForm = section.querySelector('.contact-form');
                        if (contactInfo) contactInfo.style.transform = `translateX(${progress * maxOffset * 0.6}px)`;
                        if (contactForm) contactForm.style.transform = `translateX(${progress * -maxOffset * 0.6}px)`;
                    }
                }
            });
        };

        window.addEventListener('scroll', updateSectionParallax);
        updateSectionParallax();
    }

    setupSectionParallax() {
        const sections = document.querySelectorAll('section');

        const updateSectionParallax = () => {
            // Only run parallax effects if page is loaded
            if (!document.body.classList.contains('page-loaded')) {
                return;
            }

            const scrolled = window.pageYOffset;
            const windowHeight = window.innerHeight;

            sections.forEach((section, index) => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.offsetHeight;
                const sectionBottom = sectionTop + sectionHeight;

                // Only apply parallax when section is in view
                if (scrolled + windowHeight > sectionTop && scrolled < sectionBottom) {
                    const progress = (scrolled - sectionTop + windowHeight) / (windowHeight + sectionHeight);
                    const maxOffset = 50; // Maximum pixels to move

                    // Different parallax effects for different sections
                    switch (section.id) {
                        case 'about':
                            this.updateAboutParallax(section, progress, maxOffset);
                            break;
                        case 'skills':
                            this.updateSkillsParallax(section, progress, maxOffset);
                            break;
                        case 'projects':
                            this.updateProjectsParallax(section, progress, maxOffset);
                            break;
                        case 'contact':
                            this.updateContactParallax(section, progress, maxOffset);
                            break;
                        default:
                            // Default parallax for other sections
                            const title = section.querySelector('.section-title');
                            if (title) {
                                const titleOffset = progress * maxOffset * 0.5;
                                title.style.transform = `translateY(${titleOffset}px)`;
                            }
                            break;
                    }
                }
            });
        };

        window.addEventListener('scroll', updateSectionParallax);
        // Ensure correct position on load
        updateSectionParallax();
    }

    updateAboutParallax(section, progress, maxOffset) {
        const aboutText = section.querySelector('.about-text');
        const aboutImage = section.querySelector('.about-image');
        const desc = section.querySelector('.desc');
        const aboutDesc = section.querySelector('.about-desc');

        if (aboutText) {
            const textOffset = progress * maxOffset * 0.8;
            aboutText.style.transform = `translateX(${textOffset}px)`;
        }

        if (aboutImage) {
            const imageOffset = progress * -maxOffset * 0.6;
            aboutImage.style.transform = `translateX(${imageOffset}px)`;
        }

        if (desc) {
            const descOffset = progress * maxOffset * 0.4;
            desc.style.transform = `translateX(${descOffset}px)`;
        }

        if (aboutDesc) {
            const aboutDescOffset = progress * maxOffset * 0.3;
            aboutDesc.style.transform = `translateX(${aboutDescOffset}px)`;
        }
    }

    updateSkillsParallax(section, progress, maxOffset) {
        const skillsGrid = section.querySelector('.skills-grid');
        const skillTitles = section.querySelectorAll('.skill-category h3');

        if (skillsGrid) {
            const gridOffset = progress * maxOffset * 0.5;
            skillsGrid.style.transform = `translateY(${gridOffset}px)`;
        }

        skillTitles.forEach((title, index) => {
            const titleOffset = progress * maxOffset * (0.3 + index * 0.1);
            title.style.transform = `translateY(${titleOffset}px)`;
        });
    }

    updateProjectsParallax(section, progress, maxOffset) {
        const projectsGrid = section.querySelector('.projects-grid');
        const projectCards = section.querySelectorAll('.project-card');

        if (projectsGrid) {
            const gridOffset = progress * maxOffset * 0.4;
            projectsGrid.style.transform = `translateY(${gridOffset}px)`;
        }

        projectCards.forEach((card, index) => {
            const cardOffset = progress * maxOffset * (0.2 + index * 0.1);
            const direction = index % 2 === 0 ? 1 : -1;
            card.style.transform = `translateX(${cardOffset * direction}px)`;
        });
    }

    updateContactParallax(section, progress, maxOffset) {
        const contactInfo = section.querySelector('.contact-info');
        const contactForm = section.querySelector('.contact-form');

        if (contactInfo) {
            const infoOffset = progress * maxOffset * 0.6;
            contactInfo.style.transform = `translateX(${infoOffset}px)`;
        }

        if (contactForm) {
            const formOffset = progress * -maxOffset * 0.6;
            contactForm.style.transform = `translateX(${formOffset}px)`;
        }
    }

    setupTypingEffect() {
        const typingElement = document.querySelector('.typing-text');
        const articleElement = document.querySelector('.a');
        if (typingElement && articleElement) {
            const texts = ['Developer', 'Designer', 'Genius'];
            let textIndex = 0;
            let charIndex = 0;
            let isDeleting = false;

            // Function to get the correct article
            const getArticle = (word) => {
                const vowels = ['a', 'e', 'i', 'o', 'u'];
                return vowels.includes(word.toLowerCase()[0]) ? 'An' : 'A';
            };

            const type = () => {
                // Only run typing effect if page is loaded
                if (!document.body.classList.contains('page-loaded')) {
                    return;
                }

                const currentText = texts[textIndex];

                if (isDeleting) {
                    typingElement.textContent = currentText.substring(0, charIndex - 1);
                    charIndex--;
                } else {
                    typingElement.textContent = currentText.substring(0, charIndex + 1);
                    charIndex++;
                }

                // Update the article based on the current word
                const article = getArticle(currentText);
                articleElement.innerHTML = `${article} <span class="typing-text">${typingElement.textContent}</span>.`;

                let typeSpeed = 100;

                if (isDeleting) {
                    typeSpeed /= 2;
                }

                if (!isDeleting && charIndex === currentText.length) {
                    typeSpeed = 2000; // Pause at end
                    isDeleting = true;
                } else if (isDeleting && charIndex === 0) {
                    isDeleting = false;
                    textIndex = (textIndex + 1) % texts.length;
                    typeSpeed = 500; // Pause before next word
                }

                setTimeout(type, typeSpeed);
            };

            // Start typing after a short delay
            setTimeout(type, 1000);
        }
    }

    setupParticleEffects() {
        const particleContainer = document.createElement('div');
        particleContainer.className = 'particle-container';
        document.body.appendChild(particleContainer);

        const createParticle = () => {
            // Only create particles if page is loaded
            if (!document.body.classList.contains('page-loaded')) {
                return;
            }

            const particle = document.createElement('div');
            particle.className = 'particle';

            // Random position
            particle.style.left = Math.random() * 100 + '%';
            particle.style.animationDelay = Math.random() * 1 + 's';

            particleContainer.appendChild(particle);
        };

        // Create particles periodically
        setInterval(createParticle, 1100); // Much more frequent particle creation

        // Create initial particles
        for (let i = 0; i < 2; i++) { // 5x more initial particles
            setTimeout(createParticle, i * 500); // Faster initial spawn
        }
    }

    setupScrollProgress() {
        const progressBar = document.createElement('div');
        progressBar.className = 'scroll-progress';
        document.body.appendChild(progressBar);

        window.addEventListener('scroll', () => {
            // Only track scroll progress if page is loaded
            if (!document.body.classList.contains('page-loaded')) {
                return;
            }

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
        const counters = document.querySelectorAll('.stat-number');

        const counterObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const counter = entry.target;
                    const target = parseInt(counter.getAttribute('data-target'));
                    const duration = 2000; // 2 seconds
                    const increment = target / (duration / 16); // 60fps
                    let current = 0;

                    const updateCounter = () => {
                        // Only run counter if page is loaded
                        if (!document.body.classList.contains('page-loaded')) {
                            return;
                        }

                        current += increment;
                        if (current < target) {
                            counter.textContent = Math.floor(current);
                            requestAnimationFrame(updateCounter);
                        } else {
                            counter.textContent = target;
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
        // Only trigger animations if page is loaded
        if (!document.body.classList.contains('page-loaded')) {
            return;
        }

        // Add page-loaded class to body for CSS animations
        document.body.classList.add('page-loaded');

        // Trigger hero animations
        const heroElements = document.querySelectorAll('.hero-content > *');
        heroElements.forEach((element, index) => {
            setTimeout(() => {
                element.classList.add('animate__fadeIn');
            }, index * 200);
        });

        // Trigger section animations
        const sections = document.querySelectorAll('section');
        sections.forEach((section, index) => {
            setTimeout(() => {
                section.classList.add('animate__fadeIn');
            }, (index + 1) * 300);
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
        return function () {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    isDesktop() {
        return window.innerWidth > 1024;
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

document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('img').forEach(img => {
        if (!img.hasAttribute('loading')) {
            img.setAttribute('loading', 'lazy');
        }
    });
});


console.log("W if you see this!");
/*
Adjectives:
Crazy
Amazing
Fire


Shop Name:
Engine
Foods
Garments


Another Word:
Bros
Limited
Hub
*/

// Business Name Generator (no arrays, no HTML changes)
(function () {
    var adjectivesStr = 'Brilliant,Sunny,Urban,Cosmic,Golden,Swift,Lucky,Bold,Fresh,Royal,Happy,Modern,Clever,Epic,Magic,Prime,Chic,Smart,Vivid,Blue';
    var shopNamesStr = 'Studio,Works,Shop,Lab,Market,Boutique,Corner,Collective,Gallery,Depot,Barn,Loft,Den,Nest,Place,Point,House,Room,Garage,Parlor';
    var otherWordsStr = 'Solutions,Designs,Hub,World,Zone,Space,Makers,Dreams,Forge,Craft,Edge,Wave,Spark,Nest,Vision,Pulse,Roots,Works,Hive,Sphere';
    function getRandomWord(str) {
        var arr = str.split(',');
        return arr[Math.floor(Math.random() * arr.length)];
    }
    window.generateBusinessName = function () {
        return getRandomWord(adjectivesStr) + ' ' + getRandomWord(shopNamesStr) + ' ' + getRandomWord(otherWordsStr);
    };
})();


console.log(window.generateBusinessName());





