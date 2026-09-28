/* =====================================================
   COMMUNITY-SKILL-EXCHANGE
   AUTHENTICATION
   ===================================================== */


/* =====================================================
   REGISTRATION
   ===================================================== */

function registerUser(name, email, password) {

    const users = getData(STORAGE_KEYS.USERS, []);

    const newUser = {
        id: generateId("user"),
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password: password,
        createdAt: new Date().toISOString()
    };

    users.push(newUser);

    const saved = saveData(
        STORAGE_KEYS.USERS,
        users
    );

    if (!saved) {
        return false;
    }

    return true;
}


/* =====================================================
   VALIDATE EMAIL
   ===================================================== */

function isValidEmail(email) {

    const emailPattern =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    return emailPattern.test(email);
}


/* =====================================================
   VALIDATE PASSWORD
   ===================================================== */

function isStrongPassword(password) {

    /*
       Minimum 8 characters
       At least one letter
       At least one number
    */

    const passwordPattern =
        /^(?=.*[A-Za-z])(?=.*\d).{8,}$/;

    return passwordPattern.test(password);
}


/* =====================================================
   VALIDATE NAME
   ===================================================== */

function isValidName(name) {

    /*
       Allows letters, spaces, apostrophes and hyphens.
    */

    const namePattern =
        /^[A-Za-zÀ-ÿ' -]{2,50}$/;

    return namePattern.test(name.trim());
}


/* =====================================================
   REGISTRATION FORM
   ===================================================== */

function handleRegistration(event) {

    event.preventDefault();

    const name =
        document.getElementById("registerName").value.trim();

    const email =
        document.getElementById("registerEmail").value.trim();

    const password =
        document.getElementById("registerPassword").value;

    const confirmPassword =
        document.getElementById("confirmPassword").value;

    const terms =
        document.getElementById("terms").checked;

    const message =
        document.getElementById("registerMessage");


    /* ================================================
       NAME VALIDATION
       ================================================ */

    if (!name) {

        showAuthMessage(
            message,
            "Please enter your full name.",
            "error"
        );

        return;
    }


    if (!isValidName(name)) {

        showAuthMessage(
            message,
            "Name must contain 2–50 letters.",
            "error"
        );

        return;
    }


    /* ================================================
       EMAIL VALIDATION
       ================================================ */

    if (!email) {

        showAuthMessage(
            message,
            "Please enter your email address.",
            "error"
        );

        return;
    }


    if (!isValidEmail(email)) {

        showAuthMessage(
            message,
            "Please enter a valid email address.",
            "error"
        );

        return;
    }


    /* ================================================
       PASSWORD VALIDATION
       ================================================ */

    if (!password) {

        showAuthMessage(
            message,
            "Please create a password.",
            "error"
        );

        return;
    }


    if (!isStrongPassword(password)) {

        showAuthMessage(
            message,
            "Password must be at least 8 characters and contain at least one letter and one number.",
            "error"
        );

        return;
    }


    /* ================================================
       CONFIRM PASSWORD
       ================================================ */

    if (password !== confirmPassword) {

        showAuthMessage(
            message,
            "Passwords do not match.",
            "error"
        );

        return;
    }


    /* ================================================
       TERMS
       ================================================ */

    if (!terms) {

        showAuthMessage(
            message,
            "Please accept the terms and conditions.",
            "error"
        );

        return;
    }


    /* ================================================
       DUPLICATE EMAIL
       ================================================ */

    const users =
        getData(STORAGE_KEYS.USERS, []);

    const normalizedEmail =
        email.toLowerCase();

    const emailExists =
        users.some(
            user => user.email === normalizedEmail
        );


    if (emailExists) {

        showAuthMessage(
            message,
            "An account with this email already exists.",
            "error"
        );

        return;
    }


    /* ================================================
       CREATE USER
       ================================================ */

    const user =
        registerUser(
            name,
            email,
            password
        );


    if (!user) {

        showAuthMessage(
            message,
            "Unable to create account. Please try again.",
            "error"
        );

        return;
    }


    console.log(
        "User registered successfully."
    );


    /* ================================================
       SUCCESS MESSAGE
       ================================================ */

    showAuthMessage(
        message,
        "Account created successfully! Redirecting to login...",
        "success"
    );


    /* ================================================
       REDIRECT
       ================================================ */

    setTimeout(() => {

        window.location.href =
            "login.html";

    }, 1500);
}


/* =====================================================
   AUTH MESSAGE
   ===================================================== */

function showAuthMessage(
    element,
    message,
    type
) {

    if (!element) return;

    element.textContent = message;

    element.className =
        `auth-message ${type}`;
}


/* =====================================================
   LOGIN
   ===================================================== */

function handleLogin(event) {

    event.preventDefault();

    const emailInput =
        document.getElementById("loginEmail");

    const passwordInput =
        document.getElementById("loginPassword");

    const email =
        emailInput.value.trim().toLowerCase();

    const password =
        passwordInput.value;


    /* ================================================
       EMAIL VALIDATION
       ================================================ */

    if (!email) {

        showLoginMessage(
            "Please enter your email.",
            "error"
        );

        emailInput.focus();

        return;
    }


    if (!isValidEmail(email)) {

        showLoginMessage(
            "Please enter a valid email address.",
            "error"
        );

        emailInput.focus();

        return;
    }


    /* ================================================
       PASSWORD VALIDATION
       ================================================ */

    if (!password) {

        showLoginMessage(
            "Please enter your password.",
            "error"
        );

        passwordInput.focus();

        return;
    }


    /* ================================================
       CHECK USER
       ================================================ */

    const users =
        getData(
            STORAGE_KEYS.USERS,
            []
        );


    const user =
        users.find(
            registeredUser =>
                registeredUser.email === email &&
                registeredUser.password === password
        );


    /* ================================================
       INVALID LOGIN
       ================================================ */

    if (!user) {

        showLoginMessage(
            "Invalid email or password.",
            "error"
        );

        return;
    }


    /* ================================================
       CREATE LOGIN SESSION
       ================================================ */

    setCurrentUser(user.id);


    console.log(
        "Current user session:",
        getCurrentUser()
    );


    /* ================================================
       SUCCESS MESSAGE
       ================================================ */

    showLoginMessage(
        "Login successful! Redirecting...",
        "success"
    );


    /* ================================================
       REDIRECT TO DASHBOARD
       ================================================ */

    setTimeout(() => {

        window.location.href =
            "dashboard.html";

    }, 1000);
}


/* =====================================================
   LOGIN MESSAGE
   ===================================================== */

function showLoginMessage(
    message,
    type
) {

    const messageBox =
        document.getElementById("loginMessage");

    if (!messageBox) return;

    messageBox.textContent =
        message;

    messageBox.className =
        `auth-message ${type}`;
}


/* =====================================================
   LOGOUT
   ===================================================== */

function logoutUser() {

    clearCurrentUser();

    console.log(
        "User logged out successfully."
    );

    window.location.href =
        "login.html";
}
/* =====================================================
   PROTECT PAGE
   ===================================================== */

function protectPage() {

    if (!isLoggedIn()) {

        window.location.href = "login.html";

        return false;
    }

    return true;
}