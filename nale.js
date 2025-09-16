// Nale V3

// Firebase Cred
const _0x2f66b2 = _0x1e2c;
(function (_0x3e7458, _0x46cb2f) {
  const _0x4190f0 = _0x1e2c,
    _0x533866 = _0x3e7458();
  while (!![]) {
    try {
      const _0x30f9b7 =
        -parseInt(_0x4190f0(0x1a3)) / 0x1 +
        -parseInt(_0x4190f0(0x1a2)) / 0x2 +
        parseInt(_0x4190f0(0x19a)) / 0x3 +
        parseInt(_0x4190f0(0x199)) / 0x4 +
        (parseInt(_0x4190f0(0x19b)) / 0x5) *
          (parseInt(_0x4190f0(0x1a4)) / 0x6) +
        (-parseInt(_0x4190f0(0x198)) / 0x7) *
          (-parseInt(_0x4190f0(0x19f)) / 0x8) +
        (parseInt(_0x4190f0(0x1a1)) / 0x9) *
          (-parseInt(_0x4190f0(0x1a0)) / 0xa);
      if (_0x30f9b7 === _0x46cb2f) break;
      else _0x533866["push"](_0x533866["shift"]());
    } catch (_0x5991d9) {
      _0x533866["push"](_0x533866["shift"]());
    }
  }
})(_0x1eef, 0x959ba);
const firebaseConfig = {
  apiKey: _0x2f66b2(0x196),
  authDomain: _0x2f66b2(0x19e),
  databaseURL: _0x2f66b2(0x197),
  projectId: _0x2f66b2(0x1a5),
  storageBucket: _0x2f66b2(0x19d),
  messagingSenderId: _0x2f66b2(0x1a6),
  appId: _0x2f66b2(0x19c),
  measurementId: "G-9BQ5L3ZC16",
};
function _0x1e2c(_0x349c6d, _0x1937fe) {
  const _0x1eeff0 = _0x1eef();
  return (
    (_0x1e2c = function (_0x1e2cda, _0xff49d6) {
      _0x1e2cda = _0x1e2cda - 0x196;
      let _0x42a770 = _0x1eeff0[_0x1e2cda];
      return _0x42a770;
    }),
    _0x1e2c(_0x349c6d, _0x1937fe)
  );
}
fi;
function _0x1eef() {
  const _0x586292 = [
    "1593762OiuKxT",
    "803706CZLruW",
    "556734oxInqM",
    "nale-bc514",
    "577549937802",
    "AIzaSyD4lx6Je-fD-DdBYCm8NqNoo_ShE5qZdTs",
    "https://nale-bc514-default-rtdb.firebaseio.com",
    "7jUZPHa",
    "2680696RPVpQb",
    "2932920yuiJkS",
    "65cjkYpj",
    "1:577549937802:web:5008463f47f321fb139173",
    "nale-bc514.appspot.com",
    "nale-bc514.firebaseapp.com",
    "3076264bEpDgM",
    "16890tLQRla",
    "5463RLwnJG",
  ];
  _0x1eef = function () {
    return _0x586292;
  };
  return _0x1eef();
}
firebase.initializeApp(firebaseConfig);
const db = firebase.database();

// DOM
const body = document.body;
const shell = document.querySelector(".shell");
const splash = document.getElementById("splash");
const join = document.getElementById("join");
const nameInput = document.getElementById("nameInput");
const joinBtn = document.getElementById("joinBtn");
const logoutBtn = document.getElementById("logoutBtn");
const themeBtn = document.getElementById("themeBtn");

const userList = document.getElementById("userList");
const searchUsers = document.getElementById("searchUsers");
const messagesEl = document.getElementById("messages");
const inlineLoader = document.getElementById("inlineLoader");

const msgInput = document.getElementById("msgInput");
const sendBtn = document.getElementById("sendBtn");

const meAvatar = document.getElementById("meAvatar");
const meName = document.getElementById("meName");
const meTime = document.getElementById("meTime");

const peerAvatar = document.getElementById("peerAvatar");
const peerName = document.getElementById("peerName");
const peerStatus = document.getElementById("peerStatus");

// State
let currentName = localStorage.getItem("name") || "";
let selectedFilter = null; // selected username from left; null => all
const PARTICIPANTS = new Map(); // name -> lastTimestamp

// Helpers
function avatarFor(name) {
  const hues = [270, 200, 150, 120, 20, 330, 10, 60, 190];
  let h = 0;
  for (let i = 0; i < name.length; i++) {
    h = (h + name.charCodeAt(i)) % hues.length;
  }
  return `linear-gradient(135deg, hsl(${hues[h]} 70% 55%), hsl(${
    (hues[h] + 30) % 360
  } 70% 40%))`;
}
function timeNow() {
  return new Date().toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}
