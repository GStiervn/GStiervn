const SUPABASE_URL =
  "https://sibttxgvndumphuryxwc.supabase.co";

const SUPABASE_KEY =
  "sb_publishable_5TyrZwFYdY-AgykyuopXpA_GGKNZ4O8";

const supabaseClient =
  window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
  );

// ===============================
// CONFIG
// ===============================

const TIER_POINTS = {
  HT1: 100,
  LT1: 90,
  HT2: 80,
  LT2: 70,
  HT3: 60,
  LT3: 50,
  HT4: 40,
  LT4: 30,
  HT5: 20,
  LT5: 10
};

let players = [];
let isAdmin = false;
let currentUser = null;
let editingPlayerId = null;

// ===============================
// LOAD PLAYERS
// ===============================

async function loadPlayers() {
  const { data, error } = await supabaseClient
    .from("players")
    .select("*")
    .order("name", { ascending: true });

  if (error) {
    console.error(error);
    alert("Không thể tải danh sách player.");
    return;
  }

  players = data || [];
  renderPlayers();
}

// ===============================
// CALCULATE POINTS
// ===============================

function calculatePoints(player) {
  const modes = [
    player.sword,
    player.cpvp,
    player.uhc,
    player.mace,
    player.netherpot,
    player.smp,
    player.axe
  ];

  return modes.reduce((total, tier) => {
    return total + (TIER_POINTS[tier] || 0);
  }, 0);
}

// ===============================
// GET OVERALL TIER
// ===============================

function getOverallTier(points) {
  if (points >= 650) return "HT1";
  if (points >= 590) return "LT1";
  if (points >= 520) return "HT2";
  if (points >= 450) return "LT2";
  if (points >= 380) return "HT3";
  if (points >= 310) return "LT3";
  if (points >= 240) return "HT4";
  if (points >= 170) return "LT4";
  if (points >= 100) return "HT5";
  return "LT5";
}

// ===============================
// RENDER PLAYERS
// ===============================

function renderPlayers() {
  const container = document.getElementById("rankingList");

  if (!container) return;

  const search =
    document.getElementById("searchInput")?.value
      .toLowerCase()
      .trim() || "";

  const mode =
    document.getElementById("modeFilter")?.value || "all";

  const sort =
    document.getElementById("sortFilter")?.value || "points";

  let filtered = [...players];

  if (search) {
    filtered = filtered.filter(player =>
      player.name.toLowerCase().includes(search)
    );
  }

  if (mode !== "all") {
    filtered = filtered.filter(player => {
      return player[mode];
    });
  }

  filtered.sort((a, b) => {
    if (sort === "name") {
      return a.name.localeCompare(b.name);
    }

    return calculatePoints(b) - calculatePoints(a);
  });

  container.innerHTML = "";

  if (filtered.length === 0) {
    container.innerHTML =
      `<div class="empty">Không tìm thấy player.</div>`;
    return;
  }

  filtered.forEach((player, index) => {
    const points = calculatePoints(player);
    const overall = getOverallTier(points);

    const avatar =
      player.avatar_url ||
      "https://via.placeholder.com/80?text=MC";

    const card = document.createElement("div");

    card.className = "player-card";

    card.innerHTML = `
      <div class="rank-number">
        #${index + 1}
      </div>

      <img
        class="player-avatar"
        src="${avatar}"
        alt="${escapeHTML(player.name)}"
      >

      <div class="player-info">
        <h3>${escapeHTML(player.name)}</h3>

        <span class="region">
          ${escapeHTML(player.region || "VN")}
        </span>

        <div class="overall-tier">
          ${overall}
        </div>

        <div class="points">
          ${points} điểm
        </div>
      </div>
    `;

    card.onclick = () => openProfile(player);

    container.appendChild(card);
  });
}

// ===============================
// PROFILE
// ===============================

function openProfile(player) {
  const modal =
    document.getElementById("profileModal");

  const content =
    document.getElementById("profileContent");

  if (!modal || !content) return;

  const points = calculatePoints(player);
  const overall = getOverallTier(points);

  content.innerHTML = `
    <div class="profile-header">

      <img
        class="profile-avatar"
        src="${player.avatar_url || "https://via.placeholder.com/120"}"
      >

      <div>
        <h2>${escapeHTML(player.name)}</h2>

        <p>
          ${escapeHTML(player.region || "VN")}
        </p>

        <strong>
          ${overall} — ${points} điểm
        </strong>
      </div>

    </div>

    <div class="profile-modes">

      ${modeTier("Sword", player.sword)}
      ${modeTier("CPvP", player.cpvp)}
      ${modeTier("UHC", player.uhc)}
      ${modeTier("Mace", player.mace)}
      ${modeTier("NetherPot", player.netherpot)}
      ${modeTier("SMP", player.smp)}
      ${modeTier("Axe", player.axe)}

    </div>

    ${
      player.skin_url
        ? `
          <div class="skin-preview">
            <h3>Skin</h3>
            <img src="${player.skin_url}">
          </div>
        `
        : ""
    }
  `;

  modal.classList.add("show");
}

