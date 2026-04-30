document.addEventListener('DOMContentLoaded', () => {
  const navbar = document.getElementById('navbar');

  // ---- Navbar Scroll Effect ----
  window.addEventListener('scroll', () => {
    if (window.scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  // ---- Reveal Animation ----
  const reveals = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
      }
    });
  }, { threshold: 0.1 });

  reveals.forEach(el => revealObserver.observe(el));

  // ---- Hamburger Menu (Unified Nav) ----
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('navLinks');

  if (hamburger) {
    hamburger.addEventListener('click', () => {
      navLinks.classList.toggle('open');
      const spans = hamburger.querySelectorAll('span');
      if (navLinks.classList.contains('open')) {
        spans[0].style.cssText = 'transform:rotate(45deg) translate(5px,5px)';
        spans[1].style.opacity = '0';
        spans[2].style.cssText = 'transform:rotate(-45deg) translate(5px,-5px)';
      } else {
        spans.forEach(s => s.style.cssText = '');
      }
    });

    // Close on link click (only for non-dropdown links)
    navLinks.querySelectorAll('.nav-link:not(.dropdown-toggle)').forEach(a => {
      a.addEventListener('click', () => {
        navLinks.classList.remove('open');
        hamburger.querySelectorAll('span').forEach(s => s.style.cssText = '');
      });
    });

    // Handle mobile dropdown toggle
    const dropdownToggle = document.getElementById('getInvolvedToggle');
    if (dropdownToggle) {
      const dropdownContainer = dropdownToggle.closest('.nav-item-dropdown');
      
      dropdownToggle.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        dropdownContainer.classList.toggle('open');
      });

      // Close dropdown when clicking outside
      document.addEventListener('click', (e) => {
        if (!dropdownContainer.contains(e.target)) {
          dropdownContainer.classList.remove('open');
        }
      });

      // Close mobile menu when clicking a dropdown item
      navLinks.querySelectorAll('.dropdown-item').forEach(item => {
        item.addEventListener('click', () => {
          navLinks.classList.remove('open');
          dropdownContainer.classList.remove('open');
          hamburger.querySelectorAll('span').forEach(s => s.style.cssText = '');
        });
      });
    }
  }

  // ---- Animated Counters (Impact Stats) ----
  const counters = document.querySelectorAll('.counter');
  const speed = 200;

  const animateCounters = () => {
    counters.forEach(counter => {
      const updateCount = () => {
        const target = +counter.getAttribute('data-target');
        const count = +counter.innerText;
        const inc = target / speed;

        if (count < target) {
          counter.innerText = Math.ceil(count + inc);
          setTimeout(updateCount, 1);
        } else {
          counter.innerText = target;
        }
      };
      updateCount();
    });
  };

  // Intersection Observer for counters
  const impactSection = document.getElementById('impact-map');
  if (impactSection) {
    const observer = new IntersectionObserver((entries) => {
      if(entries[0].isIntersecting) {
        animateCounters();
        observer.disconnect();
      }
    }, { threshold: 0.5 });
    observer.observe(impactSection);
  }

  // ---- ScrollSpy & Active State Logic ----
  const navLinksList = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  const updateActiveState = () => {
    let scrollPos = window.scrollY + 100;
    const currentPath = window.location.pathname;
    const currentHash = window.location.hash;
    const isHome = currentPath === '/' || currentPath.endsWith('index.html') || currentPath === '';

    // Handle Subpages (non-homepage)
    if (!isHome) {
      navLinksList.forEach(link => {
        link.classList.remove('active');
        const href = link.getAttribute('href');
        if (href && currentPath.includes(href.replace('../', ''))) {
          link.classList.add('active');
        }
      });
      return;
    }

    // Handle Homepage ScrollSpy
    let currentSectionId = 'home';
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
        currentSectionId = section.getAttribute('id');
      }
    });

    // If page just loaded and has a hash but hasn't fully scrolled, force the active state based on hash
    if (window.scrollY < 50 && currentHash) {
       const hashSection = currentHash.substring(1);
       if (document.getElementById(hashSection)) {
         currentSectionId = hashSection;
       }
    }

    // Exception for FAQ/Footer area to keep FAQ active if at bottom
    if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - 50) {
      currentSectionId = 'faq';
    }

    navLinksList.forEach(link => {
      link.classList.remove('active');
      const href = link.getAttribute('href');
      if (href === `#${currentSectionId}`) {
        link.classList.add('active');
      }
    });
  };

  // Click handler for smooth scroll and immediate active update
  navLinksList.forEach(link => {
    link.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href && href.startsWith('#')) {
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
          window.scrollTo({
            top: target.offsetTop - 80,
            behavior: 'smooth'
          });
          // Update immediately on click
          navLinksList.forEach(l => l.classList.remove('active'));
          this.classList.add('active');
        }
      }
    });
  });

  window.addEventListener('scroll', updateActiveState);
  updateActiveState(); // Run once on load


  // ---- FAQ Accordion Logic ----
  const faqItems = document.querySelectorAll('.faq-item');
  if (faqItems.length > 0) {
    faqItems.forEach(item => {
      const question = item.querySelector('.faq-question');
      if (question) {
        question.addEventListener('click', (e) => {
          e.preventDefault();
          const alreadyActive = item.classList.contains('active');
          
          // Close all FAQ items
          faqItems.forEach(faq => faq.classList.remove('active'));
          
          // If the clicked item wasn't active, open it
          if (!alreadyActive) {
            item.classList.add('active');
          }
        });
      }
    });
  }


});

// ---- Newsletter Form Handler ----
function handleNewsletter(e) {
  e.preventDefault();
  const email = document.getElementById('newsletter-email').value;
  showToast(`🌱 Thank you! ${email} has been added to our community updates.`, 'green');
  e.target.reset();
}

// ---- Toast Notification ----
function showToast(message, type = 'green') {
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.innerText = message;
  
  // Style toast (basic)
  toast.style.cssText = `
    position: fixed; bottom: 2rem; left: 50%; transform: translateX(-50%);
    background: #2D5A27; color: white; padding: 1rem 2rem; border-radius: 50px;
    z-index: 9999; font-weight: 700; box-shadow: 0 10px 30px rgba(0,0,0,0.2);
  `;
  
  document.body.appendChild(toast);
  setTimeout(() => { toast.style.opacity = '0'; toast.style.transition = 'opacity .3s ease'; setTimeout(() => toast.remove(), 300); }, 4000);
}

// ---- Opportunities Card Click Handler ----
function handleOppClick(event, targetUrl) {
  event.preventDefault();
  const card = event.currentTarget;
  
  // Add animating class to trigger CSS animation
  card.classList.add('animating');
  
  // Wait for animation to finish (approx 400-500ms) before navigating
  setTimeout(() => {
    window.location.href = targetUrl;
  }, 450);
}
