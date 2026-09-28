/* =====================================================
   COMMUNITY-SKILL-EXCHANGE - COMMON COMPONENTS
   ===================================================== */


/* =====================================================
   NAVBAR
   ===================================================== */

function loadNavbar() {

    const navbar =
        document.getElementById("navbar");

    if (!navbar) return;

    const loggedIn =
        typeof isLoggedIn === "function" &&
        isLoggedIn();


    navbar.innerHTML = `
        <nav class="navbar">

            <div class="container navbar-content">

                <a href="index.html" class="logo">
                    Community-Skill-Exchange                </a>


                <div class="nav-links">

                    <a href="index.html">
                        Home
                    </a>

                    <a href="discover.html">
                        Discover
                    </a>

                    <a href="matches.html">
                        Matches
                    </a>

                    ${
                        loggedIn
                            ? `
                                <a href="dashboard.html">
                                    Dashboard
                                </a>

                                <a href="profile.html">
                                    Profile
                                </a>
                              `
                            : ""
                    }

                </div>


                <div class="nav-actions">

                    ${
                        loggedIn
                            ? `
                                <button
                                    type="button"
                                    class="btn btn-outline"
                                    id="logoutButton">
                                    Logout
                                </button>
                              `
                            : `
                                <a
                                    href="login.html"
                                    class="btn btn-outline">
                                    Login
                                </a>

                                <a
                                    href="register.html"
                                    class="btn btn-primary">
                                    Get Started
                                </a>
                              `
                    }

                </div>

            </div>

        </nav>
    `;
}


/* =====================================================
   FOOTER
   ===================================================== */

function loadFooter() {

    const footer = document.getElementById("footer");

    if (!footer) return;

    footer.innerHTML = `
        <footer class="footer">

            <div class="container footer-content">

                <div>

                    <a href="index.html" class="logo">
                        Community-Skill-Exchange
                    </a>

                    <p>
                        Learn skills, share knowledge,
                        and grow together.
                    </p>

                </div>

                <div class="footer-links">

                    <a href="discover.html">
                        Discover
                    </a>

                    <a href="matches.html">
                        Matches
                    </a>

                    <a href="index.html">
                        Home
                    </a>

                </div>

            </div>

            <div class="footer-bottom">

                <p>
                    © ${new Date().getFullYear()}
                    Community-Skill-Exchange.
                    All rights reserved.
                </p>

            </div>

        </footer>
    `;
}


/* =====================================================
   PAGE INITIALIZATION
   ===================================================== */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        loadNavbar();
        loadFooter();

    }
);