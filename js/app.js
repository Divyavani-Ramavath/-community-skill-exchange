/* =====================================================
   COMMUNITY-SKILL-EXCHANGE
   APPLICATION
   ===================================================== */

console.log("Community-Skill-Exchange application loaded.");


/* =====================================================
   LOAD LOGGED-IN USER PROFILE
   ===================================================== */

function loadUserProfile() {

    const currentUserId =
        getCurrentUser();

    if (!currentUserId) {
        return;
    }


    /* ---------------------------------------------
       Get Logged-in User
       --------------------------------------------- */

    const users =
        getData(
            STORAGE_KEYS.USERS,
            []
        );


    const user =
        users.find(
            registeredUser =>
                registeredUser.id === currentUserId
        );


    if (!user) {

        console.error(
            "Logged-in user not found."
        );

        return;
    }


    /* ---------------------------------------------
       Get or Create Profile
       --------------------------------------------- */

    let profile =
        getUserProfile(currentUserId);


    if (!profile) {

        profile =
            createUserProfile(currentUserId);

    }


    /* ---------------------------------------------
       Profile Header
       --------------------------------------------- */

    const profileName =
        document.getElementById(
            "profileName"
        );


    const profileEmail =
        document.getElementById(
            "profileEmail"
        );


    const profileInitial =
        document.getElementById(
            "profileInitial"
        );


    if (profileName) {

        profileName.textContent =
            user.name || "User";

    }


    if (profileEmail) {

        profileEmail.textContent =
            user.email || "";

    }


    if (profileInitial) {

        profileInitial.textContent =
            (user.name || "U")
                .trim()
                .charAt(0)
                .toUpperCase();

    }


    /* ---------------------------------------------
       Personal Information
       --------------------------------------------- */

    const displayName =
        document.getElementById(
            "displayName"
        );


    const displayEmail =
        document.getElementById(
            "displayEmail"
        );


    const displayLocation =
        document.getElementById(
            "displayLocation"
        );


    const displayEducation =
        document.getElementById(
            "displayEducation"
        );


    const displayBio =
        document.getElementById(
            "displayBio"
        );


    if (displayName) {

        displayName.textContent =
            user.name || "Not available";

    }


    if (displayEmail) {

        displayEmail.textContent =
            user.email || "Not available";

    }


    if (displayLocation) {

        displayLocation.textContent =
            profile.location ||
            "Not added";

    }


    if (displayEducation) {

        displayEducation.textContent =
            profile.education ||
            "Not added";

    }


    if (displayBio) {

        displayBio.textContent =
            profile.bio ||
            "No bio added yet.";

    }


    /* ---------------------------------------------
       Skills Summary
       --------------------------------------------- */

    loadProfileSkills(
        currentUserId
    );

}


/* =====================================================
   LOAD PROFILE SKILLS
   ===================================================== */

function loadProfileSkills(userId) {

    /* ---------------------------------------------
       Get all skills
       --------------------------------------------- */

    const skills =
        getData(
            STORAGE_KEYS.SKILLS,
            []
        );


    /* ---------------------------------------------
       Get only current user's skills
       --------------------------------------------- */

    const userSkills =
        skills.filter(
            skill =>
                skill.userId === userId
        );


    /* ---------------------------------------------
       Separate teaching and learning skills
       --------------------------------------------- */

    const teachingSkills =
        userSkills.filter(
            skill =>
                skill.type === "teaching"
        );


    const learningSkills =
        userSkills.filter(
            skill =>
                skill.type === "learning"
        );


    /* ---------------------------------------------
       Display Containers
       --------------------------------------------- */

    const teachingContainer =
        document.getElementById(
            "teachingSkills"
        );


    const learningContainer =
        document.getElementById(
            "learningSkills"
        );


    /* ---------------------------------------------
       Teaching Skills
       --------------------------------------------- */

    if (teachingContainer) {

        if (
            teachingSkills.length === 0
        ) {

            teachingContainer.innerHTML = `
                <span class="empty-state">
                    No skills added yet.
                </span>
            `;

        } else {

            teachingContainer.innerHTML =
                teachingSkills
                    .map(
                        skill => `
                            <span class="skill">
                                ${escapeHtml(
                                    skill.name
                                )}
                            </span>
                        `
                    )
                    .join("");

        }

    }


    /* ---------------------------------------------
       Learning Skills
       --------------------------------------------- */

    if (learningContainer) {

        if (
            learningSkills.length === 0
        ) {

            learningContainer.innerHTML = `
                <span class="empty-state">
                    No skills added yet.
                </span>
            `;

        } else {

            learningContainer.innerHTML =
                learningSkills
                    .map(
                        skill => `
                            <span class="skill">
                                ${escapeHtml(
                                    skill.name
                                )}
                            </span>
                        `
                    )
                    .join("");

        }

    }


    /* ---------------------------------------------
       Update Profile Statistics
       --------------------------------------------- */

    const statNumbers =
        document.querySelectorAll(
            ".profile-stat .stat-number"
        );


    if (statNumbers.length >= 2) {

        statNumbers[0].textContent =
            teachingSkills.length;


        statNumbers[1].textContent =
            learningSkills.length;

    }

}