function modeTier(name, tier) {
  return `
    <div class="mode-row">
      <span>${name}</span>
      <strong>${tier || "LT5"}</strong>
    </div>
  `;
}

function closeProfile() {
  const modal =
    document.getElementById("profileModal");

  if (modal) {
    modal.classList.remove("show");
  }
}

// ===============================
// AUTH
// ===============================

async function login() {
  const email =
    document.getElementById("loginEmail")?.value.trim();

  const password =
    document.getElementById("loginPassword")?.value;

  if (!email || !password) {
    alert("Nhập email và mật khẩu.");
    return;
  }

  const { data, error } =
    await supabaseClient.auth.signInWithPassword({
      email,
      password
    });

  if (error) {
    alert("Đăng nhập thất bại: " + error.message);
    return;
  }

  currentUser = data.user;

  await checkAdmin();

  if (isAdmin) {
    alert("Đăng nhập Admin thành công!");
    openAdmin();
  } else {
    alert("Tài khoản này không phải Admin.");
  }
}

// ===============================
// CHECK ADMIN
// ===============================

async function checkAdmin() {
  if (!currentUser) {
    isAdmin = false;
    return;
  }

  const { data, error } =
    await supabaseClient
      .from("admin_users")
      .select("user_id")
      .eq("user_id", currentUser.id)
      .maybeSingle();

  if (error) {
    console.error(error);
    isAdmin = false;
    return;
  }

  isAdmin = !!data;
}

// ===============================
// LOGOUT
// ===============================

async function logout() {
  await supabaseClient.auth.signOut();

  currentUser = null;
  isAdmin = false;

  location.reload();
}

// ===============================
// OPEN ADMIN
// ===============================

function openAdmin() {
  if (!isAdmin) {
    alert("Bạn không có quyền Admin.");
    return;
  }

  const page =
    document.getElementById("adminPage");

  const ranking =
    document.getElementById("rankingPage");

  if (page) page.style.display = "block";
  if (ranking) ranking.style.display = "none";

  renderAdminPlayers();
}

// ===============================
// CLOSE ADMIN
// ===============================

function goHome() {
  const page =
    document.getElementById("adminPage");

  const ranking =
    document.getElementById("rankingPage");

  if (page) page.style.display = "none";
  if (ranking) ranking.style.display = "block";

  renderPlayers();
}

// ===============================
// RENDER ADMIN
// ===============================

function renderAdminPlayers() {
  const container =
    document.getElementById("adminPlayers");

  if (!container) return;

  container.innerHTML = "";

  players.forEach(player => {
    const div = document.createElement("div");

    div.className = "admin-player";

    div.innerHTML = `
      <img
        src="${player.avatar_url || "https://via.placeholder.com/50"}"
      >

      <span>
        ${escapeHTML(player.name)}
      </span>

      <button onclick="editPlayer('${player.id}')">
        Sửa
      </button>

      <button onclick="deletePlayer('${player.id}')">
        Xóa
      </button>
    `;

    container.appendChild(div);
  });
}

// ===============================
// EDIT PLAYER
// ===============================

function editPlayer(id) {
  const player =
    players.find(p => p.id === id);

  if (!player) return;

  editingPlayerId = id;

  document.getElementById("playerName").value =
    player.name || "";

  document.getElementById("playerRegion").value =
    player.region || "VN";

  document.getElementById("swordTier").value =
    player.sword || "LT5";

  document.getElementById("cpvpTier").value =
    player.cpvp || "LT5";

  document.getElementById("uhcTier").value =
    player.uhc || "LT5";

  document.getElementById("maceTier").value =
    player.mace || "LT5";

  document.getElementById("netherpotTier").value =
    player.netherpot || "LT5";

  document.getElementById("smpTier").value =
    player.smp || "LT5";

  document.getElementById("axeTier").value =
    player.axe || "LT5";

  document.getElementById("playerAvatarUrl").value =
    player.avatar_url || "";

  document.getElementById("playerSkinUrl").value =
    player.skin_url || "";

  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
}

// ===============================
// RESET FORM
// ===============================

function resetForm() {
  editingPlayerId = null;

  const form =
    document.getElementById("playerForm");

  if (form) form.reset();

  document.getElementById("playerRegion").value =
    "VN";

  document.getElementById("swordTier").value =
    "LT5";

  document.getElementById("cpvpTier").value =
    "LT5";

  document.getElementById("uhcTier").value =
    "LT5";

  document.getElementById("maceTier").value =
    "LT5";

  document.getElementById("netherpotTier").value =
    "LT5";

  document.getElementById("smpTier").value =
    "LT5";

  document.getElementById("axeTier").value =
    "LT5";
}

