/* =========================================================
   GSTIER VN
   BLACK / RED
   TIERLIST STYLE
========================================================= */

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}


:root {

  --bg: #080607;
  --panel: #100b0d;
  --panel2: #150d10;

  --border: #332025;

  --red: #ff2448;
  --red2: #ff0038;

  --text: #f4eef0;
  --muted: #a89da1;

  --gold: #ffc83d;
  --silver: #cbd2dc;
  --bronze: #cd7f32;

}


html {
  scroll-behavior: smooth;
}


body {

  min-height: 100vh;

  background:
    radial-gradient(
      circle at 50% 0%,
      rgba(255, 0, 50, .12),
      transparent 35%
    ),
    linear-gradient(
      135deg,
      #050405,
      #0d080a 50%,
      #070506
    );

  color: var(--text);

  font-family:
    "Segoe UI",
    Arial,
    sans-serif;

  overflow-x: hidden;

}


/* =========================
   BACKGROUND
========================= */

.bg-logo {

  position: fixed;

  top: 40%;

  left: 50%;

  transform:
    translate(-50%, -50%)
    rotate(-8deg);

  font-size: 22vw;

  font-weight: 1000;

  color: rgba(255, 0, 50, .025);

  pointer-events: none;

  user-select: none;

  z-index: 0;

}


.red-glow {

  position: fixed;

  width: 500px;

  height: 500px;

  border-radius: 50%;

  background: rgba(255, 0, 50, .08);

  filter: blur(100px);

  pointer-events: none;

  z-index: 0;

}


.glow-one {

  top: -250px;
  left: -200px;

}


.glow-two {

  bottom: -300px;
  right: -200px;

}



/* =========================
   HEADER
========================= */

.topbar {

  position: sticky;

  top: 18px;

  z-index: 100;

  width: calc(100% - 70px);

  max-width: 1450px;

  margin: 18px auto;

  min-height: 76px;

  display: flex;

  align-items: center;

  gap: 35px;

  padding: 12px 18px;

  background:
    rgba(14, 9, 11, .94);

  border:
    1px solid
    #3b2029;

  border-radius: 20px;

  box-shadow:
    0 20px 70px
    rgba(0,0,0,.5),
    inset 0 0 30px
    rgba(255,0,50,.025);

  backdrop-filter: blur(18px);

}


.brand {

  display: flex;

  align-items: center;

  gap: 12px;

  cursor: pointer;

  min-width: 190px;

}


.brand-icon {

  width: 48px;

  height: 48px;

  display: grid;

  place-items: center;

  border-radius: 13px;

  background:
    linear-gradient(
      135deg,
      #ff123f,
      #790018
    );

  color: white;

  font-weight: 1000;

  font-size: 17px;

  box-shadow:
    0 0 25px
    rgba(255,0,50,.3);

}


.brand-title {

  font-size: 20px;

  font-weight: 1000;

  letter-spacing: 1px;

}


.brand-subtitle {

  color: var(--red);

  font-size: 11px;

  font-weight: 800;

  letter-spacing: 2px;

}


.navigation {

  display: flex;

  gap: 8px;

  flex: 1;

}


.nav-item {

  border: 1px solid transparent;

  background: transparent;

  color: #a99da1;

  padding: 12px 17px;

  border-radius: 12px;

  cursor: pointer;

  font-weight: 800;

  letter-spacing: .5px;

  transition: .2s;

}


.nav-item:hover,
.nav-item.active {

  color: white;

  background:
    rgba(255,0,50,.09);

  border-color:
    rgba(255,0,50,.25);

}


.header-actions {

  display: flex;

  align-items: center;

  gap: 8px;

}


.login-btn,
.logout-btn {

  border: 0;

  border-radius: 12px;

  padding: 13px 18px;

  font-weight: 900;

  cursor: pointer;

}