/* =====================================================
   ESCAPE HTML
   ===================================================== */

function escapeHtml(value) {

    const div =
        document.createElement(
            "div"
        );


    div.textContent =
        value || "";


    return div.innerHTML;

}


/* =====================================================
   OPEN EDIT PROFILE
   ===================================================== */

function openEditProfile() {

    const currentUserId =
        getCurrentUser();


    if (!currentUserId) {
        return;
    }


    const users =
        getData(
            STORAGE_KEYS.USERS,
            []
        );


    const user =
        users.find(
            registeredUser =>
                registeredUser.id === currentUserId
        );


    if (!user) {
        return;
    }


    let profile =
        getUserProfile(currentUserId);


    if (!profile) {

        profile =
            createUserProfile(
                currentUserId
            );

    }


    const editProfileFormContainer =
        document.getElementById(
            "editProfileFormContainer"
        );


    const editProfileButton =
        document.getElementById(
            "editProfileButton"
        );


    const editName =
        document.getElementById(
            "editName"
        );


    const editLocation =
        document.getElementById(
            "editLocation"
        );


    const editEducation =
        document.getElementById(
            "editEducation"
        );


    const editBio =
        document.getElementById(
            "editBio"
        );


    /* ---------------------------------------------
       Fill Existing Information
       --------------------------------------------- */

    if (editName) {

        editName.value =
            user.name || "";

    }


    if (editLocation) {

        editLocation.value =
            profile.location || "";

    }


    if (editEducation) {

        editEducation.value =
            profile.education || "";

    }


    if (editBio) {

        editBio.value =
            profile.bio || "";

    }


    /* ---------------------------------------------
       Show Form
       --------------------------------------------- */

    if (editProfileFormContainer) {

        editProfileFormContainer.classList.add(
            "active"
        );

    }


    if (editProfileButton) {

        editProfileButton.style.display =
            "none";

    }


    if (editName) {

        editName.focus();

    }

}


/* =====================================================
   CLOSE EDIT PROFILE
   ===================================================== */

function closeEditProfile() {

    const editProfileFormContainer =
        document.getElementById(
            "editProfileFormContainer"
        );


    const editProfileButton =
        document.getElementById(
            "editProfileButton"
        );


    if (editProfileFormContainer) {

        editProfileFormContainer.classList.remove(
            "active"
        );

    }


    if (editProfileButton) {

        editProfileButton.style.display =
            "";

    }

}


/* =====================================================
   SAVE PROFILE
   ===================================================== */

