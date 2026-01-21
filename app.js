const ADMIN_PASSWORD = "laltm123"
let currentIndex = 0;
let player;
let audiencePlayer;

// ---------------- GOST ----------------
function submitSong() {
  const name = guestName.value;
  const song = songName.value;

  if (!name || !song) return alert("Ispuni sva polja!");

  const list = JSON.parse(localStorage.getItem("playlist") || "[]");
  list.push({ name, song });
  localStorage.setItem("playlist", JSON.stringify(list));

  alert("Prijava zaprimljena!");
  guestName.value = "";
  songName.value = "";
}

// ---------------- ADMIN ----------------
function adminLogin() {
  if (adminPass.value === ADMIN_PASSWORD) {
    window.location.href = "admin.html";
  } else alert("Pogrešna šifra");
}

function loadAdminList() {
  const ul = document.getElementById("playlist");
  if (!ul) return;

  ul.innerHTML = "";
  const list = JSON.parse(localStorage.getItem("playlist") || "[]");

  list.forEach((item, i) => {
    const li = document.createElement("li");
    li.innerHTML = `${item.name} – ${item.song}
    <button onclick="removeSong(${i})">❌</button>`;
    ul.appendChild(li);
  });
}

function removeSong(i) {
  const list = JSON.parse(localStorage.getItem("playlist"));
  list.splice(i, 1);
  localStorage.setItem("playlist", JSON.stringify(list));
  loadAdminList();
}

function startPlaylist() {
  currentIndex = 0;
  playCurrent();
}

function playCurrent() {
  const list = JSON.parse(localStorage.getItem("playlist"));
  if (!list[currentIndex]) return alert("Playlist prazna!");

  const query = list[currentIndex].song + " karaoke instrumental";

  fetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(query)}&type=video&maxResults=1&key=key=AIzaSyBMNIx8X3XmR_gMrTIrX-0NL5NQSDEPDKU
`)
    .then(res => res.json())
    .then(data => {
      const videoId = data.items[0].id.videoId;
      loadVideo(videoId);
      localStorage.setItem("current", JSON.stringify(list[currentIndex]));
      localStorage.setItem("next", JSON.stringify(list[currentIndex + 1] || null));
    });
}

function loadVideo(videoId) {
  if (player) player.destroy();
  player = new YT.Player('player', {
    videoId,
    playerVars: { autoplay: 1 },
    events: {
      onStateChange: e => {
        if (e.data === YT.PlayerState.ENDED) {
          currentIndex++;
          playCurrent();
        }
      }
    }
  });
}

function openAudience() {
  window.open("audience.html", "_blank");
}

// ---------------- PUBLIKA ----------------
function loadAudience() {
  if (!document.getElementById("audiencePlayer")) return;

  setInterval(() => {
    const now = JSON.parse(localStorage.getItem("current"));
    const next = JSON.parse(localStorage.getItem("next"));

    if (!now) return;

    document.getElementById("now").innerText =
      "🎤 Sada pjeva: " + now.name + " – " + now.song;

    document.getElementById("next").innerText =
      next ? "⏭ Sljedeći: " + next.name : "";

  }, 1000);
}

// ---------------- INIT ----------------
window.onload = () => {
  loadAdminList();
  loadAudience();
};
