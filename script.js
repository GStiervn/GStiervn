/* =========================================================
   GSTIER VN
   SUPABASE + RANKING + ADMIN + AVATAR/SKIN UPLOAD
========================================================= */


/* =========================
   SUPABASE CONFIG
========================= */

const SUPABASE_URL =
  "https://sibttxgvndumphuryxwc.supabase.co";

const SUPABASE_PUBLISHABLE_KEY =
  "sb_publishable_5TyrZwFYdY-AgykyuopXpA_GGKNZ4O8";

const STORAGE_BUCKET =
  "gstier-images";


/* =========================
   SUPABASE CLIENT
========================= */

let supabaseClient = null;

if (window.supabase) {

  supabaseClient = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_PUBLISHABLE_KEY
  );

} else {

  console.error(
    "Supabase JS chưa được tải."
  );

}


/* =========================
   CONSTANTS
========================= */

const TIER_POINTS = {

  LT5: 10,
  HT5: 20,

  LT4: 30,
  HT4: 40,

  LT3: 50,
  HT3: 60,

  LT2: 70,
  HT2: 80,

  LT1: 90,
  HT1: 100

};


const MODES = [

  {
    key: "sword_tier",
    name: "⚔️ Sword"
  },

  {
    key: "cpvp_tier",
    name: "💥 CPvP"
  },

  {
    key: "uhc_tier",
    name: "❤️ UHC"
  },

  {
    key: "mace_tier",
    name: "🔨 Mace"
  },

  {
    key: "netherpot_tier",
    name: "🧪 NetherPot"
  },

  {
    key: "smp_tier",
    name: "🌍 SMP"
  },

  {
    key: "axe_tier",
    name: "🪓 Axe"
  }

];


const MAX_AVATAR_SIZE =
  5 * 1024 * 1024;

const MAX_SKIN_SIZE =
  2 * 1024 * 1024;


/* =========================
   GLOBAL STATE
========================= */

let players = [];

let currentUser = null;

let isAdmin = false;


/* =========================
   ELEMENT HELPERS
========================= */

function $(id) {
  return document.getElementById(id);
}


/* =========================
   INITIALIZATION
========================= */

document.addEventListener(
  "DOMContentLoaded",
  async () => {

    setupEvents();

    await initializeAuth();

    await loadPlayers();

  }
);


/* =========================
   EVENTS
========================= */

function setupEvents() {

  const playerForm =
    $("playerForm");

  if (playerForm) {

    playerForm.addEventListener(
      "submit",
      savePlayer
    );

  }


  const loginForm =
    $("loginForm");

  if (loginForm) {

    loginForm.addEventListener(
      "submit",
      loginAdmin
    );

  }

}


/* =========================
   AUTH INITIALIZATION
========================= */

async function initializeAuth() {

  if (!supabaseClient) {

    showLoginMessage(
      "Supabase chưa tải được.",
      true
    );

    return;

  }


  const {
    data,
    error
  } = await supabaseClient.auth.getSession();


  if (error) {

    console.error(error);

    return;

  }


  if (data.session) {

    currentUser =
      data.session.user;

    await checkAdmin();

  }


  supabaseClient.auth.onAuthStateChange(
    async (event, session) => {

      if (session) {

        currentUser =
          session.user;

        await checkAdmin();

      } else {

        currentUser = null;
        isAdmin = false;

        updateAdminUI();

      }

    }
  );

}


/* =========================
   CHECK ADMIN
========================= */

async function checkAdmin() {

  if (!currentUser) {

    isAdmin = false;

    updateAdminUI();

    return false;

  }


  const {
    data,
    error
  } = await supabaseClient
    .from("admin_users")
    .select("user_id")
    .eq("user_id", currentUser.id)
    .maybeSingle();


  if (error) {

    console.error(
      "Admin check error:",
      error
    );

    isAdmin = false;

    updateAdminUI();

    return false;

  }


  isAdmin =
    !!data;


  updateAdminUI();


  if (!isAdmin) {

    console.warn(
      "Tài khoản này không có quyền Admin."
    );

  }


  return isAdmin;

}


/* =========================
   UPDATE ADMIN UI
========================= */

function updateAdminUI() {

  const loginButton =
    $("loginButton");

  const logoutButton =
    $("logoutButton");


  document
    .querySelectorAll(".admin-only")
    .forEach(el => {

      el.classList.toggle(
        "hidden",
        !isAdmin
      );

    });


  if (loginButton) {

    loginButton.classList.toggle(
      "hidden",
      !!isAdmin
    );

  }


  if (logoutButton) {

    logoutButton.classList.toggle(
      "hidden",
      !isAdmin
    );

  }

}


