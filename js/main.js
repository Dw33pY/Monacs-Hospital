/* ============================================
   MONACS HOSPITAL KENYA — MAIN JAVASCRIPT
   GSAP + ScrollTrigger Animations
   ============================================ */

document.addEventListener('DOMContentLoaded', function() {

  // Register GSAP plugin
  gsap.registerPlugin(ScrollTrigger);

  // ---------- PRELOADER ----------
  const preloader = document.getElementById('preloader');
  document.body.classList.add('loading');

  window.addEventListener('load', function() {
    setTimeout(function() {
      preloader.classList.add('loaded');
      document.body.classList.remove('loading');
      initAnimations();
    }, 1200);
  });

  // Fallback: hide preloader after 4s
  setTimeout(function() {
    if (!preloader.classList.contains('loaded')) {
      preloader.classList.add('loaded');
      document.body.classList.remove('loading');
      initAnimations();
    }
  }, 4000);

  // ---------- IMAGE LAZY LOAD EFFECT ----------
  document.querySelectorAll('img').forEach(function(img) {
    if (img.complete) {
      img.classList.add('loaded');
    } else {
      img.addEventListener('load', function() {
        img.classList.add('loaded');
      });
      img.addEventListener('error', function() {
        img.classList.add('loaded');
      });
    }
  });

  // ---------- NAVBAR SCROLL BEHAVIOR ----------
  const navbar = document.getElementById('navbar');

  function handleNavbarScroll() {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', handleNavbarScroll, { passive: true });
  handleNavbarScroll();

  // ---------- MOBILE MENU TOGGLE ----------
  const navToggle = document.getElementById('navToggle');
  const mobileMenu = document.getElementById('mobileMenu');

  if (navToggle && mobileMenu) {
    navToggle.addEventListener('click', function() {
      navToggle.classList.toggle('active');
      mobileMenu.classList.toggle('active');
      document.body.classList.toggle('menu-open');
    });

    // Close mobile menu on link click
    mobileMenu.querySelectorAll('a').forEach(function(link) {
      link.addEventListener('click', function() {
        navToggle.classList.remove('active');
        mobileMenu.classList.remove('active');
        document.body.classList.remove('menu-open');
      });
    });
  }

  // ---------- BACK TO TOP BUTTON ----------
  const backToTop = document.getElementById('backToTop');

  if (backToTop) {
    window.addEventListener('scroll', function() {
      if (window.scrollY > 600) {
        backToTop.classList.add('visible');
      } else {
        backToTop.classList.remove('visible');
      }
    }, { passive: true });

    backToTop.addEventListener('click', function() {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // ---------- SMOOTH SCROLL FOR ANCHOR LINKS ----------
  document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
    anchor.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      if (href === '#') return;
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        const navHeight = navbar.offsetHeight;
        const targetPosition = target.getBoundingClientRect().top + window.scrollY - navHeight - 20;
        window.scrollTo({ top: targetPosition, behavior: 'smooth' });

        // Close mobile menu if open
        if (mobileMenu && mobileMenu.classList.contains('active')) {
          navToggle.classList.remove('active');
          mobileMenu.classList.remove('active');
          document.body.classList.remove('menu-open');
        }
      }
    });
  });

  // ---------- TESTIMONIALS CAROUSEL ----------
  const testimonialsTrack = document.getElementById('testimonialsTrack');
  const prevBtn = document.getElementById('prevTestimonial');
  const nextBtn = document.getElementById('nextTestimonial');
  const dotsContainer = document.getElementById('testimonialDots');

  if (testimonialsTrack && prevBtn && nextBtn && dotsContainer) {
    const cards = testimonialsTrack.querySelectorAll('.testimonial-card');
    let currentSlide = 0;
    const totalSlides = cards.length;

    // Create dots
    for (let i = 0; i < totalSlides; i++) {
      const dot = document.createElement('span');
      dot.classList.add('dot');
      if (i === 0) dot.classList.add('active');
      dot.setAttribute('data-index', i);
      dot.addEventListener('click', function() {
        goToSlide(parseInt(this.getAttribute('data-index')));
      });
      dotsContainer.appendChild(dot);
    }

    function goToSlide(index) {
      currentSlide = index;
      if (currentSlide < 0) currentSlide = totalSlides - 1;
      if (currentSlide >= totalSlides) currentSlide = 0;
      const offset = -currentSlide * 100;
      testimonialsTrack.style.transform = 'translateX(' + offset + '%)';

      // Update dots
      dotsContainer.querySelectorAll('.dot').forEach(function(dot, i) {
        dot.classList.toggle('active', i === currentSlide);
      });
    }

    prevBtn.addEventListener('click', function() {
      goToSlide(currentSlide - 1);
    });

    nextBtn.addEventListener('click', function() {
      goToSlide(currentSlide + 1);
    });

    // Auto-advance every 6 seconds
    let autoSlide = setInterval(function() {
      goToSlide(currentSlide + 1);
    }, 6000);

    // Pause on hover
    testimonialsTrack.addEventListener('mouseenter', function() {
      clearInterval(autoSlide);
    });

    testimonialsTrack.addEventListener('mouseleave', function() {
      autoSlide = setInterval(function() {
        goToSlide(currentSlide + 1);
      }, 6000);
    });

    // Touch/swipe support
    let touchStartX = 0;
    let touchEndX = 0;

    testimonialsTrack.addEventListener('touchstart', function(e) {
      touchStartX = e.changedTouches[0].screenX;
      clearInterval(autoSlide);
    }, { passive: true });

    testimonialsTrack.addEventListener('touchend', function(e) {
      touchEndX = e.changedTouches[0].screenX;
      const diff = touchStartX - touchEndX;
      if (Math.abs(diff) > 50) {
        if (diff > 0) {
          goToSlide(currentSlide + 1);
        } else {
          goToSlide(currentSlide - 1);
        }
      }
      autoSlide = setInterval(function() {
        goToSlide(currentSlide + 1);
      }, 6000);
    }, { passive: true });
  }

  // ---------- FAQ ACCORDION ----------
  document.querySelectorAll('.faq-question').forEach(function(button) {
    button.addEventListener('click', function() {
      const faqItem = this.parentElement;
      const isActive = faqItem.classList.contains('active');

      // Close all FAQ items
      document.querySelectorAll('.faq-item').forEach(function(item) {
        item.classList.remove('active');
      });

      // Open clicked item if it wasn't already active
      if (!isActive) {
        faqItem.classList.add('active');
      }
    });
  });

  // ---------- CONTACT FORM ----------
  const contactForm = document.getElementById('contactForm');
  const formFeedback = document.getElementById('formFeedback');

  if (contactForm && formFeedback) {
    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();

      const name = document.getElementById('name').value.trim();
      const email = document.getElementById('email').value.trim();
      const message = document.getElementById('message').value.trim();

      // Basic validation
      if (!name || !email || !message) {
        formFeedback.className = 'form-feedback error';
        formFeedback.textContent = 'Please fill in all required fields.';
        return;
      }

      // Email validation
      var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(email)) {
        formFeedback.className = 'form-feedback error';
        formFeedback.textContent = 'Please enter a valid email address.';
        return;
      }

      // Simulate form submission
      var submitBtn = contactForm.querySelector('button[type="submit"]');
      var originalText = submitBtn.innerHTML;
      submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Sending...';
      submitBtn.disabled = true;

      setTimeout(function() {
        formFeedback.className = 'form-feedback success';
        formFeedback.textContent = 'Thank you, ' + name + '! Your message has been sent. We will get back to you shortly.';
        contactForm.reset();
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;

        // Clear feedback after 5 seconds
        setTimeout(function() {
          formFeedback.className = 'form-feedback';
          formFeedback.textContent = '';
        }, 5000);
      }, 1500);
    });
  }

  // ---------- COUNTER ANIMATION ----------
  function animateCounters() {
    document.querySelectorAll('.stat-number').forEach(function(counter) {
      if (counter.dataset.animated) return;

      var target = parseInt(counter.getAttribute('data-count'));
      if (isNaN(target)) return;

      var duration = 2000;
      var start = 0;
      var startTime = null;

      function updateCounter(timestamp) {
        if (!startTime) startTime = timestamp;
        var progress = Math.min((timestamp - startTime) / duration, 1);
        // Ease out cubic
        var eased = 1 - Math.pow(1 - progress, 3);
        var current = Math.floor(eased * target);
        counter.textContent = current.toLocaleString();

        if (progress < 1) {
          requestAnimationFrame(updateCounter);
        } else {
          counter.textContent = target.toLocaleString();
          counter.dataset.animated = 'true';
        }
      }

      requestAnimationFrame(updateCounter);
    });
  }

  // ---------- GSAP ANIMATIONS ----------
  function initAnimations() {
    // ---- Hero reveal items (staggered) ----
    var heroRevealItems = document.querySelectorAll('.hero .reveal-item');
    if (heroRevealItems.length > 0) {
      gsap.to(heroRevealItems, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        stagger: 0.12,
        ease: 'power3.out',
        delay: 0.2
      });
    }

    // ---- Page hero reveal items ----
    var pageHeroItems = document.querySelectorAll('.page-hero .reveal-item');
    if (pageHeroItems.length > 0) {
      gsap.to(pageHeroItems, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        stagger: 0.15,
        ease: 'power3.out',
        delay: 0.3
      });
    }

    // ---- Scroll-triggered reveal-up ----
    gsap.utils.toArray('.reveal-up').forEach(function(el) {
      gsap.to(el, {
        scrollTrigger: {
          trigger: el,
          start: 'top 88%',
          toggleActions: 'play none none none'
        },
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: 'power3.out'
      });
    });

    // ---- Scroll-triggered reveal-left ----
    gsap.utils.toArray('.reveal-left').forEach(function(el) {
      gsap.to(el, {
        scrollTrigger: {
          trigger: el,
          start: 'top 85%',
          toggleActions: 'play none none none'
        },
        opacity: 1,
        x: 0,
        duration: 1,
        ease: 'power3.out'
      });
    });

    // ---- Scroll-triggered reveal-right ----
    gsap.utils.toArray('.reveal-right').forEach(function(el) {
      gsap.to(el, {
        scrollTrigger: {
          trigger: el,
          start: 'top 85%',
          toggleActions: 'play none none none'
        },
        opacity: 1,
        x: 0,
        duration: 1,
        ease: 'power3.out'
      });
    });

    // ---- Stats counter animation on scroll ----
    var statsSection = document.querySelector('.stats-bar');
    if (statsSection) {
      ScrollTrigger.create({
        trigger: statsSection,
        start: 'top 80%',
        onEnter: function() {
          animateCounters();
        },
        once: true
      });
    }

    // ---- Service cards stagger ----
    var serviceCards = document.querySelectorAll('.service-card, .service-detail-card');
    if (serviceCards.length > 0) {
      gsap.to(serviceCards, {
        scrollTrigger: {
          trigger: serviceCards[0],
          start: 'top 85%',
          toggleActions: 'play none none none'
        },
        opacity: 1,
        y: 0,
        duration: 0.6,
        stagger: 0.12,
        ease: 'power3.out'
      });
    }

    // ---- Value cards stagger ----
    var valueCards = document.querySelectorAll('.value-card');
    if (valueCards.length > 0) {
      gsap.to(valueCards, {
        scrollTrigger: {
          trigger: valueCards[0],
          start: 'top 85%',
          toggleActions: 'play none none none'
        },
        opacity: 1,
        y: 0,
        duration: 0.6,
        stagger: 0.1,
        ease: 'power3.out'
      });
    }

    // ---- Contact info cards stagger ----
    var contactCards = document.querySelectorAll('.contact-info-card');
    if (contactCards.length > 0) {
      gsap.to(contactCards, {
        scrollTrigger: {
          trigger: contactCards[0],
          start: 'top 85%',
          toggleActions: 'play none none none'
        },
        opacity: 1,
        y: 0,
        duration: 0.6,
        stagger: 0.1,
        ease: 'power3.out'
      });
    }

    // ---- Gallery items stagger ----
    var galleryItems = document.querySelectorAll('.gallery-item');
    if (galleryItems.length > 0) {
      gsap.to(galleryItems, {
        scrollTrigger: {
          trigger: galleryItems[0],
          start: 'top 85%',
          toggleActions: 'play none none none'
        },
        opacity: 1,
        y: 0,
        duration: 0.6,
        stagger: 0.08,
        ease: 'power3.out'
      });
    }

    // ---- FAQ items stagger ----
    var faqItems = document.querySelectorAll('.faq-item');
    if (faqItems.length > 0) {
      gsap.to(faqItems, {
        scrollTrigger: {
          trigger: faqItems[0],
          start: 'top 85%',
          toggleActions: 'play none none none'
        },
        opacity: 1,
        y: 0,
        duration: 0.5,
        stagger: 0.08,
        ease: 'power3.out'
      });
    }

    // ---- Hero parallax scroll effect ----
    var heroBgImg = document.querySelector('.hero-bg-img');
    var heroSection = document.getElementById('hero');

    if (heroBgImg && heroSection) {
      gsap.to(heroBgImg, {
        scrollTrigger: {
          trigger: heroSection,
          start: 'top top',
          end: 'bottom top',
          scrub: 0.5,
          invalidateOnRefresh: true
        },
        y: '15%',
        ease: 'none'
      });
    }

    // ---- Hero content parallax (text moves slower) ----
    var heroContent = document.querySelector('.hero-content');
    if (heroContent && heroSection) {
      gsap.to(heroContent, {
        scrollTrigger: {
          trigger: heroSection,
          start: 'top top',
          end: 'bottom top',
          scrub: 0.3
        },
        y: '8%',
        opacity: 0.3,
        ease: 'none'
      });
    }

    // ---- Hero cards parallax (cards move slightly differently) ----
    var heroCards = document.querySelector('.hero-cards');
    if (heroCards && heroSection) {
      gsap.to(heroCards, {
        scrollTrigger: {
          trigger: heroSection,
          start: 'top top',
          end: 'bottom top',
          scrub: 0.4
        },
        y: '12%',
        ease: 'none'
      });
    }
    // ---- CTA box scale-in effect ----
    var ctaBox = document.querySelector('.cta-box');
    if (ctaBox) {
      gsap.fromTo(ctaBox, 
        { scale: 0.95, opacity: 0 },
        {
          scrollTrigger: {
            trigger: ctaBox,
            start: 'top 85%',
            toggleActions: 'play none none none'
          },
          scale: 1,
          opacity: 1,
          duration: 0.8,
          ease: 'power3.out'
        }
      );
    }

    // Refresh ScrollTrigger after all animations are set up
    ScrollTrigger.refresh();
  }

  // ---------- MAGNETIC HOVER ON SERVICE CARDS ----------
  document.querySelectorAll('.service-card, .service-detail-card, .value-card, .contact-info-card').forEach(function(card) {
    card.addEventListener('mousemove', function(e) {
      var rect = card.getBoundingClientRect();
      var x = e.clientX - rect.left;
      var y = e.clientY - rect.top;
      var centerX = rect.width / 2;
      var centerY = rect.height / 2;
      var moveX = (x - centerX) / centerX * 3;
      var moveY = (y - centerY) / centerY * 3;

      card.style.transform = 'translateY(-4px) translate(' + moveX + 'px, ' + moveY + 'px)';
    });

    card.addEventListener('mouseleave', function() {
      card.style.transform = '';
    });
  });

  // ---------- BUTTON HOVER RIPPLE EFFECT ----------
  document.querySelectorAll('.btn').forEach(function(btn) {
    btn.addEventListener('mouseenter', function(e) {
      var rect = btn.getBoundingClientRect();
      var x = e.clientX - rect.left;
      var y = e.clientY - rect.top;

      var ripple = document.createElement('span');
      ripple.style.cssText = 'position:absolute;border-radius:50%;background:rgba(255,255,255,0.2);width:0;height:0;left:' + x + 'px;top:' + y + 'px;transform:translate(-50%,-50%);pointer-events:none;';
      btn.style.position = 'relative';
      btn.style.overflow = 'hidden';
      btn.appendChild(ripple);

      gsap.to(ripple, {
        width: 300,
        height: 300,
        opacity: 0,
        duration: 0.6,
        ease: 'power2.out',
        onComplete: function() {
          ripple.remove();
        }
      });
    });
  });

  // ---------- ACTIVE NAV LINK HIGHLIGHT ----------
  var currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.navbar-links a, .mobile-menu-links a').forEach(function(link) {
    var href = link.getAttribute('href');
    if (href === currentPage) {
      link.classList.add('active');
    } else {
      // Don't remove active from hash links
      if (!href.startsWith('#')) {
        link.classList.remove('active');
      }
    }
  });

  // ---------- SCROLL PROGRESS INDICATOR ----------
  var progressBar = document.createElement('div');
  progressBar.style.cssText = 'position:fixed;top:0;left:0;height:3px;background:linear-gradient(90deg,#0F766E,#C9A84C);z-index:10001;transition:width 0.1s linear;width:0;';
  document.body.appendChild(progressBar);

  window.addEventListener('scroll', function() {
    var scrollTop = window.scrollY;
    var docHeight = document.documentElement.scrollHeight - window.innerHeight;
    var scrollPercent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    progressBar.style.width = scrollPercent + '%';
  }, { passive: true });

  // ---------- INTERSECTION OBSERVER FOR PERFORMANCE ----------
  // Pause animations when elements are not visible
  if ('IntersectionObserver' in window) {
    var observerOptions = {
      rootMargin: '50px'
    };

    var imageObserver = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          var img = entry.target;
          if (img.dataset.src) {
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
          }
          imageObserver.unobserve(img);
        }
      });
    }, observerOptions);

    document.querySelectorAll('img[data-src]').forEach(function(img) {
      imageObserver.observe(img);
    });
  }

    // ---------- HERO PARTICLES ----------
  var particlesContainer = document.getElementById('heroParticles');
  if (particlesContainer) {
    var particleCount = window.innerWidth < 768 ? 12 : 24;

    for (var i = 0; i < particleCount; i++) {
      var particle = document.createElement('div');
      particle.classList.add('hero-particle');

      var size = Math.random() * 6 + 2;
      var left = Math.random() * 100;
      var delay = Math.random() * 15;
      var duration = Math.random() * 10 + 12;

      particle.style.width = size + 'px';
      particle.style.height = size + 'px';
      particle.style.left = left + '%';
      particle.style.bottom = '-20px';
      particle.style.animationDelay = delay + 's';
      particle.style.animationDuration = duration + 's';

      particlesContainer.appendChild(particle);
    }
  }

});