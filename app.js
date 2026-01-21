const ADMIN_PASSWORD = "1234";

let currentIndex = 0;

// Extract YouTube video ID
function extractVideoID(url) {
  const regex = /(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/))([^&#?/]+)/;
  const match = url.match(regex);
  return match ? match[1] : url; // ako si samo ID
}

// ---------------- GOST ----------------
function submitSong() {
  const name = document.getElementById("name").value;
  const song = document.getElementById("songName").value;
  const youtubeLink = document.getElementById("youtubeLink").value;

  if (!name || !song || !youtubeLink) return alert("Ispuni sva polja!");

  const id = extractVideoID(youtubeLink);

  const list = JSON.parse(localStorage.getItem("playlist") || "[]");
  list.push({ name, song, videoId: id });
  localStorage.setItem("playlist", JSON.stringify(list));

  alert("Prijava poslano!");
  document.getElementById("name").value = "";
  document.getElementById("songName").value = "";
  document.getElementById("youtubeLink").value = "";
}

function adminLogin() {
  const pass = document.getElementById("adminPass").value;
  if (pass === ADMIN_PASSWORD) {
    window.location.href = "admin.html";
  } else alert("Pogrešna šifra");
}

// ---------------- ADMIN ----------------
function loadAdminList() {
  const ul = document.getElementById("playlist");
  if (!ul) return;

  ul.innerHTML = "";
  const list = JSON.parse(localStorage.getItem("playlist") || "[]");

  list.forEach((item, i) => {
    const li = document.createElement("li");
    li.innerHTML = `
      ${item.name} – ${item.song}
      <button onclick="removeSong(${i})">❌</button>
    `;
    ul.appendChild(li);
  });
}

function removeSong(i) {
  const list = JSON.parse(localStorage.getItem("playlist") || "[]");
  list.splice(i, 1);
  localStorage.setItem("playlist", JSON.stringify(list));
  loadAdminList();
}

function playCurrent() {
  const list = JSON.parse(localStorage.getItem("playlist") || "[]");
  if (!list[currentIndex]) return alert("Playlist je prazan.");

  const videoId = list[currentIndex].videoId;
  document.getElementById("player").innerHTML = `
    <iframe width="800" height="450" 
      src="https://www.youtube.com/embed/${videoId}?autoplay=1"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowfullscreen>
    </iframe>
  `;

  localStorage.setItem("current", JSON.stringify(list[currentIndex]));
  localStorage.setItem("next", JSON.stringify(list[currentIndex + 1] || null));
}

function openAudience() {
  window.open("audience.html", "_blank");
}

// ---------------- PUBLIKA ----------------
function loadAudience() {
  if (!document.getElementById("audiencePlayer")) return;

  const now = JSON.parse(localStorage.getItem("current"));
  const next = JSON.parse(localStorage.getItem("next"));

  if (now) {
    document.getElementById("now").innerText = `🎤 Sada pjeva: ${now.name} – ${now.song}`;
    document.getElementById("audiencePlayer").innerHTML = `
      <iframe width="800" height="450"
        src="https://www.youtube.com/embed/${now.videoId}?autoplay=1"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowfullscreen>
      </iframe>
    `;
  }

  if (next) {
    document.getElementById("next").innerText = `⏭ Sljedeći: ${next.name} – ${next.song}`;
  }
}

window.onload = () => {
  loadAdminList();
  loadAudience();
};


