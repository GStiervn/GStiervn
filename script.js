```javascript
/* =========================================================
   GSTIER VN
   SCRIPT.JS
   SUPABASE + RANKING + PROFILE + ADMIN
   ========================================================= */

/* =========================================================
   SUPABASE
   ========================================================= */

const SUPABASE_URL = "https://sibttxgvndumphuryxwc.supabase.co";
const SUPABASE_KEY = "sb_publishable_5TyrZwFYdY-AgykyuopXpA_GGKNZ4O8";

const supabaseClient = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);


/* =========================================================
   CONFIG
   ========================================================= */

const MODES = [
    {
        key: "sword",
        name: "Sword",
        icon: "⚔️"
    },
    {
        key: "cpvp",
        name: "CPvP",
        icon: "💥"
    },
    {
        key: "uhc",
        name: "UHC",
        icon: "❤️"
    },
    {
        key: "mace",
        name: "Mace",
        icon: "🔨"
    },
    {
        key: "netherpot",
        name: "NetherPot",
        icon: "🧪"
    },
    {
        key: "smp",
        name: "SMP",
        icon: "🌍"
    },
    {
        key: "axe",
        name: "Axe",
        icon: "🪓"
    }
];

const TIERS = [
    { name: "LT5", points: 10 },
    { name: "HT5", points: 20 },
    { name: "LT4", points: 30 },
    { name: "HT4", points: 40 },
    { name: "LT3", points: 50 },
    { name: "HT3", points: 60 },
    { name: "LT2", points: 70 },
    { name: "HT2", points: 80 },
    { name: "LT1", points: 90 },
    { name: "HT1", points: 100 }
];

let players = [];
let currentPlayer = null;
let editingPlayerId = null;
let currentMode = "ALL";
let currentSort = "points";


/* =========================================================
   HELPERS
   ========================================================= */

function $(id) {
    return document.getElementById(id);
}


function escapeHtml(value) {
    if (value === null || value === undefined) {
        return "";
    }

    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}


function normalize(value) {
    return String(value || "")
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");
}


function getTierPoints(tier) {
    if (!tier) return 0;

    const found = TIERS.find(
        item =>
            item.name.toUpperCase() ===
            String(tier).toUpperCase()
    );

    return found ? found.points : 0;
}


function calculateTotal(player) {
    return MODES.reduce((total, mode) => {
        return total + getTierPoints(player[mode.key]);
    }, 0);
}


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


/* =========================================================
   AVATAR / SKIN
   ========================================================= */

function getAvatar(player) {

    if (player.avatar_url) {
        return player.avatar_url;
    }

    if (player.avatar) {
        return player.avatar;
    }

    if (player.skin_url) {
        return player.skin_url;
    }

    return (
        "https://mc-heads.net/avatar/" +
        encodeURIComponent(player.name || "Steve") +
        "/100"
    );
}


function getSkin(player) {

    if (player.skin_url) {
        return player.skin_url;
    }

    if (player.skin) {
        return player.skin;
    }

    return (
        "https://mc-heads.net/body/" +
        encodeURIComponent(player.name || "Steve") +
        "/300"
    );
}


/* =========================================================
   SCREEN CONTROL
   ========================================================= */

function hideAllScreens() {

    const screens = [
        "rankingPage",
        "profilePage",
        "adminPage"
    ];

    screens.forEach(id => {

        const element = $(id);

        if (element) {
            element.classList.add("hidden");
        }

    });
}


function showScreen(id) {

    hideAllScreens();

    const element = $(id);

    if (element) {
        element.classList.remove("hidden");
    }

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}


/* =========================================================
   HOME
   ========================================================= */

function goHome() {

    showScreen("rankingPage");

    currentPlayer = null;

    const navItems =
        document.querySelectorAll(".nav-item");

    navItems.forEach(item => {
        item.classList.remove("active");
    });

    const rankingButton =
        document.querySelector(
            ".navigation .nav-item"
        );

    if (rankingButton) {
        rankingButton.classList.add("active");
    }
}


/* =========================================================
   LOAD PLAYERS
   ========================================================= */

async function loadPlayers() {

    const list = $("rankingList");

    if (list) {

        list.innerHTML = `
            <div class="loading">
                Đang tải bảng xếp hạng...
            </div>
        `;
    }


    const {
        data,
        error
    } = await supabaseClient
        .from("players")
        .select("*");


    if (error) {

        console.error(
            "LOAD PLAYERS ERROR:",
            error
        );

        if (list) {

            list.innerHTML = `
                <div class="empty">
                    Không thể tải danh sách player.
                    <br>
                    <small>
                        ${escapeHtml(error.message)}
                    </small>
                </div>
            `;
        }

        return;
    }


    players = data || [];

    renderRanking();
    renderAdminList();
    updatePlayerCount();
}


/* =========================================================
   PLAYER COUNT
   ========================================================= */

function updatePlayerCount() {

    const count =
        players.length;

    const countElement =
        $("adminPlayerCount");

    if (countElement) {

        countElement.textContent =
            `${count} Player`;
    }
}


/* =========================================================
   FILTER PLAYERS
   ========================================================= */

function getFilteredPlayers() {

    let result = [...players];


    const searchInput =
        $("searchInput");


    const search =
        normalize(
            searchInput
                ? searchInput.value
                : ""
        );


    if (search) {

        result =
            result.filter(player => {

                const name =
                    normalize(player.name);

                const region =
                    normalize(player.region);

                return (
                    name.includes(search) ||
                    region.includes(search)
                );
            });
    }


    if (currentMode !== "ALL") {

        result =
            result.filter(player => {

                const key =
                    currentMode.toLowerCase();

                return player[key];
            });
    }


    result.sort((a, b) => {

        if (currentSort === "name") {

            return String(a.name || "")
                .localeCompare(
                    String(b.name || ""),
                    undefined,
                    {
                        sensitivity: "base"
                    }
                );
        }

        return (
            calculateTotal(b) -
            calculateTotal(a)
        );
    });


    return result;
}


/* =========================================================
   RENDER RANKING
   ========================================================= */

function renderRanking() {

    const list =
        $("rankingList");

    if (!list) return;


    const result =
        getFilteredPlayers();


    if (!result.length) {

        list.innerHTML = `
            <div class="empty">
                Không tìm thấy player.
            </div>
        `;

        return;
    }


    list.innerHTML =
        result.map(
            (player, index) => {

                const points =
                    calculateTotal(player);

                const rank =
                    index + 1;


                let rankClass = "";


                if (rank === 1) {
                    rankClass = "top1";
                }

                if (rank === 2) {
                    rankClass = "top2";
                }

                if (rank === 3) {
                    rankClass = "top3";
                }


                const tierHtml =
                    MODES.map(mode => {

                        const tier =
                            player[mode.key] || "—";


                        return `
                            <div class="tier-item">

                                <div class="tier-icon">
                                    ${mode.icon}
                                </div>

                                <div class="tier-value">
                                    ${escapeHtml(tier)}
                                </div>

                            </div>
                        `;

                    }).join("");


                return `
                    <div
                        class="ranking-row ${rankClass}"
                        data-player-id="${escapeHtml(player.id)}"
                        onclick="openProfile('${escapeHtml(player.id)}')"
                    >

                        <div class="rank-number ${rankClass}">
                            #${rank}
                        </div>


                        <div class="player-cell">

                            <img
                                class="avatar"
                                src="${escapeHtml(getAvatar(player))}"
                                alt="${escapeHtml(player.name)}"
                                onerror="this.src='https://mc-heads.net/avatar/Steve/100'"
                            >


                            <div>

                                <div class="player-name">
                                    ${escapeHtml(player.name)}
                                </div>

                                <div class="player-region">
                                    ${escapeHtml(player.region || "Unknown")}
                                </div>

                            </div>

                        </div>


                        <div class="region-badge">
                            ${escapeHtml(player.region || "VN")}
                        </div>


                        <div class="tier-list">
                            ${tierHtml}
                        </div>


                        <div class="total-points">

                            ${points}

                            <small>
                                POINTS
                            </small>

                        </div>

                    </div>
                `;
            }
        ).join("");
}


/* =========================================================
   SEARCH
   ========================================================= */

function searchPlayers() {
    renderRanking();
}


/* =========================================================
   MODE FILTER
   ========================================================= */

function changeMode(value) {

    currentMode =
        value || "ALL";

    renderRanking();
}


/* =========================================================
   SORT
   ========================================================= */

function changeSort(value) {

    currentSort =
        value === "name"
            ? "name"
            : "points";

    renderRanking();
}


/* =========================================================
   PROFILE
   ========================================================= */

function openProfile(playerId) {

    const player =
        players.find(
            item =>
                String(item.id) ===
                String(playerId)
        );


    if (!player) {
        return;
    }


    currentPlayer =
        player;


    const content =
        $("profileModalContent");


    const modal =
        $("profileModal");


    if (!content || !modal) {
        return;
    }


    const total =
        calculateTotal(player);


    const overall =
        getOverallTier(total);


    const modesHtml =
        MODES.map(mode => {

            const tier =
                player[mode.key] || "—";


            const points =
                getTierPoints(tier);


            return `
                <div class="mode-card">

                    <div class="mode-name">
                        ${mode.icon}
                        ${mode.name}
                    </div>

                    <span class="mode-tier">
                        ${escapeHtml(tier)}
                    </span>

                    <span class="mode-points">
                        ${points} points
                    </span>

                </div>
            `;

        }).join("");


    content.innerHTML = `

        <div class="profile-card">

            <div class="profile-top">

                <img
                    class="profile-avatar"
                    src="${escapeHtml(getAvatar(player))}"
                    alt="${escapeHtml(player.name)}"
                    onerror="this.src='https://mc-heads.net/avatar/Steve/200'"
                >


                <div class="profile-name">
                    ${escapeHtml(player.name)}
                </div>


                <div class="profile-region">
                    🌎
                    ${escapeHtml(player.region || "Unknown")}
                </div>


                <div class="profile-rank">

                    OVERALL TIER

                    <br>

                    <strong>
                        ${overall}
                    </strong>

                </div>


                <div class="profile-total">
                    ${total} total points
                </div>

            </div>


            <div class="profile-body">

                <h2>
                    TIER RANKINGS
                </h2>


                <div class="profile-grid">
                    ${modesHtml}
                </div>


                <div class="skin-box">

                    <h2>
                        PLAYER SKIN
                    </h2>

                    <img
                        src="${escapeHtml(getSkin(player))}"
                        alt="Minecraft skin"
                        onerror="this.style.display='none'"
                    >

                </div>

            </div>

        </div>
    `;


    modal.classList.remove("hidden");
}


/* =========================================================
   CLOSE PROFILE
   ========================================================= */

function closeProfile() {

    const modal =
        $("profileModal");

    if (modal) {
        modal.classList.add("hidden");
    }

    currentPlayer = null;
}


/* =========================================================
   ADMIN CHECK
   ========================================================= */

async function checkAdmin() {

    const {
        data: {
            user
        }
    } =
        await supabaseClient.auth.getUser();


    const adminButton =
        document.querySelector(".admin-only");


    const loginButton =
        $("loginButton");


    const logoutButton =
        $("logoutButton");


    if (!user) {

        if (adminButton) {
            adminButton.classList.add("hidden");
        }

        if (loginButton) {
            loginButton.classList.remove("hidden");
        }

        if (logoutButton) {
            logoutButton.classList.add("hidden");
        }

        return false;
    }


    const {
        data: adminData,
        error
    } =
        await supabaseClient
            .from("admin_users")
            .select("*")
            .eq("user_id", user.id)
            .maybeSingle();


    if (error || !adminData) {

        if (adminButton) {
            adminButton.classList.add("hidden");
        }

        if (loginButton) {
            loginButton.classList.remove("hidden");
        }

        if (logoutButton) {
            logoutButton.classList.add("hidden");
        }

        return false;
    }


    if (adminButton) {
        adminButton.classList.remove("hidden");
    }


    if (loginButton) {
        loginButton.classList.add("hidden");
    }


    if (logoutButton) {
        logoutButton.classList.remove("hidden");
    }


    return true;
}


/* =========================================================
   OPEN ADMIN
   ========================================================= */

async function openAdminPanel() {

    const isAdmin =
        await checkAdmin();


    if (!isAdmin) {

        openLogin();

        return;
    }


    closeProfile();

    showScreen("adminPage");


    const navItems =
        document.querySelectorAll(".nav-item");


    navItems.forEach(item => {
        item.classList.remove("active");
    });


    renderAdminList();
}


/* =========================================================
   ADMIN LIST
   ========================================================= */

function renderAdminList() {

    const list =
        $("adminPlayerList");


    if (!list) return;


    updatePlayerCount();


    if (!players.length) {

        list.innerHTML = `
            <div class="empty">
                Chưa có player.
            </div>
        `;

        return;
    }


    list.innerHTML =
        players.map(player => {

            return `
                <div class="admin-player-row">

                    <img
                        class="avatar"
                        src="${escapeHtml(getAvatar(player))}"
                        alt=""
                        onerror="this.src='https://mc-heads.net/avatar/Steve/70'"
                    >


                    <div class="admin-player-info">

                        <strong>
                            ${escapeHtml(player.name)}
                        </strong>

                        <small>
                            ${escapeHtml(player.region || "VN")}
                            •
                            ${calculateTotal(player)}
                            points
                        </small>

                    </div>


                    <div class="admin-player-actions">

                        <button
                            type="button"
                            class="edit-btn"
                            onclick="editPlayer('${escapeHtml(player.id)}')"
                        >
                            ✏️ Sửa
                        </button>


                        <button
                            type="button"
                            class="delete-btn"
                            onclick="deletePlayer('${escapeHtml(player.id)}')"
                        >
                            🗑️ Xóa
                        </button>

                    </div>

                </div>
            `;

        }).join("");
}


/* =========================================================
   GET INPUT
   ========================================================= */

function getInputValue(ids) {

    for (const id of ids) {

        const element =
            $(id);

        if (element) {
            return element.value.trim();
        }

    }

    return "";
}


/* =========================================================
   SET FORM VALUE
   ========================================================= */

function setFormValue(id, value) {

    const element =
        $(id);

    if (element) {
        element.value =
            value || "";
    }
}


/* =========================================================
   RESET PLAYER FORM
   ========================================================= */

function resetPlayerForm() {

    editingPlayerId = null;


    const form =
        $("playerForm");


    if (form) {
        form.reset();
    }


    setFormValue(
        "editingPlayerId",
        ""
    );


    setFormValue(
        "playerAvatarUrl",
        ""
    );


    setFormValue(
        "playerSkinUrl",
        ""
    );


    const title =
        $("formTitle");


    if (title) {
        title.textContent =
            "THÊM PLAYER";
    }


    const message =
        $("formMessage");


    if (message) {

        message.textContent =
            "";

        message.className =
            "form-message";
    }
}


/* =========================================================
   EDIT PLAYER
   ========================================================= */

async function editPlayer(playerId) {

    const isAdmin =
        await checkAdmin();


    if (!isAdmin) {

        openLogin();

        return;
    }


    const player =
        players.find(
            item =>
                String(item.id) ===
                String(playerId)
        );


    if (!player) {
        return;
    }


    editingPlayerId =
        player.id;


    setFormValue(
        "editingPlayerId",
        player.id
    );


    setFormValue(
        "playerName",
        player.name
    );


    setFormValue(
        "playerRegion",
        player.region || "VN"
    );


    setFormValue(
        "playerAvatarUrl",
        player.avatar_url || player.avatar || ""
    );


    setFormValue(
        "playerSkinUrl",
        player.skin_url || player.skin || ""
    );


    MODES.forEach(mode => {

        setFormValue(
            `${mode.key}Tier`,
            player[mode.key] || ""
        );

    });


    const title =
        $("formTitle");


    if (title) {

        title.textContent =
            "CHỈNH SỬA PLAYER";
    }


    const message =
        $("formMessage");


    if (message) {

        message.textContent =
            `Đang chỉnh sửa ${player.name}`;

        message.className =
            "form-message";
    }


    showScreen("adminPage");


    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}


/* =========================================================
   SAVE PLAYER
   ========================================================= */

async function savePlayer(event) {

    if (event) {
        event.preventDefault();
    }


    const isAdmin =
        await checkAdmin();


    if (!isAdmin) {

        showFormMessage(
            "Bạn không có quyền admin.",
            true
        );

        return;
    }


    const nameElement =
        $("playerName");


    const regionElement =
        $("playerRegion");


    if (!nameElement) {
        return;
    }


    const name =
        nameElement.value.trim();


    const region =
        regionElement
            ? regionElement.value.trim()
            : "VN";


    if (!name) {

        showFormMessage(
            "Vui lòng nhập tên player.",
            true
        );

        return;
    }


    const playerData = {

        name: name,

        region:
            region || "VN",

        avatar_url:
            getInputValue([
                "playerAvatarUrl"
            ]) || null,

        skin_url:
            getInputValue([
                "playerSkinUrl"
            ]) || null
    };


    MODES.forEach(mode => {

        playerData[mode.key] =
            getInputValue([
                `${mode.key}Tier`
            ]) || null;

    });


    playerData.total_points =
        calculateTotal(playerData);


    let result;


    if (editingPlayerId) {

        result =
            await supabaseClient
                .from("players")
                .update(playerData)
                .eq(
                    "id",
                    editingPlayerId
                )
                .select()
                .single();

    } else {

        result =
            await supabaseClient
                .from("players")
                .insert(playerData)
                .select()
                .single();
    }


    if (result.error) {

        console.error(
            "SAVE ERROR:",
            result.error
        );


        showFormMessage(
            "Lưu thất bại: " +
            result.error.message,
            true
        );

        return;
    }


    const wasEditing =
        Boolean(editingPlayerId);


    showFormMessage(
        wasEditing
            ? "✅ Đã cập nhật player!"
            : "✅ Đã thêm player!",
        false
    );


    editingPlayerId = null;


    await loadPlayers();


    resetPlayerForm();


    showFormMessage(
        wasEditing
            ? "✅ Đã cập nhật player!"
            : "✅ Đã thêm player!",
        false
    );
}


/* =========================================================
   FORM MESSAGE
   ========================================================= */

function showFormMessage(
    message,
    isError
) {

    const element =
        $("formMessage");


    if (!element) return;


    element.textContent =
        message;


    element.className =
        isError
            ? "form-message error"
            : "form-message success";
}


/* =========================================================
   DELETE PLAYER
   ========================================================= */

async function deletePlayer(playerId) {

    const isAdmin =
        await checkAdmin();


    if (!isAdmin) {

        alert(
            "Bạn không có quyền admin."
        );

        return;
    }


    const player =
        players.find(
            item =>
                String(item.id) ===
                String(playerId)
        );


    if (!player) {
        return;
    }


    const confirmed =
        confirm(
            `Bạn có chắc muốn xóa "${player.name}" không?`
        );


    if (!confirmed) {
        return;
    }


    const {
        error
    } =
        await supabaseClient
            .from("players")
            .delete()
            .eq(
                "id",
                playerId
            );


    if (error) {

        console.error(
            "DELETE ERROR:",
            error
        );


        alert(
            "Không thể xóa player:\n" +
            error.message
        );

        return;
    }


    if (
        String(currentPlayer?.id) ===
        String(playerId)
    ) {
        closeProfile();
    }


    await loadPlayers();


    alert(
        "✅ Đã xóa player!"
    );
}


/* =========================================================
   LOGIN
   ========================================================= */

function openLogin() {

    const modal =
        $("loginModal");


    if (modal) {
        modal.classList.remove("hidden");
    }
}


function closeLogin() {

    const modal =
        $("loginModal");


    if (modal) {
        modal.classList.add("hidden");
    }


    const message =
        $("loginMessage");


    if (message) {
        message.textContent = "";
    }
}


/* =========================================================
   LOGIN ADMIN
   ========================================================= */

async function loginAdmin(event) {

    if (event) {
        event.preventDefault();
    }


    const emailElement =
        $("loginEmail");


    const passwordElement =
        $("loginPassword");


    if (
        !emailElement ||
        !passwordElement
    ) {
        return;
    }


    const email =
        emailElement.value.trim();


    const password =
        passwordElement.value;


    const message =
        $("loginMessage");


    if (message) {
        message.textContent =
            "Đang đăng nhập...";
    }


    const {
        error
    } =
        await supabaseClient.auth
            .signInWithPassword({
                email,
                password
            });


    if (error) {

        console.error(
            "LOGIN ERROR:",
            error
        );


        if (message) {

            message.textContent =
                "❌ " +
                error.message;
        }

        return;
    }


    const isAdmin =
        await checkAdmin();


    if (!isAdmin) {

        await supabaseClient.auth.signOut();


        if (message) {

            message.textContent =
                "❌ Tài khoản này không có quyền admin.";
        }

        return;
    }


    if (message) {

        message.textContent =
            "✅ Đăng nhập thành công!";
    }


    closeLogin();


    await loadPlayers();


    openAdminPanel();
}


/* =========================================================
   LOGOUT
   ========================================================= */

async function logoutAdmin() {

    await supabaseClient.auth.signOut();


    await checkAdmin();


    goHome();


    alert(
        "Đã đăng xuất admin."
    );
}


/* =========================================================
   EVENTS
   ========================================================= */

function setupEvents() {


    /* SEARCH */

    const search =
        $("searchInput");


    if (search) {

        search.addEventListener(
            "input",
            searchPlayers
        );
    }


    /* MODE */

    const mode =
        $("modeFilter");


    if (mode) {

        mode.addEventListener(
            "change",
            event => {
                changeMode(
                    event.target.value
                );
            }
        );
    }


    /* SORT */

    const sort =
        $("sortFilter");


    if (sort) {

        sort.addEventListener(
            "change",
            event => {
                changeSort(
                    event.target.value
                );
            }
        );
    }


    /* LOGIN */

    const loginForm =
        $("loginForm");


    if (loginForm) {

        loginForm.addEventListener(
            "submit",
            loginAdmin
        );
    }


    /* PLAYER FORM */

    const playerForm =
        $("playerForm");


    if (playerForm) {

        playerForm.addEventListener(
            "submit",
            savePlayer
        );
    }


    /* PROFILE MODAL CLICK OUTSIDE */

    const profileModal =
        $("profileModal");


    if (profileModal) {

        profileModal.addEventListener(
            "click",
            event => {

                if (
                    event.target ===
                    profileModal
                ) {
                    closeProfile();
                }

            }
        );
    }


    /* LOGIN MODAL OVERLAY */

    const loginOverlay =
        document.querySelector(
            "#loginModal .modal-overlay"
        );


    if (loginOverlay) {

        loginOverlay.addEventListener(
            "click",
            closeLogin
        );
    }

}


/* =========================================================
   AUTH STATE
   ========================================================= */

supabaseClient.auth.onAuthStateChange(
    () => {

        setTimeout(
            async () => {
                await checkAdmin();
            },
            0
        );

    }
);


/* =========================================================
   INIT
   ========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    async () => {

        setupEvents();

        goHome();

        await checkAdmin();

        await loadPlayers();

    }
);


/* =========================================================
   GLOBAL FUNCTIONS
   ========================================================= */

window.goHome =
    goHome;

window.openProfile =
    openProfile;

window.closeProfile =
    closeProfile;

window.openAdminPanel =
    openAdminPanel;

window.openLogin =
    openLogin;

window.closeLogin =
    closeLogin;

window.loginAdmin =
    loginAdmin;

window.logoutAdmin =
    logoutAdmin;

window.savePlayer =
    savePlayer;

window.editPlayer =
    editPlayer;

window.deletePlayer =
    deletePlayer;

window.resetPlayerForm =
    resetPlayerForm;

window.searchPlayers =
    searchPlayers;

window.changeMode =
    changeMode;

window.changeSort =
    changeSort;

window.renderRanking =
    renderRanking;
```