function saveUserProfile(event) {

    event.preventDefault();


    const currentUserId =
        getCurrentUser();


    if (!currentUserId) {
        return;
    }


    /* ---------------------------------------------
       Get Form Values
       --------------------------------------------- */

    const editName =
        document.getElementById(
            "editName"
        );


    const editLocation =
        document.getElementById(
            "editLocation"
        );


    const editEducation =
        document.getElementById(
            "editEducation"
        );


    const editBio =
        document.getElementById(
            "editBio"
        );


    const name =
        editName.value.trim();


    const location =
        editLocation.value.trim();


    const education =
        editEducation.value.trim();


    const bio =
        editBio.value.trim();


    /* ---------------------------------------------
       Validate Name
       --------------------------------------------- */

    if (!name) {

        alert(
            "Please enter your full name."
        );

        editName.focus();

        return;
    }


    if (!isValidName(name)) {

        alert(
            "Name must contain 2–50 letters."
        );

        editName.focus();

        return;
    }


    /* ---------------------------------------------
       Validate Location
       --------------------------------------------- */

    if (
        location.length > 100
    ) {

        alert(
            "Location must not exceed 100 characters."
        );

        editLocation.focus();

        return;
    }


    /* ---------------------------------------------
       Validate Education
       --------------------------------------------- */

    if (
        education.length > 150
    ) {

        alert(
            "Education must not exceed 150 characters."
        );

        editEducation.focus();

        return;
    }


    /* ---------------------------------------------
       Validate Bio
       --------------------------------------------- */

    if (
        bio.length > 300
    ) {

        alert(
            "Bio must not exceed 300 characters."
        );

        editBio.focus();

        return;
    }


    /* ---------------------------------------------
       Get Users
       --------------------------------------------- */

    const users =
        getData(
            STORAGE_KEYS.USERS,
            []
        );


    const userIndex =
        users.findIndex(
            user =>
                user.id === currentUserId
        );


    if (userIndex === -1) {

        alert(
            "Unable to find your account."
        );

        return;
    }


    /* ---------------------------------------------
       Update User
       --------------------------------------------- */

    users[userIndex].name =
        name;


    const usersSaved =
        saveData(
            STORAGE_KEYS.USERS,
            users
        );


    if (!usersSaved) {

        alert(
            "Unable to save your account information."
        );

        return;
    }


    /* ---------------------------------------------
       Get Profiles
       --------------------------------------------- */

    const profiles =
        getData(
            STORAGE_KEYS.PROFILES,
            []
        );


    const profileIndex =
        profiles.findIndex(
            profile =>
                profile.userId === currentUserId
        );


    /* ---------------------------------------------
       Create Profile
       --------------------------------------------- */

    if (profileIndex === -1) {

        profiles.push({

            id:
                generateId("profile"),

            userId:
                currentUserId,

            bio:
                bio,

            location:
                location,

            education:
                education,

            createdAt:
                new Date().toISOString(),

            updatedAt:
                new Date().toISOString()

        });

    }


    /* ---------------------------------------------
       Update Existing Profile
       --------------------------------------------- */

    else {

        profiles[profileIndex].bio =
            bio;


        profiles[profileIndex].location =
            location;


        profiles[profileIndex].education =
            education;


        profiles[profileIndex].updatedAt =
            new Date().toISOString();

    }


    /* ---------------------------------------------
       Save Profile
       --------------------------------------------- */

    const profileSaved =
        saveData(
            STORAGE_KEYS.PROFILES,
            profiles
        );


    if (!profileSaved) {

        alert(
            "Unable to save profile. Please try again."
        );

        return;
    }


    /* ---------------------------------------------
       Refresh Profile
       --------------------------------------------- */

    loadUserProfile();


    /* ---------------------------------------------
       Close Edit Form
       --------------------------------------------- */

    closeEditProfile();


    /* ---------------------------------------------
       Success Message
       --------------------------------------------- */

    alert(
        "Profile updated successfully!"
    );

}


/* =====================================================
   APPLICATION INITIALIZATION
   ===================================================== */

document.addEventListener(
    "DOMContentLoaded",
    () => {


        /* ---------------------------------------------
           Registration
           --------------------------------------------- */

        const registerForm =
            document.getElementById(
                "registerForm"
            );


        if (registerForm) {

            registerForm.addEventListener(
                "submit",
                handleRegistration
            );

        }


        /* ---------------------------------------------
           Login
           --------------------------------------------- */

        const loginForm =
            document.getElementById(
                "loginForm"
            );


        if (loginForm) {

            loginForm.addEventListener(
                "submit",
                handleLogin
            );

        }


        /* ---------------------------------------------
           Logout
           --------------------------------------------- */

        const logoutButton =
            document.getElementById(
                "logoutButton"
            );


        if (logoutButton) {

            logoutButton.addEventListener(
                "click",
                logoutUser
            );

        }


        /* ---------------------------------------------
           Profile
           --------------------------------------------- */

        const profileNameElement =
            document.getElementById(
                "profileName"
            );


        if (profileNameElement) {

            loadUserProfile();

        }


        /* ---------------------------------------------
           Edit Profile
           --------------------------------------------- */

        const editProfileButton =
            document.getElementById(
                "editProfileButton"
            );


        if (editProfileButton) {

            editProfileButton.addEventListener(
                "click",
                openEditProfile
            );

        }


        /* ---------------------------------------------
           Cancel Edit
           --------------------------------------------- */

        const cancelEditButton =
            document.getElementById(
                "cancelEditButton"
            );


        if (cancelEditButton) {

            cancelEditButton.addEventListener(
                "click",
                closeEditProfile
            );

        }


        /* ---------------------------------------------
           Save Profile
           --------------------------------------------- */

        const editProfileForm =
            document.getElementById(
                "editProfileForm"
            );


        if (editProfileForm) {

            editProfileForm.addEventListener(
                "submit",
                saveUserProfile
            );

        }

    }
);