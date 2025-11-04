// 🚀 Firebase 登录系统 for Hexo Butterfly
if (!window._FIREBASE_LOGIN_INITIALIZED) {
  window._FIREBASE_LOGIN_INITIALIZED = true;
  console.log("✅ Firebase login script loaded once");

  import("https://www.gstatic.com/firebasejs/12.5.0/firebase-app.js").then(({ initializeApp }) => {
    import("https://www.gstatic.com/firebasejs/12.5.0/firebase-auth.js").then(
      ({
        getAuth,
        setPersistence,
        browserLocalPersistence,
        signInWithEmailAndPassword,
        signOut,
        onAuthStateChanged
      }) => {

        // ✅ 只允许这个邮箱登录
        const ALLOWED_EMAIL = "1249140039@qq.com"; // <-- 改成你自己的邮箱

        // 🔧 Firebase 配置
        const firebaseConfig = {
          apiKey: "AIzaSyAYf-e1GjCDlkNrDZ51OYK2c-5Tv2tTCnQ",
          authDomain: "my-hexo-blog-1b604.firebaseapp.com",
          projectId: "my-hexo-blog-1b604",
          storageBucket: "my-hexo-blog-1b604.firebasestorage.app",
          messagingSenderId: "118378598865",
          appId: "1:118378598865:web:43e517c39d7c59388e90f0",
          measurementId: "G-1XEGP9WLX0"
        };

        const app = initializeApp(firebaseConfig);
        const auth = getAuth(app);
        setPersistence(auth, browserLocalPersistence);

        // 页面未验证登录前隐藏
        document.documentElement.style.visibility = "hidden";

        // 🧱 登录弹窗
        function showLoginOverlay() {
          if (document.getElementById("login-overlay")) return;

          const html = `
            <div id="login-overlay">
              <div class="login-card">
                <h2 style="color:white;">🔐 登录博客</h2>
                <input id="email" type="email" placeholder="邮箱">
                <input id="password" type="password" placeholder="密码">
                <button id="login-btn">登录</button>
                <p id="login-msg"></p>
              </div>
            </div>
          `;
          document.body.insertAdjacentHTML("beforeend", html);
          document.getElementById("login-btn").onclick = loginUser;
        }

        // 🎨 样式
        const style = document.createElement("style");
        style.textContent = `
          #login-overlay {
            position: fixed; inset: 0;
            background: rgba(15,17,26,0.9);
            display: flex; justify-content: center; align-items: center;
            z-index: 9999; color: #fff;
          }
          .login-card {
            background: rgba(255,255,255,0.1);
            padding: 2rem 3rem; border-radius: 16px;
            box-shadow: 0 0 25px rgba(0,0,0,0.4);
            text-align: center; width: 320px;
          }
          .login-card input {
            width: 100%; margin: 0.4rem 0; padding: 10px;
            border-radius: 8px; border: none;
          }
          #login-btn {
            width: 100%; padding: 10px; border: none; border-radius: 8px;
            background: #4CAF50; color: #fff; cursor: pointer; margin-top: 10px;
          }
          #user-bar {
            position: fixed; top: 70px; right: 20px;
            background: rgba(0,0,0,0.6);
            padding: 6px 12px; border-radius: 8px;
            color: #fff; font-size: 14px; display: flex;
            align-items: center; gap: 8px; z-index: 9999;
          }
          #logout-btn {
            background: #f44336; border: none;
            border-radius: 6px; color: #fff;
            cursor: pointer; padding: 4px 8px;
          }
        `;
        document.head.appendChild(style);

        // 🔑 登录函数
        async function loginUser() {
          const email = document.getElementById("email").value.trim();
          const password = document.getElementById("password").value;
          const msg = document.getElementById("login-msg");

          if (email !== ALLOWED_EMAIL) {
            msg.textContent = "❌ 此邮箱无权访问";
            return;
          }

          try {
            await signInWithEmailAndPassword(auth, email, password);
            msg.textContent = "✅ 登录成功";
            setTimeout(() => {
              document.getElementById("login-overlay")?.remove();
              showUserBar(email);
            }, 300);
          } catch (e) {
            msg.textContent = "❌ 登录失败：" + e.message;
          }
        }

        // 🚪 登出函数
        async function logoutUser() {
          await signOut(auth);
          alert("👋 已登出");
          document.getElementById("user-bar")?.remove();
          showLoginOverlay();
        }

        // 👤 用户栏（右上角）
        function showUserBar(email) {
          let bar = document.getElementById("user-bar");
          if (!bar) {
            bar = document.createElement("div");
            bar.id = "user-bar";
            document.body.appendChild(bar);
          }
          bar.innerHTML = `<span>👤 ${email}</span><button id="logout-btn">登出</button>`;
          document.getElementById("logout-btn").onclick = logoutUser;
        }

        // 👁️ 登录状态监听
        onAuthStateChanged(auth, (user) => {
          if (user && user.email === ALLOWED_EMAIL) {
            document.getElementById("login-overlay")?.remove();
            showUserBar(user.email);
          } else {
            document.getElementById("user-bar")?.remove();
            showLoginOverlay();
          }
          document.documentElement.style.visibility = "visible";
        });

        // ⚙️ 修复 PJAX 页面跳转后丢失按钮
        document.addEventListener("pjax:complete", () => {
          const user = auth.currentUser;
          if (user && user.email === ALLOWED_EMAIL) {
            showUserBar(user.email);
          }
        });
      }
    );
  });
}