.login-btn {

  background:
    linear-gradient(
      135deg,
      #ff2850,
      #c5002d
    );

  color: white;

  box-shadow:
    0 8px 25px
    rgba(255,0,50,.2);

}


.logout-btn {

  background: #1c1013;

  color: #ff7188;

  border: 1px solid #51222d;

}



/* =========================
   MAIN
========================= */

.main-container {

  position: relative;

  z-index: 2;

  width: calc(100% - 100px);

  max-width: 1480px;

  margin: 40px auto 100px;

}


.page-card {

  background:
    linear-gradient(
      180deg,
      rgba(22,15,17,.95),
      rgba(12,8,10,.97)
    );

  border:
    1px solid
    #39232a;

  border-radius: 24px;

  padding: 28px;

  box-shadow:
    0 30px 100px
    rgba(0,0,0,.35);

}



/* =========================
   HEADINGS
========================= */

.page-heading,
.admin-heading {

  display: flex;

  align-items: center;

  justify-content: space-between;

  gap: 25px;

  margin-bottom: 30px;

}


.eyebrow {

  color: #b56b78;

  font-size: 12px;

  font-weight: 900;

  letter-spacing: 2px;

  margin-bottom: 7px;

}


h1 {

  font-size: 46px;

  line-height: 1;

  font-weight: 1000;

  letter-spacing: -1px;

}


.page-heading p {

  margin-top: 12px;

  color: var(--muted);

  font-size: 15px;

}


.ranking-info {

  display: flex;

  align-items: center;

  gap: 12px;

  padding: 12px 18px;

  border: 1px solid #3b242a;

  border-radius: 14px;

  background: #100b0d;

}


.ranking-info > span {

  font-size: 25px;

}


.ranking-info strong {

  display: block;

  font-size: 13px;

}


.ranking-info small {

  color: #8e7e83;

}



/* =========================
   CONTROLS
========================= */

.controls {

  display: flex;

  gap: 12px;

  margin-bottom: 24px;

}


.search-wrapper {

  flex: 1;

  display: flex;

  align-items: center;

  gap: 10px;

  background: #090708;

  border: 1px solid #302026;

  border-radius: 13px;

  padding: 0 15px;

}


.search-wrapper span {

  opacity: .7;

}


.search-wrapper input {

  width: 100%;

  height: 48px;

  border: 0;

  outline: 0;

  background: transparent;

  color: white;

  font-size: 14px;

}


select {

  height: 48px;

  padding: 0 15px;

  border-radius: 13px;

  border: 1px solid #302026;

  background: #0b0809;

  color: #ddd4d7;

  outline: none;

  cursor: pointer;

}



/* =========================
   TABLE HEADER
========================= */

.ranking-table-header {

  display: grid;

  grid-template-columns:
    70px
    minmax(280px, 1fr)
    100px
    minmax(450px, 1.3fr)
    100px;

  gap: 15px;

  padding: 0 22px 12px;

  color: #776a70;

  font-size: 11px;

  font-weight: 1000;

  letter-spacing: 2px;

}



/* =========================
   RANKING ROW
========================= */

.ranking-list {

  display: flex;

  flex-direction: column;

  gap: 9px;

}


.ranking-row {

  position: relative;

  min-height: 95px;

  display: grid;

  grid-template-columns:
    70px
    minmax(280px, 1fr)
    100px
    minmax(450px, 1.3fr)
    100px;

  gap: 15px;

  align-items: center;

  padding: 10px 20px;

  background:
    linear-gradient(
      90deg,
      #160d10,
      #0e090b
    );

  border: 1px solid #302026;

  border-radius: 15px;

  cursor: pointer;

  overflow: hidden;

  transition:
    transform .2s,
    border .2s,
    box-shadow .2s;

}


.ranking-row::before {

  content: "";

  position: absolute;

  left: 0;

  top: 0;

  bottom: 0;

  width: 3px;

  background:
    #421824;

}