/* =========================
   LOGIN
========================= */

function openLogin() {

  const modal =
    $("loginModal");

  if (!modal) return;

  modal.classList.remove(
    "hidden"
  );

  setTimeout(() => {

    $("loginEmail")?.focus();

  }, 50);

}


function closeLogin() {

  $("loginModal")
    ?.classList.add(
      "hidden"
    );

}


async function loginAdmin(event) {

  event.preventDefault();


  if (!supabaseClient) {

    showLoginMessage(
      "Supabase chưa sẵn sàng.",
      true
    );

    return;

  }


  const email =
    $("loginEmail")
      .value
      .trim();


  const password =
    $("loginPassword")
      .value;


  if (!email || !password) {

    showLoginMessage(
      "Nhập đầy đủ email và mật khẩu.",
      true
    );

    return;

  }


  showLoginMessage(
    "Đang đăng nhập..."
  );


  const {
    data,
    error
  } =
    await supabaseClient.auth.signInWithPassword({
      email,
      password
    });


  if (error) {

    console.error(error);

    showLoginMessage(
      "Đăng nhập thất bại: " +
      error.message,
      true
    );

    return;

  }


  currentUser =
    data.user;


  const adminResult =
    await checkAdmin();


  if (!adminResult) {

    await supabaseClient.auth.signOut();

    currentUser = null;
    isAdmin = false;

    showLoginMessage(
      "Tài khoản đăng nhập được nhưng chưa có quyền Admin.",
      true
    );

    return;

  }


  showLoginMessage(
    "Đăng nhập thành công!"
  );


  $("loginPassword").value = "";


  setTimeout(() => {

    closeLogin();

    goAdmin();

  }, 400);

}


/* =========================
   LOGOUT
========================= */

async function logoutAdmin() {

  if (!supabaseClient) return;


  await supabaseClient.auth.signOut();


  currentUser = null;
  isAdmin = false;


  goHome();

}


/* =========================
   LOAD PLAYERS
========================= */

async function loadPlayers() {

  const list =
    $("rankingList");


  if (!list) return;


  list.innerHTML = `
    <div class="loading">
      Đang tải Ranking...
    </div>
  `;


  if (!supabaseClient) {

    list.innerHTML = `
      <div class="empty">
        Supabase chưa được kết nối.
      </div>
    `;

    return;

  }


  const {
    data,
    error
  } = await supabaseClient
    .from("players")
    .select("*");


  if (error) {

    console.error(
      "Load players error:",
      error
    );


    list.innerHTML = `
      <div class="empty">
        Không tải được Ranking.<br><br>
        <small>
          ${escapeHtml(error.message)}
        </small>
      </div>
    `;

    return;

  }


  players =
    Array.isArray(data)
      ? data
      : [];


  renderRanking();

  renderAdminPlayers();

}


/* =========================
   CALCULATE POINTS
========================= */

function getPlayerTotal(player) {

  let total = 0;


  MODES.forEach(mode => {

    const tier =
      player[mode.key];


    if (
      tier &&
      TIER_POINTS[tier]
    ) {

      total +=
        TIER_POINTS[tier];

    }

  });


  return total;

}


/* =========================
   SORT PLAYERS
========================= */

function getSortedPlayers() {

  const search =
    ($("searchInput")?.value || "")
      .trim()
      .toLowerCase();


  const mode =
    $("modeFilter")?.value ||
    "ALL";


  const sort =
    $("sortFilter")?.value ||
    "points";


  let result =
    [...players];


  if (search) {

    result =
      result.filter(player => {

        return (
          String(player.name || "")
            .toLowerCase()
            .includes(search)
        );

      });

  }


  if (mode !== "ALL") {

    const modeMap = {

      Sword: "sword_tier",
      CPvP: "cpvp_tier",
      UHC: "uhc_tier",
      Mace: "mace_tier",
      NetherPot: "netherpot_tier",
      SMP: "smp_tier",
      Axe: "axe_tier"

    };


    const key =
      modeMap[mode];


    result =
      result.filter(player => {

        return !!player[key];

      });

  }


  if (sort === "name") {

    result.sort(
      (a, b) =>
        String(a.name || "")
          .localeCompare(
            String(b.name || "")
          )
    );

  } else {

    result.sort(
      (a, b) =>
        getPlayerTotal(b) -
        getPlayerTotal(a)
    );

  }


  return result.slice(
    0,
    500
  );

}


