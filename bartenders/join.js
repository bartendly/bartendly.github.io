document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("join-form");
  const input = document.getElementById("join-message");
  const success = document.getElementById("join-success");

  if (!form || !input || !success) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const value = input.value.trim();
    if (value.length < 20) {
      alert("Please provide a bit more detail.");
      return;
    }

    const contactRegex = /@|\+?\d[\d\s\-]{7,}/;
    if (!contactRegex.test(value)) {
      alert("Please include an email or phone so we can contact you.");
      return;
    }

    const data = new FormData(form);
    const btn = form.querySelector("button");
    btn.disabled = true;
    btn.textContent = "Sending...";

    try {
      const res = await fetch(form.action, {
        method: "POST",
        body: data,
        headers: { Accept: "application/json" },
      });

      if (res.ok) {
        form.reset();
        form.style.display = "none";
        success.hidden = false;
      } else {
        alert("Error while sending. Try again later.");
      }
    } catch (err) {
      alert("Network error. Please try again.");
    } finally {
      btn.disabled = false;
      btn.textContent = "Join Now";
    }
  });
});