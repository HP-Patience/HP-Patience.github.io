// 初始化 Firebase
const firebaseConfig = {
  apiKey: "AIzaSyAYf-e1GjCDlkNrDZ51OYK2c-5Tv2tTCnQ",
  authDomain: "my-hexo-blog-1b604.firebaseapp.com",
  projectId: "my-hexo-blog-1b604",
  storageBucket: "my-hexo-blog-1b604.firebasestorage.app",
  messagingSenderId: "118378598865",
  appId: "1:118378598865:web:43e517c39d7c59388e90f0",
  measurementId: "G-1XEGP9WLX0"
};

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();

// 登录函数
async function login() {
  const provider = new firebase.auth.GoogleAuthProvider();
  try {
    const result = await auth.signInWithPopup(provider);
    const user = result.user;
    document.getElementById("user-info").innerHTML = `👋 欢迎，${user.displayName}`;
    document.getElementById("login-btn").style.display = "none";
    document.getElementById("logout-btn").style.display = "inline-block";
    localStorage.setItem("user", JSON.stringify(user));
  } catch (error) {
    alert("登录失败：" + error.message);
  }
}

// 登出函数
function logout() {
  auth.signOut();
  document.getElementById("user-info").innerHTML = "";
  document.getElementById("login-btn").style.display = "inline-block";
  document.getElementById("logout-btn").style.display = "none";
  localStorage.removeItem("user");
}

// 页面加载时检查是否已有登录状态
window.addEventListener("DOMContentLoaded", () => {
  const storedUser = localStorage.getItem("user");
  if (storedUser) {
    const user = JSON.parse(storedUser);
    document.getElementById("user-info").innerHTML = `👋 欢迎回来，${user.displayName}`;
    document.getElementById("login-btn").style.display = "none";
    document.getElementById("logout-btn").style.display = "inline-block";
  }
});