/* =========================
   RENDER RANKING
========================= */

function renderRanking() {

  const list =
    $("rankingList");


  if (!list) return;


  const result =
    getSortedPlayers();


  if (!result.length) {

    list.innerHTML = `
      <div class="empty">
        Không tìm thấy Player.
      </div>
    `;

    return;

  }


  list.innerHTML =
    result
      .map((player, index) => {

        const rank =
          index + 1;

        const total =
          getPlayerTotal(player);


        let rankClass = "";

        if (rank === 1)
          rankClass = "top1";

        if (rank === 2)
          rankClass = "top2";

        if (rank === 3)
          rankClass = "top3";


        const avatar =
          player.avatar_url ||
          createAvatarPlaceholder(
            player.name
          );


        return `

          <div
            class="ranking-row"
            onclick="openProfile('${escapeAttribute(player.id)}')"
          >

            <div class="rank-number ${rankClass}">
              ${rank}
            </div>


            <div class="player-cell">

              <img
                class="avatar"
                src="${escapeAttribute(avatar)}"
                alt=""
                onerror="this.src='${escapeAttribute(
                  createAvatarPlaceholder(
                    player.name
                  )
                )}'"
              >


              <div>

                <div class="player-name">
                  ${escapeHtml(
                    player.name || "Unknown"
                  )}
                </div>

                <div class="player-region">
                  ${escapeHtml(
                    player.region || "VN"
                  )}
                </div>

              </div>


              ${
                isAdmin
                  ? `
                    <div
                      class="admin-actions"
                      onclick="event.stopPropagation()"
                    >

                      <button
                        onclick="editPlayer('${escapeAttribute(player.id)}')"
                      >
                        ✏️
                      </button>

                      <button
                        onclick="deletePlayer('${escapeAttribute(player.id)}')"
                      >
                        🗑️
                      </button>

                    </div>
                  `
                  : ""
              }

            </div>


            <div class="total-points">
              ${total}
            </div>

          </div>

        `;

      })
      .join("");

}


/* =========================
   PROFILE
========================= */

function openProfile(id) {

  const player =
    players.find(
      p => String(p.id) === String(id)
    );


  if (!player) return;


  $("rankingPage")
    .classList.add("hidden");


  $("adminPage")
    .classList.add("hidden");


  $("profilePage")
    .classList.remove("hidden");


  const ranking =
    getPlayerRanking(player);


  const total =
    getPlayerTotal(player);


  const avatar =
    player.avatar_url ||
    createAvatarPlaceholder(
      player.name
    );


  let modesHtml = "";


  MODES.forEach(mode => {

    const tier =
      player[mode.key];


    const points =
      tier
        ? TIER_POINTS[tier] || 0
        : 0;


    modesHtml += `

      <div class="mode-card">

        <div class="mode-name">
          ${mode.name}
        </div>

        <div>

          <span class="mode-tier">
            ${tier || "—"}
          </span>

          <span class="mode-points">
            ${points}
          </span>

        </div>

      </div>

    `;

  });


  $("profileContent").innerHTML = `

    <div class="profile-card">

      <div class="profile-top">

        <img
          class="profile-avatar"
          src="${escapeAttribute(avatar)}"
          alt=""
          onerror="this.src='${escapeAttribute(
            createAvatarPlaceholder(
              player.name
            )
          )}'"
        >


        <div>

          <div class="small-title">
            PLAYER PROFILE
          </div>

          <div class="profile-name">
            ${escapeHtml(
              player.name || "Unknown"
            )}
          </div>

          <div class="profile-region">
            ${escapeHtml(
              player.region || "VN"
            )}
          </div>

          <div class="profile-rank">
            TOP #${ranking}
          </div>

          <div class="profile-total">
            ${total} POINTS
          </div>

        </div>

      </div>


      <div class="profile-body">

        <h2>
          GAME MODES
        </h2>


        <div class="profile-grid">
          ${modesHtml}
        </div>


        ${
          player.skin_url
            ? `
              <div class="skin-box">

                <h2>
                  MINECRAFT SKIN
                </h2>

                <img
                  src="${escapeAttribute(
                    player.skin_url
                  )}"
                  alt="Minecraft Skin"
                >

              </div>
            `
            : ""
        }


        <div class="skin-box">

          <h2>
            MATCH HISTORY
          </h2>

          <div
            id="matchHistory"
            class="loading"
          >
            Đang tải...
          </div>

        </div>

      </div>

    </div>

  `;


  loadMatchHistory(
    player.id
  );

}


