// =====================================================
// LIGHT / DARK THEME SWITCHER - DESK SAFE
// =====================================================

function createThemeSwitcher() {
    if (document.getElementById("theme-switcher")) return;

    if (!document.body) {
        setTimeout(createThemeSwitcher, 500);
        return;
    }

    let btn = document.createElement("button");
    btn.id = "theme-switcher";
    btn.innerHTML = "🌙";

    let saved = localStorage.getItem("erp_theme_mode");

    if (saved === "dark") {
        document.body.classList.add("dark-mode");
        btn.innerHTML = "☀️";
    }

    btn.onclick = function () {
        document.body.classList.toggle("dark-mode");

        if (document.body.classList.contains("dark-mode")) {
            btn.innerHTML = "☀️";
            localStorage.setItem("erp_theme_mode", "dark");
        } else {
            btn.innerHTML = "🌙";
            localStorage.setItem("erp_theme_mode", "light");
        }
    };

    document.body.appendChild(btn);
}

createThemeSwitcher();
setTimeout(createThemeSwitcher, 1000);
setTimeout(createThemeSwitcher, 3000);

if (window.frappe && frappe.router) {
    frappe.router.on("change", function () {
        setTimeout(createThemeSwitcher, 500);
    });
}