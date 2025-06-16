
// join.js – JS spécifique pour la page d'onboarding

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('join-form');
  const successMessage = document.getElementById('success-message');

  if (form && successMessage) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const input = form.querySelector('input[name="prompt"]').value.trim();
      if (input.length < 20) {
        alert("Please provide more details so we can understand your request.");
        return;
      }

      const submitBtn = form.querySelector('button[type="submit"]');
      submitBtn.disabled = true;
      submitBtn.textContent = "Sending...";

      const data = new FormData(form);
      try {
        const response = await fetch(form.action, {
          method: "POST",
          body: data,
          headers: {
            Accept: "application/json",
          },
        });

        if (response.ok) {
          form.reset();
          form.style.display = "none";
          successMessage.style.display = "block";
        } else {
          alert("Oops! Something went wrong. Please try again.");
        }
      } catch (error) {
        alert("Network error. Please try again later.");
      } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = "Join Bartendly";
      }
    });
  }
});
