/* =====================================================
   SKILLCONNECT - COMMON FUNCTIONS
   ===================================================== */

function loadNavbar() {
    const navbar = document.getElementById("navbar");

    if (!navbar) return;

    navbar.innerHTML = `
        <nav class="navbar">
            <div class="container navbar-content">

                <a href="index.html" class="logo">
                    Skill<span>Connect</span>
                </a>

                <div class="nav-links">
                    <a href="index.html">Home</a>
                    <a href="discover.html">Discover</a>
                    <a href="matches.html">Matches</a>
                    <a href="dashboard.html">Dashboard</a>
                    <a href="profile.html">Profile</a>
                </div>

                <div class="nav-actions">
                    <a href="login.html" class="btn btn-outline">
                        Login
                    </a>

                    <a href="register.html" class="btn btn-primary">
                        Get Started
                    </a>
                </div>

            </div>
        </nav>
    `;
}

document.addEventListener("DOMContentLoaded", () => {
    loadNavbar();
});