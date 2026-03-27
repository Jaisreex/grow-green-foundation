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
    const dropdownContainer = dropdownToggle.closest('.nav-item-dropdown');
    
    dropdownToggle.addEventListener('click', (e) => {
      if (window.innerWidth <= 900) {
        e.preventDefault();
        dropdownContainer.classList.toggle('open');
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

  // ---- Smooth Scrolling for Anchors ----
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        window.scrollTo({
          top: target.offsetTop - 80,
          behavior: 'smooth'
        });
      }
    });
  });
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