function formatTime(ts) {
  return new Date(ts).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function showShell() {
  shell.classList.add("ready");
  splash.style.display = "none";
}
function showJoin() {
  join.style.display = "grid";
}
function hideJoin() {
  join.style.display = "none";
}

function ensureLogin() {
  if (currentName) {
    meName.textContent = currentName;
    meAvatar.style.background = avatarFor(currentName);
    meTime.textContent = `Local time • ${timeNow()}`;
    hideJoin();
    return true;
  }
  showJoin();
  return false;
}

function renderUsers() {
  userList.innerHTML = "";
  const items = Array.from(PARTICIPANTS.entries()).sort((a, b) => b[1] - a[1]);
  items.forEach(([name, ts]) => {
    const li = document.createElement("li");
    li.className = "user" + (selectedFilter === name ? " active" : "");
    li.innerHTML = `<div class="avatar" style="background:${avatarFor(
      name
    )}"></div>
                    <div class="meta"><div class="title">${name}</div>
                    <div class="sub">${formatTime(ts)}</div></div>`;
    li.addEventListener("click", () => {
      selectedFilter = name;
      peerName.textContent = name;
      peerStatus.textContent = "Filtered messages";
      peerAvatar.style.background = avatarFor(name);
      renderUsers();
      refetchMessages(); // filter view
    });
    userList.appendChild(li);
  });
}

function messageNode(name, text, ts) {
  const el = document.createElement("div");
  el.className = "msg right"; // all to the right as requested
  el.innerHTML = `<div class="meta">${name} • ${formatTime(
    ts
  )}</div><div class="bubble"></div>`;
  el.querySelector(".bubble").textContent = text;
  return el;
}

function appendMessage(name, text, ts) {
  const node = messageNode(name, text, ts || Date.now());
  messagesEl.appendChild(node);
  messagesEl.scrollTo({ top: messagesEl.scrollHeight, behavior: "smooth" });
}

function clearMessages() {
  messagesEl.innerHTML =
    '<div id="inlineLoader" class="inline-loader"><div class="spinner"></div></div>';
}

function refetchMessages() {
  clearMessages();
  const ref = db.ref("chats").limitToLast(300);
  ref.off(); // remove old
  ref.on("value", (snap) => {
    messagesEl.innerHTML = "";
    const data = snap.val() || {};
    const rows = Object.values(data).sort(
      (a, b) => (a.timestamp || 0) - (b.timestamp || 0)
    );
    rows.forEach((row) => {
      const { name, message, timestamp } = row;
      if (!name || typeof message !== "string") return;
      // filter if a user is selected
      if (selectedFilter && name !== selectedFilter) return;
      appendMessage(name, message, timestamp);
      PARTICIPANTS.set(name, timestamp || Date.now());
    });
    renderUsers();
    peerName.textContent = selectedFilter || "Global Feed";
    peerStatus.textContent = selectedFilter
      ? "Filtered messages"
      : "All messages";
    peerAvatar.style.background = selectedFilter
      ? avatarFor(selectedFilter)
      : "linear-gradient(135deg,#333,#111)";
  });
}

// Events
nameInput.addEventListener(
  "input",
  () => (joinBtn.disabled = nameInput.value.trim().length === 0)
);
joinBtn.addEventListener("click", () => {
  currentName = nameInput.value.trim();
  if (!currentName) return;
  localStorage.setItem("name", currentName);
  ensureLogin();
  refetchMessages();
});
logoutBtn.addEventListener("click", () => {
  localStorage.removeItem("name");
  location.reload();
});
themeBtn.addEventListener("click", () => {
  body.classList.toggle("theme-light");
  body.classList.toggle("theme-dark");
});

msgInput.addEventListener("input", () => {
  sendBtn.disabled = msgInput.value.trim().length === 0;
});
msgInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && !sendBtn.disabled) {
    e.preventDefault();
    sendMessage();
  }
});
sendBtn.addEventListener("click", sendMessage);

function sendMessage() {
  if (!ensureLogin()) return;
  const text = msgInput.value.trim();
  if (!text) return;
  msgInput.value = "";
  sendBtn.disabled = true;
  const payload = {
    name: currentName,
    message: text,
    timestamp: firebase.database.ServerValue.TIMESTAMP,
  };
  db.ref("chats").push(payload);
}

// Realtime listeners: listen for new messages to update participants/live feed quickly
function startRealtimeLight() {
  const ref = db.ref("chats").limitToLast(1);
  ref.on("child_added", (snap) => {
    const { name, message, timestamp } = snap.val() || {};
    if (!name || typeof message !== "string") return;
    PARTICIPANTS.set(name, timestamp || Date.now());
    renderUsers();
    // if not filtered or matches filter, append
    if (!selectedFilter || selectedFilter === name) {
      appendMessage(name, message, timestamp);
    }
  });
}

// Boot
document.addEventListener("DOMContentLoaded", () => {
  // splash -> shell
  setTimeout(() => {
    showShell();
    if (ensureLogin()) {
      refetchMessages();
    }
    startRealtimeLight();
    // update clock on right pane
    setInterval(
      () => (meTime.textContent = `Local time • ${timeNow()}`),
      30_000
    );
  }, 900);
});
