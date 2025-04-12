const API_KEY = '71a0ddfa6202036de6c1bca59f552b83'; // 🔁 Replace this with your actual GNews API key
const BASE_URL = 'https://gnews.io/api/v4/top-headlines';

const newsContainer = document.getElementById("news-container");
const tabButtons = document.querySelectorAll(".tab-btn");
const searchInput = document.getElementById("news-search");

let currentCategory = "global";

function getQuery(category) {
  switch (category) {
    case "global":
      return "world";
    case "local":
      return "india";
    case "upsc":
      return "UPSC OR IAS OR polity OR economy OR governance OR civil services";
    default:
      return "education";
  }
}

async function fetchNews(category) {
  const query = getQuery(category);
  const url = `${BASE_URL}?q=${encodeURIComponent(query)}&lang=en&country=in&token=${API_KEY}`;

  try {
    const res = await fetch(url);
    const data = await res.json();

    renderNews(data.articles);
  } catch (err) {
    console.error("Error fetching news:", err);
    newsContainer.innerHTML = `<p style="padding: 2rem;">Failed to load news. Please try again later.</p>`;
  }
}

function renderNews(articles) {
  newsContainer.innerHTML = "";

  articles.forEach(news => {
    const card = document.createElement("article");
    card.className = "news-article";
    card.innerHTML = `
      <h2>${news.title}</h2>
      <p>${news.description || "Click below to read the full article."}</p>
      <a href="${news.url}" target="_blank">Read More</a>
    `;
    newsContainer.appendChild(card);
  });
}

tabButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    tabButtons.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    currentCategory = btn.dataset.category;
    fetchNews(currentCategory);
  });
});

searchInput.addEventListener("input", () => {
  const cards = document.querySelectorAll(".news-article");
  const query = searchInput.value.toLowerCase();

  cards.forEach(card => {
    const text = card.innerText.toLowerCase();
    card.style.display = text.includes(query) ? "block" : "none";
  });
});

fetchNews(currentCategory);