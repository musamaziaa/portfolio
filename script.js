/* ============================================================
   USAMA ZIA — PORTFOLIO JAVASCRIPT
   Clean, performant, no duplicate methods, no dead code.
   ============================================================ */

class Portfolio {
  constructor() {
    this.isMobile = window.innerWidth <= 1024;
    this.isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    this.scrollTicking = false;
    this.init();
  }

  init() {
    this.setupPreloader();
    this.setupNavigation();
    this.setupSmoothScroll();
    this.setupScrollReveal();
    this.setupSkillBars();
    this.setupProjectCards();
    this.setupCopyButtons();
    this.setupContactForm();

    if (!this.isTouch) {
      this.setupCustomCursor();
    }
  }

  /* ==========================================================
     PRELOADER
     ========================================================== */
  setupPreloader() {
    const preloader = document.getElementById('preloader');
    if (!preloader) return;

    const launch = () => {
      preloader.classList.add('fade-out');
      preloader.addEventListener('transitionend', () => {
        preloader.remove();
        document.body.classList.add('loaded');
        this.onPageLoaded();
      }, { once: true });
    };

    // Wait minimum 2.5s so the animation plays fully
    setTimeout(launch, 2500);
  }

  onPageLoaded() {
    this.setupParticles();
    this.setupScrollProgress();
    this.setupCounters();
    if (!this.isMobile) {
      this.setupParallax();
    }
  }

