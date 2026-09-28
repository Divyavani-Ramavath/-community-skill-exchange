/* =====================================================
   COMMUNITY-SKILL-EXCHANGE
   APPLICATION
   ===================================================== */

console.log(
    "Community-Skill-Exchange application loaded."
);


/* =====================================================
   APPLICATION INITIALIZATION
   ===================================================== */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        /* ================================================
           REGISTRATION FORM
           ================================================ */

        const registerForm =
            document.getElementById("registerForm");

        if (registerForm) {

            registerForm.addEventListener(
                "submit",
                handleRegistration
            );

        }


        /* ================================================
           LOGIN FORM
           ================================================ */

        const loginForm =
            document.getElementById("loginForm");

        if (loginForm) {

            loginForm.addEventListener(
                "submit",
                handleLogin
            );

        }


        /* ================================================
           LOGOUT
           ================================================ */

        const logoutButton =
            document.getElementById("logoutButton");

        if (logoutButton) {

            logoutButton.addEventListener(
                "click",
                logoutUser
            );

        }

    }
);