// ===============================
// UPLOAD IMAGE
// ===============================

async function uploadImage(file, bucket, folder) {
  if (!file) return null;

  if (file.size > 5 * 1024 * 1024) {
    throw new Error("Ảnh không được lớn hơn 5MB.");
  }

  const extension =
    file.name.split(".").pop().toLowerCase();

  const path =
    `${folder}/${crypto.randomUUID()}.${extension}`;

  const { error } =
    await supabaseClient.storage
      .from(bucket)
      .upload(path, file, {
        upsert: false,
        contentType: file.type,
        cacheControl: "3600"
      });

  if (error) {
    throw error;
  }

  const { data } =
    supabaseClient.storage
      .from(bucket)
      .getPublicUrl(path);

  return data.publicUrl;
}

// ===============================
// SAVE PLAYER
// ===============================

async function savePlayer(event) {
  event.preventDefault();

  if (!isAdmin) {
    alert("Bạn không có quyền Admin.");
    return;
  }

  const name =
    document.getElementById("playerName").value.trim();

  const region =
    document.getElementById("playerRegion").value.trim();

  if (!name) {
    alert("Nhập tên player.");
    return;
  }

  try {
    let avatarUrl =
      document.getElementById("playerAvatarUrl").value.trim();

    let skinUrl =
      document.getElementById("playerSkinUrl").value.trim();

    const avatarFile =
      document.getElementById("playerAvatarFile")?.files[0];

    const skinFile =
      document.getElementById("playerSkinFile")?.files[0];

    if (avatarFile) {
      if (
        !["image/png", "image/jpeg", "image/webp"]
          .includes(avatarFile.type)
      ) {
        alert("Avatar chỉ nhận PNG, JPG hoặc WEBP.");
        return;
      }

      avatarUrl =
        await uploadImage(
          avatarFile,
          "gstier-avatars",
          "avatars"
        );
    }

    if (skinFile) {
      if (skinFile.type !== "image/png") {
        alert("Skin phải là PNG.");
        return;
      }

      skinUrl =
        await uploadImage(
          skinFile,
          "gstier-skins",
          "skins"
        );
    }

    const playerData = {
      name,
      region,
      avatar_url: avatarUrl || null,
      skin_url: skinUrl || null,

      sword:
        document.getElementById("swordTier").value,

      cpvp:
        document.getElementById("cpvpTier").value,

      uhc:
        document.getElementById("uhcTier").value,

      mace:
        document.getElementById("maceTier").value,

      netherpot:
        document.getElementById("netherpotTier").value,

      smp:
        document.getElementById("smpTier").value,

      axe:
        document.getElementById("axeTier").value
    };

    let result;

    if (editingPlayerId) {
      result =
        await supabaseClient
          .from("players")
          .update(playerData)
          .eq("id", editingPlayerId);
    } else {
      result =
        await supabaseClient
          .from("players")
          .insert(playerData);
    }

    if (result.error) {
      throw result.error;
    }

    alert(
      editingPlayerId
        ? "Đã sửa player!"
        : "Đã thêm player!"
    );

    resetForm();

    await loadPlayers();

    renderAdminPlayers();

  } catch (error) {
    console.error(error);
    alert(
      "Lỗi: " +
      (error.message || "Không xác định")
    );
  }
}

// ===============================
// DELETE PLAYER
// ===============================

async function deletePlayer(id) {
  if (!isAdmin) {
    alert("Bạn không có quyền Admin.");
    return;
  }

  const player =
    players.find(p => p.id === id);

  if (!player) return;

  const ok =
    confirm(
      `Bạn có chắc muốn xóa ${player.name}?`
    );

  if (!ok) return;

  const { error } =
    await supabaseClient
      .from("players")
      .delete()
      .eq("id", id);

  if (error) {
    alert("Xóa thất bại: " + error.message);
    return;
  }

  alert("Đã xóa player.");

  await loadPlayers();
  renderAdminPlayers();
}

// ===============================
// SEARCH / FILTER
// ===============================

document.addEventListener(
  "input",
  event => {
    if (event.target.id === "searchInput") {
      renderPlayers();
    }
  }
);

document.addEventListener(
  "change",
  event => {
    if (
      event.target.id === "modeFilter" ||
      event.target.id === "sortFilter"
    ) {
      renderPlayers();
    }
  }
);

// ===============================
// ESCAPE HTML
// ===============================

function escapeHTML(text) {
  return String(text)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

// ===============================
// SESSION
// ===============================

async function init() {
  const {
    data: {
      session
    }
  } = await supabaseClient.auth.getSession();

  if (session) {
    currentUser = session.user;
    await checkAdmin();
  }

  await loadPlayers();
}

supabaseClient.auth.onAuthStateChange(
  async (_event, session) => {
    currentUser =
      session?.user || null;

    await checkAdmin();
  }
);

init();