  /* ==========================================================
     NAVIGATION
     ========================================================== */
  setupNavigation() {
    const toggle = document.getElementById('navToggle');
    const links = document.getElementById('navLinks');
    const header = document.getElementById('site-header');

    if (toggle && links) {
      toggle.addEventListener('click', () => {
        const isOpen = links.classList.toggle('active');
        toggle.classList.toggle('active');
        toggle.setAttribute('aria-expanded', isOpen);
      });

      links.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
          links.classList.remove('active');
          toggle.classList.remove('active');
          toggle.setAttribute('aria-expanded', 'false');
        });
      });
    }

    // Header background on scroll — throttled
    let lastScroll = 0;
    const onScroll = () => {
      const y = window.scrollY;
      if (y > 80 && lastScroll <= 80) header.classList.add('scrolled');
      else if (y <= 80 && lastScroll > 80) header.classList.remove('scrolled');
      lastScroll = y;
    };
    window.addEventListener('scroll', () => this.throttledScroll(onScroll), { passive: true });
  }

  /* ==========================================================
     SMOOTH SCROLL
     ========================================================== */
  setupSmoothScroll() {
    // Nav links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', (e) => {
        const href = anchor.getAttribute('href');
        if (href === '#') return;
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
          const offset = document.getElementById('site-header')?.offsetHeight || 70;
          window.scrollTo({ top: target.offsetTop - offset, behavior: 'smooth' });
        }
      });
    });

    // Scroll indicator button
    const scrollBtn = document.querySelector('.scroll-indicator');
    if (scrollBtn) {
      scrollBtn.addEventListener('click', () => {
        const targetId = scrollBtn.dataset.target;
        const target = document.getElementById(targetId);
        if (target) {
          const offset = document.getElementById('site-header')?.offsetHeight || 70;
          window.scrollTo({ top: target.offsetTop - offset, behavior: 'smooth' });
        }
      });
    }
  }

  /* ==========================================================
     SCROLL REVEAL (IntersectionObserver)
     ========================================================== */
  setupScrollReveal() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    // Auto-tag elements for reveal
    document.querySelectorAll(
      '.about-grid, .about-lead, .about-desc, .stats-row, .about-image, ' +
      '.skill-category, .project-card, .contact-item, .contact-form, ' +
      '.section-title'
    ).forEach(el => {
      el.classList.add('reveal');
      observer.observe(el);
    });

    // Staggered reveal for grid children
    document.querySelectorAll('.projects-grid, .skills-grid').forEach(grid => {
      const children = grid.children;
      Array.from(children).forEach((child, i) => {
        child.style.transitionDelay = `${i * 0.1}s`;
      });
    });
  }

  /* ==========================================================
     SKILL BARS (animate on scroll)
     ========================================================== */
  setupSkillBars() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const bar = entry.target;
          const width = bar.dataset.width;
          // Small delay for visual effect
          setTimeout(() => {
            bar.style.width = width + '%';
          }, 300);
          observer.unobserve(bar);
        }
      });
    }, { threshold: 0.3 });

    document.querySelectorAll('.skill-progress').forEach(bar => {
      observer.observe(bar);
    });
  }

  /* ==========================================================
     PROJECT CARDS (hover effects via JS for richer control)
     ========================================================== */
  setupProjectCards() {
    if (this.isTouch) return;

    document.querySelectorAll('.project-card:not(.project-card--locked)').forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = ((y - centerY) / centerY) * -4;
        const rotateY = ((x - centerX) / centerX) * 4;
        
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px) scale(1.02)`;
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = '';
        card.style.transition = 'transform 0.5s var(--ease)';
      });
      
      card.addEventListener('mouseenter', () => {
        card.style.transition = 'transform 0.1s ease-out';
      });
    });
  }

  /* ==========================================================
     COPY TO CLIPBOARD
     ========================================================== */
  setupCopyButtons() {
    document.querySelectorAll('.copy-trigger').forEach(btn => {
      btn.addEventListener('click', () => {
        const text = btn.dataset.copy;
        if (!text) return;

        navigator.clipboard.writeText(text).then(() => {
          this.showNotification('Copied to clipboard!');
        }).catch(() => {
          // Fallback
          const textarea = document.createElement('textarea');
          textarea.value = text;
          textarea.style.position = 'fixed';
          textarea.style.opacity = '0';
          document.body.appendChild(textarea);
          textarea.select();
          document.execCommand('copy');
          document.body.removeChild(textarea);
          this.showNotification('Copied to clipboard!');
        });
      });
    });

    // Discord button also copies
    document.querySelectorAll('.social-link--discord').forEach(btn => {
      btn.addEventListener('click', () => {
        navigator.clipboard.writeText('cant_think123').then(() => {
          this.showNotification('Discord username copied!');
        }).catch(() => {});
      });
    });
  }

  /* ==========================================================
     CONTACT FORM — Just shows notification since there's a mailto
     ========================================================== */
  setupContactForm() {
    // The "submit" is actually a mailto link, so no JS form handling needed.
    // We just prevent default on the form itself.
    const form = document.getElementById('contactForm');
    if (form) {
      form.addEventListener('submit', (e) => e.preventDefault());
    }
  }



  /* ==========================================================
     PARTICLES (Interactive Canvas)
     ========================================================== */
  setupParticles() {
    const canvas = document.createElement('canvas');
    canvas.className = 'particle-container';
    document.body.appendChild(canvas);

    const ctx = canvas.getContext('2d');
    let width, height;

    const resize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      
      // Update bases on resize so they don't get squished weirdly
      if (particles.length > 0) {
          particles.forEach(p => {
              p.baseX = Math.random() * width;
              p.baseY = Math.random() * height;
          });
      }
    };
    
    const particles = [];
    const numParticles = this.isMobile ? 50 : 150;
    
    resize();
    window.addEventListener('resize', () => this.throttledScroll(resize));

    for (let i = 0; i < numParticles; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        baseX: Math.random() * width,
        baseY: Math.random() * height,
        density: (Math.random() * 30) + 1,
        radius: Math.random() * 2.5 + 0.5
      });
    }

    let mouse = { x: null, y: null, radius: 120 };
    window.addEventListener('mousemove', (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    });
    window.addEventListener('touchmove', (e) => {
      mouse.x = e.touches[0].clientX;
      mouse.y = e.touches[0].clientY;
    }, { passive: true });
    window.addEventListener('mouseleave', () => { mouse.x = null; mouse.y = null; });
    window.addEventListener('touchend', () => { mouse.x = null; mouse.y = null; });

    let animationId;
    let visible = true;

    const draw = () => {
      if (!visible) return;
      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = 'rgba(143, 221, 195, 0.7)';

      const time = Date.now() * 0.001;

      for (let i = 0; i < particles.length; i++) {
        let p = particles[i];

        if (mouse.x != null && mouse.y != null) {
          let dx = mouse.x - p.x;
          let dy = mouse.y - p.y;
          let distance = Math.hypot(dx, dy);

          if (distance < mouse.radius) {
            let forceDirectionX = dx / distance;
            let forceDirectionY = dy / distance;
            let force = (mouse.radius - distance) / mouse.radius;
            let directionX = forceDirectionX * force * p.density;
            let directionY = forceDirectionY * force * p.density;

            p.x -= directionX;
            p.y -= directionY;
          } else {
            if (p.x !== p.baseX) p.x -= (p.x - p.baseX) / 20;
            if (p.y !== p.baseY) p.y -= (p.y - p.baseY) / 20;
            
            // Add natural float
            p.x += Math.sin(time + p.density) * 0.3;
            p.y += Math.cos(time * 0.8 + p.radius) * 0.3;
          }
        } else {
          // Gently float back to base
          if (p.x !== p.baseX) p.x -= (p.x - p.baseX) / 20;
          if (p.y !== p.baseY) p.y -= (p.y - p.baseY) / 20;
          
          // Natural float
          p.x += Math.sin(time + p.density) * 0.3;
          p.y += Math.cos(time * 0.8 + p.radius) * 0.3;
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();
      }
      animationId = requestAnimationFrame(draw);
    };

    draw();

    document.addEventListener('visibilitychange', () => {
      visible = !document.hidden;
      if (visible) draw();
      else cancelAnimationFrame(animationId);
    });
  }

  /* ==========================================================
     SCROLL PROGRESS BAR
     ========================================================== */
  setupScrollProgress() {
    const bar = document.createElement('div');
    bar.className = 'scroll-progress';
    document.body.appendChild(bar);

    const update = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const pct = max > 0 ? (window.scrollY / max) * 100 : 0;
      bar.style.width = pct + '%';
    };

    window.addEventListener('scroll', () => this.throttledScroll(update), { passive: true });
  }

  /* ==========================================================
     COUNTER ANIMATIONS
     ========================================================== */
  setupCounters() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const target = parseInt(el.dataset.target, 10);
          const suffix = el.dataset.suffix || '';
          const duration = 1800;
          const step = target / (duration / 16);
          let current = 0;

          const count = () => {
            current += step;
            if (current >= target) {
              el.textContent = target + suffix;
            } else {
              el.textContent = Math.floor(current) + suffix;
              requestAnimationFrame(count);
            }
          };

          count();
          observer.unobserve(el);
        }
      });
    }, { threshold: 0.5 });

    document.querySelectorAll('.stat-number').forEach(el => observer.observe(el));
  }

  /* ==========================================================
     PARALLAX (desktop only)
     ========================================================== */
  setupParallax() {
    const stars = document.querySelectorAll('.hero-star');
    const heroTitle = document.querySelector('.hero-title');
    const heroRole = document.querySelector('.hero-role');

    const update = () => {
      const y = window.scrollY;
      const heroH = window.innerHeight;

      // Star parallax
      stars.forEach((star, i) => {
        const speed = 0.4 + i * 0.2;
        star.style.transform = `translateY(${y * speed}px) rotate(${y * 0.08}deg)`;
      });

      // Subtle vertical parallax for the whole hero content
      const heroContent = document.querySelector('.hero-content');
      const heroVisual = document.querySelector('.hero-visual');
      if (y < heroH) {
        const progress = y / heroH;
        if (heroContent) heroContent.style.transform = `translateY(${progress * 100}px)`;
        if (heroVisual) heroVisual.style.transform = `translateY(${progress * 150}px)`;
      }
    };

    window.addEventListener('scroll', () => this.throttledScroll(update), { passive: true });
  }

  /* ==========================================================
     CUSTOM CURSOR
     ========================================================== */
  setupCustomCursor() {
    const cursor = document.createElement('div');
    cursor.className = 'custom-cursor';
    document.body.appendChild(cursor);

    let mouseX = 0, mouseY = 0;
    let cursorX = 0, cursorY = 0;
    let visible = false;

    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      if (!visible) {
        cursor.classList.add('visible');
        document.body.classList.add('cursor-active');
        visible = true;
      }
    });

    document.addEventListener('mouseleave', () => {
      cursor.classList.remove('visible');
      document.body.classList.remove('cursor-active');
      visible = false;
    });
    document.addEventListener('mouseenter', () => {
      if (!this.isTouch) {
        cursor.classList.add('visible');
        document.body.classList.add('cursor-active');
        visible = true;
      }
    });

    // Smooth follow loop
    const loop = () => {
      cursorX += (mouseX - cursorX) * 0.25;
      cursorY += (mouseY - cursorY) * 0.25;
      cursor.style.left = cursorX + 'px';
      cursor.style.top = cursorY + 'px';
      requestAnimationFrame(loop);
    };
    loop();

    // Hover effects on interactive elements
    const interactives = document.querySelectorAll(
      'a, button, .nav-link, .project-card, .social-link, .btn, .nav-toggle, .tech-tag, .skill-item, .stat-card, .copy-trigger'
    );
    interactives.forEach(el => {
      el.addEventListener('mouseenter', () => cursor.classList.add('hover'));
      el.addEventListener('mouseleave', () => cursor.classList.remove('hover'));
    });

    // Click feedback
    document.addEventListener('mousedown', () => {
      cursor.style.transform = 'translate(-50%, -50%) scale(0.85)';
    });
    document.addEventListener('mouseup', () => {
      cursor.style.transform = 'translate(-50%, -50%) scale(1)';
    });
  }

  /* ==========================================================
     UTILITIES
     ========================================================== */
  showNotification(message) {
    const el = document.createElement('div');
    el.className = 'notification';
    el.textContent = message;
    document.body.appendChild(el);

    requestAnimationFrame(() => {
      requestAnimationFrame(() => el.classList.add('show'));
    });

    setTimeout(() => {
      el.classList.remove('show');
      el.addEventListener('transitionend', () => el.remove(), { once: true });
    }, 2500);
  }

  throttledScroll(fn) {
    if (!this.scrollTicking) {
      requestAnimationFrame(() => {
        fn();
        this.scrollTicking = false;
      });
      this.scrollTicking = true;
    }
  }
}

/* ==========================================================
   BOOT
   ========================================================== */
document.addEventListener('DOMContentLoaded', () => {
  new Portfolio();
});

// Lazy load images that don't already have loading attribute
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('img:not([loading])').forEach(img => {
    img.setAttribute('loading', 'lazy');
  });
});
