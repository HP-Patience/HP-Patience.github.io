var isNight = localStorage.getItem("night") || "false";

function applyNightMode() {
    if (isNight === "true") {
        document.body.classList.add("night");
        document.body.classList.remove("light");
        document.documentElement.classList.add("night-mode");
    } else {
        document.body.classList.remove("night");
        document.body.classList.add("light");
        document.documentElement.classList.remove("night-mode");
    }
    updateNightIcon();
}

function updateNightIcon() {
    var nightIcon = document.getElementById("night-icon");
    if (nightIcon) {
        if (isNight === "true") {
            nightIcon.className = "fas fa-lightbulb";
        } else {
            nightIcon.className = "fas fa-moon";
        }
    }
}

function toggleNightMode() {
    if (isNight === "true") {
        isNight = "false";
    } else {
        isNight = "true";
    }
    localStorage.setItem("night", isNight);
    applyNightMode();
}

function initNightMode() {
    var nightNav = document.getElementById("night-nav");
    if (nightNav) {
        nightNav.onclick = function(e) {
            e.preventDefault();
            toggleNightMode();
        };
    }
    applyNightMode();
}

function tryInit() {
    if (document.getElementById("night-nav")) {
        initNightMode();
    } else {
        if (document.readyState === "loading") {
            document.addEventListener("DOMContentLoaded", initNightMode);
        } else {
            initNightMode();
        }
    }
}

tryInit();

window.addEventListener("pageshow", function() {
    isNight = localStorage.getItem("night") || "true";
    tryInit();
});