.ranking-row:hover {

  transform:
    translateY(-2px);

  border-color:
    #73303e;

  box-shadow:
    0 10px 35px
    rgba(255,0,50,.08);

}


.rank-number {

  font-size: 29px;

  font-weight: 1000;

  color: #bdb2b6;

  font-style: italic;

}


.rank-number.top1 {

  color: var(--gold);

}


.rank-number.top2 {

  color: var(--silver);

}


.rank-number.top3 {

  color: var(--bronze);

}



/* =========================
   PLAYER
========================= */

.player-cell {

  display: flex;

  align-items: center;

  gap: 15px;

  min-width: 0;

}


.avatar {

  width: 64px;

  height: 64px;

  object-fit: contain;

  border-radius: 10px;

  background: #080708;

  border: 1px solid #41232b;

}


.player-name {

  font-size: 18px;

  font-weight: 1000;

  white-space: nowrap;

  overflow: hidden;

  text-overflow: ellipsis;

}


.player-region {

  color: #85777c;

  font-size: 12px;

  margin-top: 5px;

}


.region-badge {

  display: inline-flex;

  align-items: center;

  justify-content: center;

  padding: 8px 12px;

  min-width: 62px;

  border-radius: 10px;

  background:
    #48122b;

  color: #ff7190;

  font-size: 12px;

  font-weight: 1000;

}



/* =========================
   TIER ICONS
========================= */

.tier-list {

  display: flex;

  align-items: center;

  gap: 9px;

  overflow-x: auto;

}


.tier-item {

  min-width: 49px;

  display: flex;

  flex-direction: column;

  align-items: center;

  gap: 4px;

}


.tier-icon {

  width: 43px;

  height: 43px;

  display: grid;

  place-items: center;

  border-radius: 11px;

  border: 1px solid #6e303d;

  background:
    radial-gradient(
      circle,
      #271016,
      #0c090a
    );

  font-size: 20px;

}


.tier-value {

  min-width: 38px;

  text-align: center;

  padding: 3px 5px;

  border-radius: 7px;

  background: #31151c;

  color: #e9dfe2;

  font-size: 10px;

  font-weight: 1000;

}


.total-points {

  text-align: right;

  font-size: 20px;

  font-weight: 1000;

  color: white;

}


.total-points small {

  display: block;

  color: #776970;

  font-size: 9px;

  letter-spacing: 1px;

}



/* =========================
   ADMIN ACTIONS
========================= */

.admin-actions {

  display: flex;

  gap: 5px;

  margin-left: auto;

}


.admin-actions button {

  width: 34px;

  height: 34px;

  border-radius: 8px;

  border: 1px solid #40232a;

  background: #150b0e;

  color: white;

  cursor: pointer;

}



/* =========================
   PROFILE
========================= */

.back-btn {

  border: 1px solid #48242d;

  background: #110a0c;

  color: #d9cdd1;

  padding: 12px 17px;

  border-radius: 11px;

  cursor: pointer;

  font-weight: 800;

  margin-bottom: 20px;

}


.back-btn:hover {

  border-color: var(--red);

  color: white;

}


.profile-card {

  max-width: 900px;

  margin: auto;

  padding: 30px;

  border-radius: 20px;

  border: 1px solid #43232b;

  background:
    linear-gradient(
      180deg,
      #150d10,
      #0d090a
    );

  box-shadow:
    0 30px 90px
    rgba(0,0,0,.5);

}


.profile-top {

  text-align: center;

  padding-bottom: 28px;

  border-bottom: 1px solid #29191e;

}


.profile-avatar {

  width: 210px;

  height: 210px;

  object-fit: contain;

  display: block;

  margin: 20px auto;

  filter:
    drop-shadow(
      0 20px 30px
      rgba(0,0,0,.6)
    );

}


.profile-name {

  font-size: 34px;

  font-weight: 1000;

}


.profile-region {

  color: #ff6d86;

  font-weight: 800;

  margin-top: 6px;

}