/* =========================
   PLAYER RANK
========================= */

function getPlayerRanking(player) {

  const sorted =
    [...players].sort(
      (a, b) =>
        getPlayerTotal(b) -
        getPlayerTotal(a)
    );


  const index =
    sorted.findIndex(
      p =>
        String(p.id) ===
        String(player.id)
    );


  return index >= 0
    ? index + 1
    : "-";

}


/* =========================
   MATCH HISTORY
========================= */

async function loadMatchHistory(
  playerId
) {

  const container =
    $("matchHistory");


  if (!container) return;


  const {
    data,
    error
  } = await supabaseClient
    .from("match_history")
    .select("*")
    .or(
      `player_id.eq.${playerId},opponent_id.eq.${playerId}`
    )
    .order(
      "created_at",
      {
        ascending: false
      }
    )
    .limit(20);


  if (error) {

    container.innerHTML = `
      <div class="empty">
        Chưa có lịch sử trận đấu.
      </div>
    `;

    return;

  }


  if (!data || !data.length) {

    container.innerHTML = `
      <div class="empty">
        Chưa có lịch sử trận đấu.
      </div>
    `;

    return;

  }


  container.innerHTML =
    data
      .map(match => {

        return `

          <div class="mode-card">

            <div>

              <strong>
                ${escapeHtml(
                  match.result || "Match"
                )}
              </strong>

              <div class="player-region">
                ${escapeHtml(
                  match.mode || ""
                )}
              </div>

            </div>

          </div>

        `;

      })
      .join("");

}


/* =========================
   ADMIN PANEL
========================= */

function openAdminPanel() {

  if (!isAdmin) {

    openLogin();

    return;

  }


  goAdmin();

}


function goAdmin() {

  if (!isAdmin) {

    openLogin();

    return;

  }


  $("rankingPage")
    .classList.add("hidden");

  $("profilePage")
    .classList.add("hidden");

  $("adminPage")
    .classList.remove("hidden");


  renderAdminPlayers();

}


function renderAdminPlayers() {

  const container =
    $("adminPlayerList");


  if (!container) return;


  const count =
    $("adminPlayerCount");


  if (count) {

    count.textContent =
      `${players.length} Player`;

  }


  if (!players.length) {

    container.innerHTML = `
      <div class="empty">
        Chưa có Player.
      </div>
    `;

    return;

  }


  const sorted =
    [...players].sort(
      (a, b) =>
        getPlayerTotal(b) -
        getPlayerTotal(a)
    );


  container.innerHTML =
    sorted
      .map(player => {

        const avatar =
          player.avatar_url ||
          createAvatarPlaceholder(
            player.name
          );


        return `

          <div class="admin-player-row">

            <img
              class="avatar"
              src="${escapeAttribute(avatar)}"
              alt=""
            >


            <div class="admin-player-info">

              <strong>
                ${escapeHtml(
                  player.name
                )}
              </strong>

              <div class="player-region">
                ${getPlayerTotal(player)} điểm
              </div>

            </div>


            <div class="admin-player-actions">

              <button
                class="edit-btn"
                onclick="editPlayer('${escapeAttribute(player.id)}')"
              >
                ✏️ Sửa
              </button>

              <button
                class="delete-btn"
                onclick="deletePlayer('${escapeAttribute(player.id)}')"
              >
                🗑️ Xóa
              </button>

            </div>

          </div>

        `;

      })
      .join("");

}


/* =========================
   SAVE PLAYER
========================= */

