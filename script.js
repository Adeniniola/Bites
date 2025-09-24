// Load movies.json and display them
fetch("movies.json")
  .then(res => res.json())
  .then(movies => {
    const list = document.getElementById("movie-list");
    list.innerHTML = "";

    movies.forEach(movie => {
      const card = document.createElement("div");
      card.className = "movie-card";
      card.innerHTML = `
        <img src="${movie.poster}" alt="${movie.title}">
        <h3>${movie.title}</h3>
        <p>${movie.description}</p>
        <a href="/download/${movie.id}?name=${encodeURIComponent(movie.title)}.mp4">
          <button>Download</button>
        </a>
      `;
      list.appendChild(card);
    });
  })
  .catch(err => console.error("Error loading movies:", err));