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
  
  
  const bartenders = window.bartenders || [];
  
  const finalList = [...bartenders.sort(() => 0.5 - Math.random())];

  finalList.push({
    name: "And many others",
    bar: "Talented bartenders in Hong Kong",
    img: "more-bartenders",
    alt: "Group of bartenders celebrating in a bar"
  });

  const wrapper = document.querySelector('.swiper-wrapper');
  if (wrapper){
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
          <h3>And many other talented professional bartenders</h3>
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
}

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
  if (form) {
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
      const submitBtn = form.querySelector('button[type="submit"]');
      submitBtn.disabled = true;
      submitBtn.textContent = 'Sending...';
      
      const data = new FormData(form);
      try {
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
      } catch (err) {
        alert("Network error. Please try again later.");
      } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Submit Event Request';
      }
  });
}

const aiform = document.getElementById('ai-request-form');
const aisuccessMessage = document.getElementById('ai-success-message');

if (aiform && aisuccessMessage) {
  aiform.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const userPrompt = aiform.querySelector('input[name="ai-prompt"]').value.trim();

    // Validation rules
    const minLength = 30;
    const datePattern = /\b(\d{1,2}[\/\-\. ]\d{1,2}([\/\-\. ]\d{2,4})?|\b(?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\.?\s+\d{1,2}|\d{1,2}\s+(?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\.?|\b(?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\.?\s+\d{4})\b/i;
    const hasDate = datePattern.test(userPrompt);

    if (!hasDate) {
      alert("Please include a date or approximate date for your event.");
      return;
    }

    if (userPrompt.length < minLength) {
      alert("Please provide a bit more detail about your request.");
      return;
    }

    const contactValue = aiform.querySelector('input[name="ai-contact"]').value.trim();

    // Improved patterns
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phonePattern = /^(\+?\(?\d{1,4}\)?[\s\d\-]{5,})$/;

    const isEmail = emailPattern.test(contactValue);
    const isPhone = phonePattern.test(contactValue);

    if (!isEmail && !isPhone) {
      alert('Please enter a valid email or phone number.');
      return;
    }

    const submitBtn = aiform.querySelector('button[type="submit"]');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending...';

    const data = new FormData(aiform);
    try {
      const response = await fetch(aiform.action, {
        method: 'POST',
        body: data,
        headers: { 'Accept': 'application/json' }
      });

      if (response.ok) {
        aiform.reset();
        aiform.style.display = 'none';
        aisuccessMessage.style.display = 'block';
      } else {
        alert('Oops! Something went wrong while sending your message.');
      }
    } catch (err) {
      alert('Network error. Please try again later.');
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Get My Bartender';
    }
  });
}

// ai prompt (for now only in london)
const aipromptForm = document.getElementById('ai-prompt-form');
const aipromptSuccess = document.getElementById('ai-success-message');

if (aipromptForm && aipromptSuccess) {
  aipromptForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const userPrompt = aipromptForm.querySelector('input[name="ai-message"]').value.trim();

    // Validation rules
    const minLength = 50;
    const emailPattern = /[^\s@]+@[^\s@]+\.[^\s@]+/;
    const phonePattern = /(\+?\(?\d{1,4}\)?[\s\d\-]{5,})/;
    const datePattern = /\b(\d{1,2}[\/\-\. ]\d{1,2}([\/\-\. ]\d{2,4})?|\b(?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\.?\s+\d{1,2}|\d{1,2}\s+(?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\.?|\b(?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\.?\s+\d{4})\b/i;
    const hasEmail = emailPattern.test(userPrompt);
    const hasPhone = phonePattern.test(userPrompt);
    const hasDate = datePattern.test(userPrompt);

    if (!hasEmail && !hasPhone) {
      alert("Please include an email or phone number so we can contact you.");
      return;
    }

    if (!hasDate) {
      alert("Please include a date or approximate date for your event.");
      return;
    }

    if (userPrompt.length < minLength) {
      alert("Please provide a bit more detail about your request.");
      return;
    }

    const submitBtn = aipromptForm.querySelector('button[type="submit"]');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending...';

    const data = new FormData(aipromptForm);

    try {
      const response = await fetch(aipromptForm.action, {
        method: 'POST',
        body: data,
        headers: { 'Accept': 'application/json' }
      });

      if (response.ok) {
        aipromptForm.reset();
        aipromptForm.style.display = 'none';
        aipromptSuccess.style.display = 'block';
      } else {
        alert("Oops! Something went wrong while sending your request.");
      }
    } catch (err) {
      alert("Network error. Please try again later.");
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Get My Bartender';
    }
  });
}


  // city toggle
  const toggleBtn = document.getElementById('city-toggle');
  const cityMenu = document.getElementById('city-menu');
  if (toggleBtn && cityMenu) {
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
    const clickedLink = e.target.closest('#city-menu a');
    
    // If clicked a city link, let it navigate naturally (do nothing)
    if (clickedLink) return;
  
    // If clicked outside toggle and menu, hide the menu
    if (!toggleBtn.contains(e.target) && !cityMenu.contains(e.target)) {
      cityMenu.setAttribute('hidden', '');
    }
  });  

  document.querySelectorAll('#city-menu a').forEach(link => {
    link.addEventListener('click', () => {
      cityMenu.setAttribute('hidden', '');
      // ❗No setTimeout, no preventDefault — let the browser do its job
    });
  });
  
}

// Globe helper tooltip logic
const helper = document.querySelector(".globe-helper");
const globe = document.querySelector(".globe-wrapper");
const cityToggle = document.getElementById('city-toggle');

if (helper && globe && cityToggle) {
  // Delayed first-time appearance
  setTimeout(() => {
    helper.classList.add("show-once");

    // Reposition if overflow
    const rect = helper.getBoundingClientRect();
    const overflowRight = rect.right > window.innerWidth;
    if (overflowRight) {
      helper.style.left = 'auto';
      helper.style.right = '0';
      helper.style.transform = 'none';
    }

    // Auto-hide after 3.5s
    setTimeout(() => {
      helper.classList.remove("show-once");
      helper.style.left = '';
      helper.style.right = '';
      helper.style.transform = '';
    }, 3500);
  }, 2000);

  // Hide helper immediately on click
  cityToggle.addEventListener('click', () => {
    helper.classList.remove("show-once");
    helper.classList.add("hide-tooltip");
    helper.style.left = '';
    helper.style.right = '';
    helper.style.transform = '';
  
    // Remove the class after a short delay (e.g., 500ms)
    setTimeout(() => {
      helper.classList.remove("hide-tooltip");
    }, 500);
  });
}

});