.profile-rank {

  margin: 22px auto 8px;

  max-width: 560px;

  padding: 18px;

  border-radius: 13px;

  border: 1px solid #67313b;

  background:
    linear-gradient(
      90deg,
      #3b141b,
      #120a0c
    );

  font-size: 20px;

  font-weight: 1000;

}


.profile-total {

  color: #aaa0a4;

  font-size: 13px;

}


.profile-body {

  margin-top: 30px;

}


.profile-body h2 {

  font-size: 15px;

  letter-spacing: 2px;

  margin-bottom: 15px;

}


.profile-grid {

  display: grid;

  grid-template-columns:
    repeat(7, 1fr);

  gap: 10px;

}


.mode-card {

  text-align: center;

  padding: 15px 8px;

  border: 1px solid #302026;

  border-radius: 12px;

  background: #0d090a;

}


.mode-name {

  color: #9f9095;

  font-size: 10px;

  font-weight: 900;

  margin-bottom: 9px;

}


.mode-tier {

  display: block;

  color: white;

  font-size: 16px;

  font-weight: 1000;

}


.mode-points {

  display: block;

  color: #ff506c;

  font-size: 11px;

  margin-top: 4px;

}


.skin-box {

  margin-top: 25px;

  padding: 20px;

  border: 1px solid #302026;

  border-radius: 14px;

  background: #0b0809;

}


.skin-box img {

  max-width: 250px;

  max-height: 350px;

  display: block;

  margin: 20px auto;

  object-fit: contain;

}



/* =========================
   ADMIN
========================= */

.admin-heading {

  margin-bottom: 25px;

}


.admin-heading h1 span {

  color: var(--red);

}


.admin-card {

  margin-bottom: 22px;

  padding: 25px;

  border-radius: 18px;

  background: #110a0c;

  border: 1px solid #39232a;

}


.admin-card h2 {

  margin-bottom: 22px;

}


.form-grid {

  display: grid;

  grid-template-columns:
    repeat(2, 1fr);

  gap: 18px;

}


.form-group {

  display: flex;

  flex-direction: column;

  gap: 7px;

}


.form-group label,
.tier-input label {

  font-size: 12px;

  font-weight: 900;

  color: #b7a9ae;

}


.form-group input,
.form-group select,
.tier-input select,
.modal-box input {

  width: 100%;

  height: 45px;

  border-radius: 9px;

  border: 1px solid #38242a;

  background: #090708;

  color: white;

  padding: 0 12px;

  outline: none;

}


.form-group input:focus,
.form-group select:focus,
.tier-input select:focus,
.modal-box input:focus {

  border-color: var(--red);

}


.form-group small {

  color: #74676c;

  font-size: 10px;

}


.section-label {

  margin: 25px 0 15px;

  color: #ff526d;

  font-size: 12px;

  letter-spacing: 2px;

}


.tier-input-grid {

  display: grid;

  grid-template-columns:
    repeat(4, 1fr);

  gap: 12px;

}


.tier-input {

  display: flex;

  flex-direction: column;

  gap: 7px;

}


.form-buttons {

  display: flex;

  gap: 10px;

  margin-top: 25px;

}


.primary-btn,
.secondary-btn {

  min-height: 45px;

  border-radius: 10px;

  padding: 0 18px;

  cursor: pointer;

  font-weight: 900;

}


.primary-btn {

  border: 0;

  background:
    linear-gradient(
      135deg,
      #ff1744,
      #bd002c
    );

  color: white;

}


.secondary-btn {

  background: #181013;

  color: #aaa;

  border: 1px solid #3a252b;

}


.form-message {

  margin-top: 12px;

  font-size: 13px;

}


.form-message.success {

  color: #5ee59a;

}


.form-message.error {

  color: #ff657c;

}


.admin-list-title {

  display: flex;

  justify-content: space-between;

  align-items: center;

  margin-bottom: 18px;

}


.admin-list-title span {

  color: #ff6179;

}


