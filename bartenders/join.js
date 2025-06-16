document.addEventListener("DOMContentLoaded", () => {
  
const aipromptForm = document.getElementById('ai-join-form');
const aipromptSuccess = document.getElementById('ai-success-message');

if (aipromptForm && aipromptSuccess) {
  aipromptForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const userPrompt = aipromptForm.querySelector('input[name="ai-message"]').value.trim();

    // Validation rules
    const minLength = 40;
    const emailPattern = /[^\s@]+@[^\s@]+\.[^\s@]+/;
    const phonePattern = /(\+?\(?\d{1,4}\)?[\s\d\-]{5,})/;
     // Pattern pour Instagram (handle ou lien)
    const instaRegex = /(@[a-zA-Z0-9_.]{2,30})|(instagram\.com\/[a-zA-Z0-9_.]{2,30})/i;

    const hasEmail = emailPattern.test(userPrompt);
    const hasPhone = phonePattern.test(userPrompt);
    const hasInsta = instaRegex.test(userPrompt);

    if (!hasEmail && !hasPhone) {
      alert("Please include an email or phone number so we can contact you.");
      return;
    }

    if (!hasInsta) {
      alert("Please include you Instagram account.");
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

});