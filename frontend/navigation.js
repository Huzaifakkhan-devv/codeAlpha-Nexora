const savedUser = JSON.parse(
    localStorage.getItem("nexoraUser") || "null"
);

const token = localStorage.getItem("nexoraToken");

const loginLink = document.getElementById("login-link");
const registerLink = document.getElementById("register-link");
const dashboardLink = document.getElementById("dashboard-link");
const adminLink = document.getElementById("admin-link");
const listProductLink = document.getElementById("list-product-link");
const logoutLink = document.getElementById("logout-link");

if (token && savedUser) {
    if (loginLink) loginLink.hidden = true;
    if (registerLink) registerLink.hidden = true;
    if (logoutLink) logoutLink.hidden = false;

    if (savedUser.role === "admin") {
        if (adminLink) adminLink.hidden = false;
        if (listProductLink) listProductLink.hidden = false;
    } else {
        if (dashboardLink) dashboardLink.hidden = false;
        if (listProductLink) listProductLink.hidden = false;
    }
}