.admin-player-row {

  display: flex;

  align-items: center;

  gap: 15px;

  padding: 13px;

  border-bottom: 1px solid #25171c;

}


.admin-player-info {

  flex: 1;

}


.admin-player-actions {

  display: flex;

  gap: 7px;

}


.edit-btn,
.delete-btn {

  border-radius: 8px;

  padding: 9px 12px;

  cursor: pointer;

  border: 1px solid #3c252b;

  background: #170c0f;

  color: white;

}


.delete-btn {

  color: #ff6379;

}



/* =========================
   LOGIN
========================= */

.modal {

  position: fixed;

  inset: 0;

  z-index: 1000;

  display: grid;

  place-items: center;

  background:
    rgba(0,0,0,.78);

  backdrop-filter: blur(12px);

}


.modal-box {

  position: relative;

  width: min(440px, calc(100% - 30px));

  padding: 30px;

  border-radius: 18px;

  border: 1px solid #512530;

  background:
    linear-gradient(
      180deg,
      #180e11,
      #0b0809
    );

  box-shadow:
    0 30px 100px
    rgba(0,0,0,.7);

}


.modal-box h2 {

  font-size: 30px;

  margin-bottom: 10px;

}


.modal-box p {

  color: #93858a;

  font-size: 13px;

  line-height: 1.6;

  margin-bottom: 20px;

}


.modal-box form {

  display: flex;

  flex-direction: column;

  gap: 12px;

}


.modal-close {

  position: absolute;

  top: 12px;

  right: 12px;

  width: 35px;

  height: 35px;

  border-radius: 9px;

  border: 1px solid #3d252b;

  background: #120a0c;

  color: #bbb;

  font-size: 23px;

  cursor: pointer;

}



/* =========================
   UTILITY
========================= */

.loading,
.empty {

  padding: 50px;

  text-align: center;

  color: #807277;

}


.hidden {

  display: none !important;

}



/* =========================
   MOBILE
========================= */

@media (max-width: 1050px) {

  .ranking-table-header {
    display: none;
  }

  .ranking-row {

    grid-template-columns:
      55px
      1fr
      auto;

  }

  .tier-list {

    grid-column: 2 / 4;

  }

  .total-points {

    grid-column: 3;

    grid-row: 1;

  }

  .region-badge {

    display: none;
  }

  .tier-input-grid {

    grid-template-columns:
      repeat(2, 1fr);

  }

}


@media (max-width: 750px) {

  .topbar {

    width: calc(100% - 20px);

    flex-wrap: wrap;

    gap: 10px;

  }

  .navigation {

    order: 3;

    width: 100%;

  }

  .header-actions {

    margin-left: auto;

  }

  .main-container {

    width: calc(100% - 20px);

    margin-top: 20px;

  }

  .page-card {

    padding: 15px;

  }

  .page-heading {

    flex-direction: column;

    align-items: flex-start;

  }

  h1 {

    font-size: 34px;

  }

  .controls {

    flex-direction: column;

  }

  .ranking-row {

    grid-template-columns:
      42px
      1fr
      auto;

    padding: 10px;

  }

  .avatar {

    width: 52px;

    height: 52px;

  }

  .player-name {

    font-size: 15px;

  }

  .tier-list {

    grid-column: 1 / 4;

  }

  .profile-grid {

    grid-template-columns:
      repeat(2, 1fr);

  }

  .form-grid {

    grid-template-columns: 1fr;

  }

  .tier-input-grid {

    grid-template-columns: 1fr;

  }

}


@media (max-width: 480px) {

  .brand {

    min-width: 0;

  }

  .brand-title {

    font-size: 16px;

  }

  .login-btn {

    padding: 10px;

    font-size: 10px;

  }

  .navigation {

    overflow-x: auto;

  }

  .nav-item {

    white-space: nowrap;

  }

  .profile-avatar {

    width: 160px;

    height: 160px;

  }

}
