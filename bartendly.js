//fade in
document.addEventListener('DOMContentLoaded', () => {
    document.body.classList.add('js-animate'); // Only if JS loads properly
  
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('fade-in');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
  
    document.querySelectorAll('section, .testimonial, .faq-item').forEach((el) => {
      observer.observe(el);
    });
  });

  const bartenders = window.bartenders || [];
  
  const finalList = [...bartenders.sort(() => 0.5 - Math.random())];

  finalList.push({
    name: "And many others",
    bar: "Talented bartenders in Hong Kong",
    img: "more-bartenders",
    alt: "Group of bartenders celebrating in a bar"
  });

  const wrapper = document.querySelector('.swiper-wrapper');

  finalList.forEach(({ name, bar, img, alt }) => {
  const slide = document.createElement('div');
  slide.className = 'swiper-slide';
  slide.setAttribute('role', 'group');
  slide.setAttribute('aria-label', `${name} from ${bar}`);

  if (img === "more-bartenders") {
  slide.innerHTML = `
    <a href="#book" class="promo-slide-link" aria-label="Book a bartender with Bartendly">
      <div class="text-slide">
        <div class="text-slide-content">
          <h3>And many other talented bartenders in Hong Kong</h3>
          <p>Try Bartendly today — no commission fees during our launch! <span class="cta-arrow" aria-hidden="true">→</span></p>
        </div>
      </div>
    </a>
  `;
 }
 else {
    slide.innerHTML = `
      <picture>
        <source srcset="/images/${img}.webp" type="image/webp">
        <img src="/images/${img}.jpg" alt="${alt}" title="${alt}" loading="lazy" width="600" height="450">
      </picture>
      <div class="carousel-info">
        <h3>${name}</h3>
        <p>${bar}</p>
      </div>
    `;
  }

  wrapper.appendChild(slide);
});


  window.addEventListener('load', () => {
    new Swiper('.swiper', {
      loop: true,
      autoplay: {
        delay: 7000,
        disableOnInteraction: false,
      },
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
      },
      pagination: {
        el: '.swiper-pagination',
        clickable: true,
      },
      slidesPerView: 1,
      spaceBetween: 20,
      breakpoints: {
        768: {
          slidesPerView: 2,
        },
        1024: {
          slidesPerView: 3,
        }
      }
    });
  });

  flatpickr("#date", {
    dateFormat: "Y-m-d",
    allowInput: true,
    clickOpens: true,
    defaultDate: null,
    disableMobile: true // ✅ Force Flatpickr on iPhone
  });

  const form = document.getElementById('contact-form');
  const successMessage = document.getElementById('success-message');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Validation before sending
    const email = document.querySelector('input[name="email"]').value.trim();
    const phone = document.querySelector('input[name="phone"]').value.trim();
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email && !phone) {
      alert('Please provide at least a phone number or an email address.');
      return; // STOP here, don't send
    }

    if (email && !emailPattern.test(email)) {
      alert('Please enter a valid email address.');
      return; // STOP here, don't send
    }

    // If validation passed, continue to send
    const data = new FormData(form);
    const response = await fetch(form.action, {
      method: 'POST',
      body: data,
      headers: { 'Accept': 'application/json' }
    });

    if (response.ok) {
      form.reset();
      form.style.display = 'none';
      successMessage.style.display = 'block';
    } else {
      alert('Oops! Something went wrong while sending your message.');
    }
  });

  // city toggle
  const toggleBtn = document.getElementById('city-toggle');
  const cityMenu = document.getElementById('city-menu');

  toggleBtn.addEventListener('click', () => {
    const isHidden = cityMenu.hasAttribute('hidden');
    if (isHidden) {
      cityMenu.removeAttribute('hidden');
    } else {
      cityMenu.setAttribute('hidden', '');
    }
  });

  // Optional: close menu if you click outside it
  document.addEventListener('click', (e) => {
    if (!toggleBtn.contains(e.target) && !cityMenu.contains(e.target)) {
      cityMenu.setAttribute('hidden', '');
    }
  });