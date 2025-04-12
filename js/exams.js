function toggleResources(button) {
    const content = button.nextElementSibling;
    content.style.display = content.style.display === "block" ? "none" : "block";
    button.textContent = content.style.display === "block" ? "Hide Resources" : "Show Resources";
  }
  
  function filterExams(category) {
    document.querySelectorAll(".filter-buttons button").forEach(btn => btn.classList.remove("active"));
    event.target.classList.add("active");
  
    const cards = document.querySelectorAll(".exam-card");
    cards.forEach(card => {
      if (category === "all" || card.dataset.category === category) {
        card.style.display = "block";
      } else {
        card.style.display = "none";
      }
    });
  }