async function savePlayer(event) {

  event.preventDefault();


  if (!isAdmin) {

    showFormMessage(
      "Bạn không có quyền Admin.",
      true
    );

    return;

  }


  const name =
    $("playerName")
      .value
      .trim();


  if (!name) {

    showFormMessage(
      "Nhập tên Player.",
      true
    );

    return;

  }


  const editingId =
    $("editingPlayerId")
      .value;


  const avatarFile =
    $("playerAvatarFile")
      ?.files?.[0] || null;


  const skinFile =
    $("playerSkinFile")
      ?.files?.[0] || null;


  try {

    showFormMessage(
      "Đang lưu Player..."
    );


    let avatarUrl =
      $("playerAvatarUrl")
        ?.value ||
      "";


    let skinUrl =
      $("playerSkinUrl")
        ?.value ||
      "";


    /* AVATAR */

    if (avatarFile) {

      validateImage(
        avatarFile,
        MAX_AVATAR_SIZE,
        false
      );


      avatarUrl =
        await uploadImage(
          avatarFile,
          "avatars"
        );

    }


    /* SKIN */

    if (skinFile) {

      validateImage(
        skinFile,
        MAX_SKIN_SIZE,
        true
      );


      skinUrl =
        await uploadImage(
          skinFile,
          "skins"
        );

    }


    const playerData = {

      name,

      region:
        $("playerRegion").value,

      avatar_url:
        avatarUrl || null,

      skin_url:
        skinUrl || null,

      sword_tier:
        getSelectValue("swordTier"),

      cpvp_tier:
        getSelectValue("cpvpTier"),

      uhc_tier:
        getSelectValue("uhcTier"),

      mace_tier:
        getSelectValue("maceTier"),

      netherpot_tier:
        getSelectValue("netherpotTier"),

      smp_tier:
        getSelectValue("smpTier"),

      axe_tier:
        getSelectValue("axeTier"),

      updated_at:
        new Date().toISOString()

    };


    let result;


    if (editingId) {

      result =
        await supabaseClient
          .from("players")
          .update(playerData)
          .eq("id", editingId);

    } else {

      result =
        await supabaseClient
          .from("players")
          .insert(playerData);

    }


    if (result.error) {

      throw result.error;

    }


    showFormMessage(
      "Lưu Player thành công!"
    );


    resetPlayerForm();


    await loadPlayers();


    goAdmin();


  } catch (error) {

    console.error(error);

    showFormMessage(
      error.message ||
      "Có lỗi khi lưu Player.",
      true
    );

  }

}


/* =========================
   UPLOAD IMAGE
========================= */

async function uploadImage(
  file,
  folder
) {

  if (!supabaseClient) {

    throw new Error(
      "Supabase chưa được kết nối."
    );

  }


  const extension =
    getFileExtension(
      file.name
    );


  const filename =
    crypto.randomUUID() +
    "." +
    extension;


  const path =
    `${folder}/${filename}`;


  const {
    error
  } =
    await supabaseClient
      .storage
      .from(STORAGE_BUCKET)
      .upload(
        path,
        file,
        {
          cacheControl: "3600",
          upsert: false,
          contentType:
            file.type
        }
      );


  if (error) {

    console.error(
      "Storage upload error:",
      error
    );

    throw new Error(
      "Upload ảnh thất bại: " +
      error.message
    );

  }


  const {
    data
  } =
    supabaseClient
      .storage
      .from(STORAGE_BUCKET)
      .getPublicUrl(path);


  if (!data?.publicUrl) {

    throw new Error(
      "Không lấy được URL ảnh."
    );

  }


  return data.publicUrl;

}


/* =========================
   VALIDATE IMAGE
========================= */

function validateImage(
  file,
  maxSize,
  skin
) {

  if (!file) return;


  if (!file.type.startsWith("image/")) {

    throw new Error(
      "File phải là ảnh."
    );

  }


  if (file.size > maxSize) {

    throw new Error(
      `File quá lớn. Giới hạn ${
        maxSize / 1024 / 1024
      }MB.`
    );

  }


  if (
    skin &&
    file.type !== "image/png"
  ) {

    throw new Error(
      "Minecraft Skin phải là file PNG."
    );

  }

}


/* =========================
   EDIT PLAYER
========================= */

function editPlayer(id) {

  if (!isAdmin) {

    openLogin();

    return;

  }


  const player =
    players.find(
      p =>
        String(p.id) ===
        String(id)
    );


  if (!player) return;


  $("editingPlayerId").value =
    player.id;


  $("formTitle").textContent =
    "SỬA PLAYER";


  $("playerName").value =
    player.name || "";


  $("playerRegion").value =
    player.region || "VN";


  $("playerAvatarUrl").value =
    player.avatar_url || "";


  $("playerSkinUrl").value =
    player.skin_url || "";


  setSelectValue(
    "swordTier",
    player.sword_tier
  );

  setSelectValue(
    "cpvpTier",
    player.cpvp_tier
  );

  setSelectValue(
    "uhcTier",
    player.uhc_tier
  );

  setSelectValue(
    "maceTier",
    player.mace_tier
  );

  setSelectValue(
    "netherpotTier",
    player.netherpot_tier
  );

  setSelectValue(
    "smpTier",
    player.smp_tier
  );

  setSelectValue(
    "axeTier",
    player.axe_tier
  );


  $("playerAvatarFile").value = "";

  $("playerSkinFile").value = "";


  $("adminPage")
    .scrollIntoView({
      behavior: "smooth"
    });

}


