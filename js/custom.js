// ✅ Firebase 登录系统 for Hexo Butterfly
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.5.0/firebase-app.js";
import {
  getAuth,
  setPersistence,
  browserLocalPersistence,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.5.0/firebase-auth.js";

// 🔧 你的 Firebase 配置
const firebaseConfig = {
  apiKey: "AIzaSyAYf-e1GjCDlkNrDZ51OYK2c-5Tv2tTCnQ",
  authDomain: "my-hexo-blog-1b604.firebaseapp.com",
  projectId: "my-hexo-blog-1b604",
  storageBucket: "my-hexo-blog-1b604.firebasestorage.app",
  messagingSenderId: "118378598865",
  appId: "1:118378598865:web:43e517c39d7c59388e90f0",
  measurementId: "G-1XEGP9WLX0"
};

// ✅ 仅允许此邮箱登录
const ALLOWED_EMAIL = "1249140039@qq.com"; // ⚠️ 改成你自己的邮箱

// 🚀 初始化 Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// ✅ 持久化登录
setPersistence(auth, browserLocalPersistence);

// 🚧 页面加载前隐藏内容
document.documentElement.style.visibility = "hidden";
console.log("✅ Firebase login script loaded");

document.addEventListener("DOMContentLoaded", () => {
  console.log("🌐 DOM 已加载");

  // 登录层
  if (!document.getElementById("login-overlay")) {
    const overlayHTML = `
      <div id="login-overlay">
        <div class="login-card">
          <h2 style="color:#fff;">🔐 登录博客</h2>
          <input id="email" type="email" placeholder="邮箱">
          <input id="password" type="password" placeholder="密码">
          <div class="btn-group">
            <button id="login-btn">登录</button>
          </div>
          <p id="login-msg"></p>
        </div>
      </div>
    `;
    document.body.insertAdjacentHTML("beforeend", overlayHTML);
  }

  // 样式
  if (!document.getElementById("login-style")) {
    const style = document.createElement("style");
    style.id = "login-style";
    style.textContent = `
      #login-overlay {
        position: fixed;
        inset: 0;
        background: rgba(15, 17, 26, 0.85);
        backdrop-filter: blur(8px);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 9999;
        color: #fff;
        transition: opacity 0.3s ease;
      }
      .login-card {
        background: rgba(255,255,255,0.08);
        padding: 2rem 3rem;
        border-radius: 16px;
        box-shadow: 0 0 25px rgba(0,0,0,0.4);
        text-align: center;
        width: 320px;
      }
      .login-card h2 {
        margin-bottom: 1rem;
        font-size: 1.3rem;
        font-weight: 600;
        color: #fff;
      }
      .login-card input {
        width: 100%;
        margin: 0.4rem 0;
        padding: 10px;
        border-radius: 8px;
        border: none;
        outline: none;
      }
      .btn-group {
        margin-top: 0.8rem;
      }
      .btn-group button {
        width: 95%;
        padding: 8px 0;
        border: none;
        border-radius: 8px;
        cursor: pointer;
        transition: 0.3s;
        color: #fff;
        background: #4CAF50;
      }
      .btn-group button:hover { opacity: 0.85; }
      #login-msg { margin-top: 0.6rem; font-size: 0.9rem; color: #ffcccc; }
    `;
    document.head.appendChild(style);
  }

  // 绑定登录按钮
  const loginBtn = document.getElementById("login-btn");
  if (loginBtn) loginBtn.onclick = loginUser;
});

// 🔑 登录逻辑（含调试输出）
async function loginUser() {
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;
  const msg = document.getElementById("login-msg");

  console.log("🚀 尝试登录：", email);

  if (email !== ALLOWED_EMAIL) {
    msg.textContent = "❌ 此邮箱无权访问博客";
    console.warn("拒绝访问的邮箱：", email);
    return;
  }

  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    console.log("✅ 登录成功：", userCredential.user);
    msg.textContent = "✅ 登录成功，正在加载博客...";
    setTimeout(() => location.reload(), 1000);
  } catch (e) {
    console.error("❌ 登录失败：", e.code, e.message);
    msg.textContent = `❌ 登录失败：${e.code}`;
  }
}

// 🚪 登出逻辑（可手动调用）
window.logoutUser = async function () {
  try {
    await signOut(auth);
    alert("已登出！");
    location.reload();
  } catch (e) {
    alert(e.message);
  }
};

// 👀 登录状态检测
onAuthStateChanged(auth, (user) => {
  const overlay = document.getElementById("login-overlay");

  if (user && user.email === ALLOWED_EMAIL) {
    console.log("✅ 已登录用户：", user.email);
    if (overlay) overlay.style.display = "none";
  } else {
    console.log("🚫 未登录或邮箱不匹配");
    if (overlay) overlay.style.display = "flex";
  }

  // 显示页面内容
  document.documentElement.style.visibility = "visible";
});