/* =========================
   DELETE PLAYER
========================= */

async function deletePlayer(id) {

  if (!isAdmin) {

    openLogin();

    return;

  }


  const player =
    players.find(
      p =>
        String(p.id) ===
        String(id)
    );


  if (!player) return;


  const confirmed =
    confirm(
      `Xóa Player "${player.name}"?`
    );


  if (!confirmed) return;


  const {
    error
  } =
    await supabaseClient
      .from("players")
      .delete()
      .eq("id", id);


  if (error) {

    alert(
      "Không thể xóa: " +
      error.message
    );

    return;

  }


  await loadPlayers();

}


/* =========================
   RESET FORM
========================= */

function resetPlayerForm() {

  $("playerForm")
    ?.reset();


  $("editingPlayerId").value =
    "";


  $("playerAvatarUrl").value =
    "";


  $("playerSkinUrl").value =
    "";


  $("formTitle").textContent =
    "THÊM PLAYER";


  showFormMessage("");

}


/* =========================
   NAVIGATION
========================= */

function goHome() {

  $("rankingPage")
    .classList.remove("hidden");


  $("profilePage")
    .classList.add("hidden");


  $("adminPage")
    .classList.add("hidden");


  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });


  renderRanking();

}


function openLogin() {

  $("loginModal")
    ?.classList.remove(
      "hidden"
    );

}


function closeLogin() {

  $("loginModal")
    ?.classList.add(
      "hidden"
    );

}


/* =========================
   SELECT HELPERS
========================= */

function getSelectValue(id) {

  const element =
    $(id);


  if (!element) return null;


  return element.value || null;

}


function setSelectValue(
  id,
  value
) {

  const element =
    $(id);


  if (!element) return;


  element.value =
    value || "";

}


/* =========================
   MESSAGES
========================= */

function showFormMessage(
  message,
  error = false
) {

  const element =
    $("formMessage");


  if (!element) return;


  element.textContent =
    message || "";


  element.className =
    "form-message";


  if (message) {

    element.classList.add(
      error
        ? "error"
        : "success"
    );

  }

}


function showLoginMessage(
  message,
  error = false
) {

  const element =
    $("loginMessage");


  if (!element) return;


  element.textContent =
    message || "";


  element.className =
    "form-message";


  if (message) {

    element.classList.add(
      error
        ? "error"
        : "success"
    );

  }

}


/* =========================
   PLACEHOLDER AVATAR
========================= */

function createAvatarPlaceholder(
  name
) {

  const letter =
    String(name || "?")
      .charAt(0)
      .toUpperCase();


  const svg = `
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="100"
      height="100"
    >

      <rect
        width="100"
        height="100"
        rx="15"
        fill="#151515"
      />

      <text
        x="50"
        y="62"
        text-anchor="middle"
        font-size="45"
        font-family="Arial"
        font-weight="bold"
        fill="#ff2424"
      >
        ${letter}
      </text>

    </svg>
  `;


  return (
    "data:image/svg+xml;charset=UTF-8," +
    encodeURIComponent(svg)
  );

}


/* =========================
   FILE HELPERS
========================= */

function getFileExtension(
  filename
) {

  const parts =
    filename.split(".");


  return (
    parts.length > 1
      ? parts.pop()
      : "png"
  )
    .toLowerCase()
    .replace(
      /[^a-z0-9]/g,
      ""
    );

}


/* =========================
   ESCAPE HTML
========================= */

function escapeHtml(
  value
) {

  return String(value ?? "")
    .replace(
      /&/g,
      "&amp;"
    )
    .replace(
      /</g,
      "&lt;"
    )
    .replace(
      />/g,
      "&gt;"
    )
    .replace(
      /"/g,
      "&quot;"
    )
    .replace(
      /'/g,
      "&#039;"
    );

}


function escapeAttribute(
  value
) {

  return escapeHtml(
    value
  );

}


/* =========================
   KEYBOARD
========================= */

document.addEventListener(
  "keydown",
  event => {

    if (
      event.key === "Escape"
    ) {

      closeLogin();

    }

  }
);