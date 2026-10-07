/* =====================================================
   COMMUNITY-SKILL-EXCHANGE
   APPLICATION
   ===================================================== */

console.log(
    "Community-Skill-Exchange application loaded."
);


/* =====================================================
   COMMON HELPERS
   ===================================================== */

function escapeHtml(value) {

    const div =
        document.createElement("div");

    div.textContent =
        value || "";

    return div.innerHTML;
}


/* =====================================================
   PROFILE
   ===================================================== */

function loadUserProfile() {

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
        console.error(
            "Logged-in user not found."
        );
        return;
    }

    let profile =
        getUserProfile(
            currentUserId
        );

    if (!profile) {

        profile =
            createUserProfile(
                currentUserId
            );
    }

    const profileName =
        document.getElementById("profileName");

    const profileEmail =
        document.getElementById("profileEmail");

    const profileInitial =
        document.getElementById("profileInitial");

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

    const displayName =
        document.getElementById("displayName");

    const displayEmail =
        document.getElementById("displayEmail");

    const displayLocation =
        document.getElementById("displayLocation");

    const displayEducation =
        document.getElementById("displayEducation");

    const displayBio =
        document.getElementById("displayBio");

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

    loadProfileSkills(
        currentUserId
    );
}


/* =====================================================
   PROFILE SKILLS
   ===================================================== */

function loadProfileSkills(userId) {

    const skills =
        getData(
            STORAGE_KEYS.SKILLS,
            []
        );

    const userSkills =
        skills.filter(
            skill =>
                skill.userId === userId
        );

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

    const teachingContainer =
        document.getElementById(
            "teachingSkills"
        );

    const learningContainer =
        document.getElementById(
            "learningSkills"
        );

    if (teachingContainer) {

        if (teachingSkills.length === 0) {

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

    if (learningContainer) {

        if (learningSkills.length === 0) {

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
        getUserProfile(
            currentUserId
        );

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

    const container =
        document.getElementById(
            "editProfileFormContainer"
        );

    const button =
        document.getElementById(
            "editProfileButton"
        );

    if (container) {
        container.classList.remove(
            "active"
        );
    }

    if (button) {
        button.style.display = "";
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

    const editName =
        document.getElementById("editName");

    const editLocation =
        document.getElementById("editLocation");

    const editEducation =
        document.getElementById("editEducation");

    const editBio =
        document.getElementById("editBio");

    if (
        !editName ||
        !editLocation ||
        !editEducation ||
        !editBio
    ) {
        return;
    }

    const name =
        editName.value.trim();

    const location =
        editLocation.value.trim();

    const education =
        editEducation.value.trim();

    const bio =
        editBio.value.trim();

    if (!name) {

        alert(
            "Please enter your full name."
        );

        editName.focus();

        return;
    }

    if (
        typeof isValidName === "function" &&
        !isValidName(name)
    ) {

        alert(
            "Name must contain 2–50 letters."
        );

        editName.focus();

        return;
    }

    if (location.length > 100) {

        alert(
            "Location must not exceed 100 characters."
        );

        editLocation.focus();

        return;
    }

    if (education.length > 150) {

        alert(
            "Education must not exceed 150 characters."
        );

        editEducation.focus();

        return;
    }

    if (bio.length > 300) {

        alert(
            "Bio must not exceed 300 characters."
        );

        editBio.focus();

        return;
    }

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

    users[userIndex].name =
        name;

    if (
        !saveData(
            STORAGE_KEYS.USERS,
            users
        )
    ) {

        alert(
            "Unable to save account information."
        );

        return;
    }

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

    } else {

        profiles[profileIndex].bio =
            bio;

        profiles[profileIndex].location =
            location;

        profiles[profileIndex].education =
            education;

        profiles[profileIndex].updatedAt =
            new Date().toISOString();
    }

    if (
        !saveData(
            STORAGE_KEYS.PROFILES,
            profiles
        )
    ) {

        alert(
            "Unable to save profile."
        );

        return;
    }

    loadUserProfile();

    closeEditProfile();

    showAppMessage(
        "Profile updated successfully!",
        "success"
    );
}


/* =====================================================
   SKILLS
   ===================================================== */

function handleSkillSubmit(event) {

    event.preventDefault();

    const currentUserId =
        getCurrentUser();

    if (!currentUserId) {

        alert(
            "Please log in to manage your skills."
        );

        return;
    }

    const skillName =
        document.getElementById("skillName");

    const skillCategory =
        document.getElementById("skillCategory");

    const skillLevel =
        document.getElementById("skillLevel");

    const selectedType =
        document.querySelector(
            'input[name="skillType"]:checked'
        );

    if (
        !skillName ||
        !skillCategory ||
        !skillLevel
    ) {
        return;
    }

    const name =
        skillName.value.trim();

    const category =
        skillCategory.value;

    const level =
        skillLevel.value;

    const type =
        selectedType
            ? selectedType.value
            : "";

    if (!name) {

        alert(
            "Please enter a skill name."
        );

        skillName.focus();

        return;
    }

    if (name.length < 2) {

        alert(
            "Skill name must contain at least 2 characters."
        );

        skillName.focus();

        return;
    }

    if (
        !/^[A-Za-z0-9][A-Za-z0-9 .+#&/'-]*$/.test(
            name
        )
    ) {

        alert(
            "Please enter a valid skill name."
        );

        skillName.focus();

        return;
    }

    if (!type) {

        alert(
            "Please select the skill type."
        );

        return;
    }

    if (!category) {

        alert(
            "Please select a skill category."
        );

        return;
    }

    if (!level) {

        alert(
            "Please select your skill level."
        );

        return;
    }

    const existingSkills =
        getUserSkills(
            currentUserId
        );

    const duplicate =
        existingSkills.some(
            skill =>
                String(skill.name || "")
                    .trim()
                    .toLowerCase() ===
                name
                    .trim()
                    .toLowerCase() &&
                skill.type === type
        );

    if (duplicate) {

        alert(
            `You have already added "${name}" as a ${
                type === "teaching"
                    ? "teaching"
                    : "learning"
            } skill.`
        );

        return;
    }

    const newSkill =
        addUserSkill(
            currentUserId,
            name,
            type,
            category,
            level
        );

    if (!newSkill) {

        alert(
            "Unable to save skill."
        );

        return;
    }

    const skillForm =
        document.getElementById("skillForm");

    if (skillForm) {
        skillForm.reset();
    }

    const teachingRadio =
        document.querySelector(
            'input[name="skillType"][value="teaching"]'
        );

    if (teachingRadio) {
        teachingRadio.checked = true;
    }

    loadSkillsPage();

    showAppMessage(
        `"${name}" added successfully!`,
        "success"
    );
}


/* =====================================================
   LOAD SKILLS PAGE
   ===================================================== */

function loadSkillsPage() {

    const currentUserId =
        getCurrentUser();

    if (!currentUserId) {
        return;
    }

    const userSkills =
        getUserSkills(
            currentUserId
        );

    renderSkillList(
        "teachingSkillList",
        userSkills.filter(
            skill =>
                skill.type === "teaching"
        )
    );

    renderSkillList(
        "learningSkillList",
        userSkills.filter(
            skill =>
                skill.type === "learning"
        )
    );
}


/* =====================================================
   RENDER SKILLS
   ===================================================== */

function renderSkillList(
    containerId,
    skills
) {

    const container =
        document.getElementById(
            containerId
        );

    if (!container) {
        return;
    }

    if (skills.length === 0) {

        const isTeaching =
            containerId ===
            "teachingSkillList";

        container.innerHTML = `
            <div class="skill-empty-state">
                <span>
                    ${isTeaching ? "↑" : "↓"}
                </span>
                <p>
                    No ${
                        isTeaching
                            ? "teaching"
                            : "learning"
                    } skills yet.
                </p>
                <small>
                    Add a skill ${
                        isTeaching
                            ? "you can teach."
                            : "you want to learn."
                    }
                </small>
            </div>
        `;

        return;
    }

    container.innerHTML =
        skills
            .map(
                skill => `
                    <div class="managed-skill-item">

                        <div class="managed-skill-info">

                            <h4 class="managed-skill-name">
                                ${escapeHtml(
                                    skill.name
                                )}
                            </h4>

                            <div class="managed-skill-meta">

                                <span class="skill-meta">
                                    ${escapeHtml(
                                        skill.category
                                    )}
                                </span>

                                <span class="skill-meta">
                                    ${escapeHtml(
                                        skill.level
                                    )}
                                </span>

                            </div>

                        </div>

                        <button
                            type="button"
                            class="delete-skill-button"
                            data-skill-id="${escapeHtml(
                                skill.id
                            )}"
                        >
                            Delete
                        </button>

                    </div>
                `
            )
            .join("");

    container
        .querySelectorAll(
            ".delete-skill-button"
        )
        .forEach(
            button => {

                button.addEventListener(
                    "click",
                    () => {

                        deleteSkill(
                            button.dataset.skillId
                        );

                    }
                );

            }
        );
}


/* =====================================================
   DELETE SKILL
   ===================================================== */

function deleteSkill(skillId) {

    const currentUserId =
        getCurrentUser();

    if (!currentUserId) {
        return;
    }

    const skill =
        getUserSkills(
            currentUserId
        ).find(
            item =>
                item.id === skillId
        );

    if (!skill) {

        alert(
            "Skill not found."
        );

        return;
    }

    if (
        !confirm(
            `Delete "${skill.name}" from your skills?`
        )
    ) {
        return;
    }

    if (
        !deleteUserSkill(
            skillId
        )
    ) {

        alert(
            "Unable to delete skill."
        );

        return;
    }

    loadSkillsPage();
    loadUserProfile();

    showAppMessage(
        "Skill deleted successfully!",
        "success"
    );
}


/* =====================================================
   DISCOVERY
   ===================================================== */

function getDiscoveryMembers() {

    const currentUserId =
        getCurrentUser();

    const users =
        getData(
            STORAGE_KEYS.USERS,
            []
        );

    const profiles =
        getData(
            STORAGE_KEYS.PROFILES,
            []
        );

    const skills =
        getData(
            STORAGE_KEYS.SKILLS,
            []
        );

    return users
        .filter(
            user =>
                user.id !== currentUserId
        )
        .map(
            user => {

                const profile =
                    profiles.find(
                        item =>
                            item.userId === user.id
                    ) || {};

                return {

                    ...user,

                    profile,

                    skills:
                        skills.filter(
                            skill =>
                                skill.userId ===
                                user.id
                        )

                };
            }
        );
}


function loadDiscoveryPage() {

    const container =
        document.getElementById(
            "discoverResults"
        );

    if (!container) {
        return;
    }

    renderDiscoveryMembers(
        getDiscoveryMembers()
    );

    setupDiscoveryFilters();
}


function renderDiscoveryMembers(
    members
) {

    const container =
        document.getElementById(
            "discoverResults"
        );

    const emptyState =
        document.getElementById(
            "discoverEmpty"
        );

    const resultCount =
        document.getElementById(
            "discoverResultCount"
        );

    if (!container) {
        return;
    }

    if (resultCount) {

        resultCount.textContent =
            `${members.length} ${
                members.length === 1
                    ? "member"
                    : "members"
            } found`;
    }

    if (members.length === 0) {

        container.innerHTML = "";

        if (emptyState) {
            emptyState.style.display =
                "block";
        }

        return;
    }

    if (emptyState) {
        emptyState.style.display =
            "none";
    }

    container.innerHTML =
        members
            .map(
                member =>
                    createMemberCard(
                        member
                    )
            )
            .join("");
}


function createMemberCard(member) {

    const name =
        member.name ||
        "Community Member";

    const initial =
        name
            .trim()
            .charAt(0)
            .toUpperCase();

    const location =
        member.profile &&
        member.profile.location
            ? member.profile.location
            : "Location not added";

    const education =
        member.profile &&
        member.profile.education
            ? member.profile.education
            : "Education not added";

    const bio =
        member.profile &&
        member.profile.bio
            ? member.profile.bio
            : "";

    const teachingSkills =
        member.skills.filter(
            skill =>
                skill.type === "teaching"
        );

    const learningSkills =
        member.skills.filter(
            skill =>
                skill.type === "learning"
        );

    const joinedDate =
        member.createdAt
            ? formatDiscoveryDate(
                member.createdAt
            )
            : "Recently";

    const teachingHtml =
        teachingSkills.length
            ? teachingSkills
                .slice(0, 6)
                .map(
                    skill => `
                        <span class="member-skill">
                            ${escapeHtml(
                                skill.name
                            )}
                        </span>
                    `
                )
                .join("")
            : `
                <p class="member-no-skills">
                    No teaching skills added.
                </p>
            `;

    const learningHtml =
        learningSkills.length
            ? learningSkills
                .slice(0, 6)
                .map(
                    skill => `
                        <span class="member-skill learning">
                            ${escapeHtml(
                                skill.name
                            )}
                        </span>
                    `
                )
                .join("")
            : `
                <p class="member-no-skills">
                    No learning skills added.
                </p>
            `;

    return `
        <article class="member-card">

            <div class="member-card-header">

                <div class="member-avatar">
                    ${escapeHtml(initial)}
                </div>

                <div>

                    <h3 class="member-name">
                        ${escapeHtml(name)}
                    </h3>

                    <p class="member-location">
                        📍 ${escapeHtml(location)}
                    </p>

                </div>

            </div>

            <div class="member-details">

                <div>

                    <span class="member-detail-label">
                        Education
                    </span>

                    <p class="member-education">
                        ${escapeHtml(education)}
                    </p>

                </div>

                <div>

                    <span class="member-detail-label">
                        Can Teach
                    </span>

                    <div class="member-skills">
                        ${teachingHtml}
                    </div>

                </div>

                <div>

                    <span class="member-detail-label">
                        Wants to Learn
                    </span>

                    <div class="member-skills">
                        ${learningHtml}
                    </div>

                </div>

                ${
                    bio
                        ? `
                            <div class="member-bio">
                                <p>
                                    ${escapeHtml(bio)}
                                </p>
                            </div>
                        `
                        : ""
                }

            </div>

            <div class="member-card-footer">

                <span class="member-joined">
                    Joined ${joinedDate}
                </span>

            </div>

        </article>
    `;
}


function formatDiscoveryDate(
    dateString
) {

    const date =
        new Date(dateString);

    if (
        Number.isNaN(
            date.getTime()
        )
    ) {
        return "Recently";
    }

    return date.toLocaleDateString(
        "en-IN",
        {
            month: "short",
            year: "numeric"
        }
    );
}


function setupDiscoveryFilters() {

    const searchInput =
        document.getElementById(
            "discoverSearch"
        );

    const typeSelect =
        document.getElementById(
            "discoverType"
        );

    const categorySelect =
        document.getElementById(
            "discoverCategory"
        );

    const clearButton =
        document.getElementById(
            "clearDiscoverFilters"
        );

    const emptyButton =
        document.getElementById(
            "emptyClearFilters"
        );

    if (searchInput) {
        searchInput.addEventListener(
            "input",
            applyDiscoveryFilters
        );
    }

    if (typeSelect) {
        typeSelect.addEventListener(
            "change",
            applyDiscoveryFilters
        );
    }

    if (categorySelect) {
        categorySelect.addEventListener(
            "change",
            applyDiscoveryFilters
        );
    }

    if (clearButton) {
        clearButton.addEventListener(
            "click",
            clearDiscoveryFilters
        );
    }

    if (emptyButton) {
        emptyButton.addEventListener(
            "click",
            clearDiscoveryFilters
        );
    }
}


function applyDiscoveryFilters() {

    const searchInput =
        document.getElementById(
            "discoverSearch"
        );

    const typeSelect =
        document.getElementById(
            "discoverType"
        );

    const categorySelect =
        document.getElementById(
            "discoverCategory"
        );

    const search =
        searchInput
            ? searchInput.value
                .trim()
                .toLowerCase()
            : "";

    const selectedType =
        typeSelect
            ? typeSelect.value
            : "all";

    const selectedCategory =
        categorySelect
            ? categorySelect.value
            : "all";

    let members =
        getDiscoveryMembers();

    members =
        members.filter(
            member => {

                const name =
                    String(
                        member.name || ""
                    ).toLowerCase();

                const location =
                    String(
                        member.profile?.location || ""
                    ).toLowerCase();

                const education =
                    String(
                        member.profile?.education || ""
                    ).toLowerCase();

                const skillMatch =
                    member.skills.some(
                        skill =>

                            String(
                                skill.name || ""
                            )
                                .toLowerCase()
                                .includes(search)

                            ||

                            String(
                                skill.category || ""
                            )
                                .toLowerCase()
                                .includes(search)
                    );

                const searchMatch =
                    !search ||
                    name.includes(search) ||
                    location.includes(search) ||
                    education.includes(search) ||
                    skillMatch;

                if (!searchMatch) {
                    return false;
                }

                const typeMatch =
                    selectedType === "all" ||
                    member.skills.some(
                        skill =>
                            skill.type ===
                            selectedType
                    );

                if (!typeMatch) {
                    return false;
                }

                return (
                    selectedCategory === "all" ||
                    member.skills.some(
                        skill =>
                            skill.category ===
                            selectedCategory
                    )
                );
            }
        );

    renderDiscoveryMembers(
        members
    );
}


function clearDiscoveryFilters() {

    const searchInput =
        document.getElementById(
            "discoverSearch"
        );

    const typeSelect =
        document.getElementById(
            "discoverType"
        );

    const categorySelect =
        document.getElementById(
            "discoverCategory"
        );

    if (searchInput) {
        searchInput.value = "";
    }

    if (typeSelect) {
        typeSelect.value = "all";
    }

    if (categorySelect) {
        categorySelect.value = "all";
    }

    renderDiscoveryMembers(
        getDiscoveryMembers()
    );
}


/* =====================================================
   PHASE 5 — MATCHING
   ===================================================== */

function normalizeSkillName(
    skillName
) {

    return String(
        skillName || ""
    )
        .trim()
        .toLowerCase()
        .replace(
            /\s+/g,
            " "
        );
}


function skillsMatch(
    firstSkill,
    secondSkill
) {

    const first =
        normalizeSkillName(
            firstSkill
        );

    const second =
        normalizeSkillName(
            secondSkill
        );

    return (
        first !== "" &&
        first === second
    );
}


function getSkillMatches() {

    const currentUserId =
        getCurrentUser();

    if (!currentUserId) {
        return [];
    }

    const users =
        getData(
            STORAGE_KEYS.USERS,
            []
        );

    const profiles =
        getData(
            STORAGE_KEYS.PROFILES,
            []
        );

    const skills =
        getData(
            STORAGE_KEYS.SKILLS,
            []
        );

    const currentUser =
        users.find(
            user =>
                user.id === currentUserId
        );

    if (!currentUser) {
        return [];
    }

    const mySkills =
        skills.filter(
            skill =>
                skill.userId ===
                currentUserId
        );

    const myTeaching =
        mySkills.filter(
            skill =>
                skill.type === "teaching"
        );

    const myLearning =
        mySkills.filter(
            skill =>
                skill.type === "learning"
        );

    const matches = [];

    users
        .filter(
            user =>
                user.id !== currentUserId
        )
        .forEach(
            user => {

                const otherSkills =
                    skills.filter(
                        skill =>
                            skill.userId ===
                            user.id
                    );

                const otherTeaching =
                    otherSkills.filter(
                        skill =>
                            skill.type ===
                            "teaching"
                    );

                const otherLearning =
                    otherSkills.filter(
                        skill =>
                            skill.type ===
                            "learning"
                    );

                const teachMatches = [];
                const learnMatches = [];


                /* -----------------------------------------
                   They teach what I want to learn
                ----------------------------------------- */

                myLearning.forEach(
                    mySkill => {

                        const match =
                            otherTeaching.find(
                                otherSkill =>
                                    skillsMatch(
                                        mySkill.name,
                                        otherSkill.name
                                    )
                            );

                        if (match) {

                            teachMatches.push({
                                skill:
                                    mySkill.name,

                                category:
                                    mySkill.category ||
                                    match.category ||
                                    "",

                                level:
                                    match.level ||
                                    "Not specified"
                            });
                        }
                    }
                );


                /* -----------------------------------------
                   They want what I can teach
                ----------------------------------------- */

                myTeaching.forEach(
                    mySkill => {

                        const match =
                            otherLearning.find(
                                otherSkill =>
                                    skillsMatch(
                                        mySkill.name,
                                        otherSkill.name
                                    )
                            );

                        if (match) {

                            learnMatches.push({
                                skill:
                                    mySkill.name,

                                category:
                                    mySkill.category ||
                                    match.category ||
                                    "",

                                level:
                                    match.level ||
                                    "Not specified"
                            });
                        }
                    }
                );

                const totalMatchedSkills =
                    teachMatches.length +
                    learnMatches.length;

                if (totalMatchedSkills === 0) {
                    return;
                }

                let score = 0;

                if (teachMatches.length > 0) {
                    score += 25;
                }

                if (learnMatches.length > 0) {
                    score += 25;
                }

                score += Math.min(
                    totalMatchedSkills * 10,
                    50
                );

                score =
                    Math.min(
                        score,
                        100
                    );

                const profile =
                    profiles.find(
                        item =>
                            item.userId ===
                            user.id
                    ) || {};

                matches.push({

                    userId:
                        user.id,

                    name:
                        user.name ||
                        "Community Member",

                    email:
                        user.email ||
                        "",

                    profile:
                        profile,

                    score:
                        score,

                    teachMatches:
                        teachMatches,

                    learnMatches:
                        learnMatches,

                    totalMatchedSkills:
                        totalMatchedSkills

                });
            }
        );

    matches.sort(
        (a, b) => {

            if (
                b.score !== a.score
            ) {
                return (
                    b.score -
                    a.score
                );
            }

            return (
                b.totalMatchedSkills -
                a.totalMatchedSkills
            );
        }
    );

    return matches;
}


function getMatchReasons(match) {

    const reasons = [];

    (match.teachMatches || [])
        .slice(0, 3)
        .forEach(
            item => {

                reasons.push(
                    `Teaches ${item.skill} you want to learn`
                );

            }
        );

    (match.learnMatches || [])
        .slice(0, 3)
        .forEach(
            item => {

                reasons.push(
                    `Wants to learn ${item.skill} you can teach`
                );

            }
        );

    return reasons;
}


function loadMatchesPage() {

    const container =
        document.getElementById(
            "matchesResults"
        );

    if (!container) {
        return;
    }

    renderMatches(
        getSkillMatches()
    );

    setupMatchFilters();
}


function renderMatches(matches) {

    const container =
        document.getElementById(
            "matchesResults"
        );

    const emptyState =
        document.getElementById(
            "matchesEmpty"
        );

    const resultCount =
        document.getElementById(
            "matchesResultCount"
        );

    if (!container) {
        return;
    }

    if (resultCount) {

        resultCount.textContent =
            `${matches.length} ${
                matches.length === 1
                    ? "match"
                    : "matches"
            } found`;
    }

    if (matches.length === 0) {

        container.innerHTML = "";

        if (emptyState) {
            emptyState.style.display =
                "block";
        }

        return;
    }

    if (emptyState) {
        emptyState.style.display =
            "none";
    }

    container.innerHTML =
        matches
            .map(
                match =>
                    createMatchCard(
                        match
                    )
            )
            .join("");
}


function createMatchCard(match) {

    const name =
        match.name ||
        "Community Member";

    const initial =
        name
            .trim()
            .charAt(0)
            .toUpperCase();

    const location =
        match.profile?.location ||
        "Location not added";

    const education =
        match.profile?.education ||
        "Education not added";

    const bio =
        match.profile?.bio ||
        "";

    const reasons =
        getMatchReasons(
            match
        );

    const reasonHtml =
        reasons.length
            ? reasons
                .map(
                    reason => `
                        <li>
                            ${escapeHtml(reason)}
                        </li>
                    `
                )
                .join("")
            : `
                <li>
                    Compatible skill interests
                </li>
            `;

    const teachHtml =
        match.teachMatches.length
            ? match.teachMatches
                .map(
                    item => `
                        <span class="match-skill match-skill-learning">
                            ${escapeHtml(
                                item.skill
                            )}
                        </span>
                    `
                )
                .join("")
            : `
                <span class="match-no-skill">
                    No direct learning match
                </span>
            `;

    const learnHtml =
        match.learnMatches.length
            ? match.learnMatches
                .map(
                    item => `
                        <span class="match-skill match-skill-teaching">
                            ${escapeHtml(
                                item.skill
                            )}
                        </span>
                    `
                )
                .join("")
            : `
                <span class="match-no-skill">
                    No direct teaching match
                </span>
            `;

    const scoreClass =
        match.score >= 75
            ? "excellent"
            : match.score >= 50
                ? "good"
                : "potential";

    return `
        <article
            class="match-card"
            data-score="${match.score}"
        >

            <div class="match-card-top">

                <div class="match-person">

                    <div class="match-avatar">
                        ${escapeHtml(initial)}
                    </div>

                    <div>

                        <h3 class="match-name">
                            ${escapeHtml(name)}
                        </h3>

                        <p class="match-location">
                            📍 ${escapeHtml(location)}
                        </p>

                    </div>

                </div>

                <div class="match-score ${scoreClass}">

                    <strong>
                        ${match.score}%
                    </strong>

                    <span>
                        Match
                    </span>

                </div>

            </div>


            <div class="match-card-body">

                <div class="match-section">

                    <span class="match-section-label">
                        Why this is a match
                    </span>

                    <ul class="match-reasons">
                        ${reasonHtml}
                    </ul>

                </div>


                <div class="match-skill-columns">

                    <div class="match-skill-group">

                        <span class="match-section-label">
                            They Teach
                        </span>

                        <div class="match-skill-list">
                            ${teachHtml}
                        </div>

                    </div>


                    <div class="match-skill-group">

                        <span class="match-section-label">
                            They Want to Learn
                        </span>

                        <div class="match-skill-list">
                            ${learnHtml}
                        </div>

                    </div>

                </div>


                <div class="match-extra-info">

                    <div>

                        <span>
                            Education
                        </span>

                        <strong>
                            ${escapeHtml(
                                education
                            )}
                        </strong>

                    </div>

                    ${
                        bio
                            ? `
                                <div>

                                    <span>
                                        About
                                    </span>

                                    <strong>
                                        ${escapeHtml(
                                            bio
                                        )}
                                    </strong>

                                </div>
                            `
                            : ""
                    }

                </div>

            </div>


            <div class="match-card-footer">

                <span class="match-total">

                    ${match.totalMatchedSkills}
                    matched skill${
                        match.totalMatchedSkills === 1
                            ? ""
                            : "s"
                    }

                </span>

            </div>

        </article>
    `;
}


function setupMatchFilters() {

    const searchInput =
        document.getElementById(
            "matchSearch"
        );

    const scoreSelect =
        document.getElementById(
            "matchScore"
        );

    const clearButton =
        document.getElementById(
            "clearMatchFilters"
        );

    const emptyButton =
        document.getElementById(
            "emptyMatchClear"
        );

    if (searchInput) {
        searchInput.addEventListener(
            "input",
            applyMatchFilters
        );
    }

    if (scoreSelect) {
        scoreSelect.addEventListener(
            "change",
            applyMatchFilters
        );
    }

    if (clearButton) {
        clearButton.addEventListener(
            "click",
            clearMatchFilters
        );
    }

    if (emptyButton) {
        emptyButton.addEventListener(
            "click",
            clearMatchFilters
        );
    }
}


function applyMatchFilters() {

    const searchInput =
        document.getElementById(
            "matchSearch"
        );

    const scoreSelect =
        document.getElementById(
            "matchScore"
        );

    const search =
        searchInput
            ? searchInput.value
                .trim()
                .toLowerCase()
            : "";

    const selectedScore =
        scoreSelect
            ? scoreSelect.value
            : "all";

    let matches =
        getSkillMatches();

    matches =
        matches.filter(
            match => {

                const name =
                    String(
                        match.name || ""
                    ).toLowerCase();

                const location =
                    String(
                        match.profile?.location || ""
                    ).toLowerCase();

                const teachingText =
                    match.teachMatches
                        .map(
                            item =>
                                item.skill
                        )
                        .join(" ")
                        .toLowerCase();

                const learningText =
                    match.learnMatches
                        .map(
                            item =>
                                item.skill
                        )
                        .join(" ")
                        .toLowerCase();

                const searchMatch =
                    !search ||
                    name.includes(search) ||
                    location.includes(search) ||
                    teachingText.includes(search) ||
                    learningText.includes(search);

                if (!searchMatch) {
                    return false;
                }

                if (selectedScore === "high") {
                    return match.score >= 75;
                }

                if (selectedScore === "medium") {
                    return (
                        match.score >= 50 &&
                        match.score < 75
                    );
                }

                if (selectedScore === "potential") {
                    return match.score < 50;
                }

                return true;
            }
        );

    renderMatches(
        matches
    );
}


function clearMatchFilters() {

    const searchInput =
        document.getElementById(
            "matchSearch"
        );

    const scoreSelect =
        document.getElementById(
            "matchScore"
        );

    if (searchInput) {
        searchInput.value = "";
    }

    if (scoreSelect) {
        scoreSelect.value = "all";
    }

    renderMatches(
        getSkillMatches()
    );
}


/* =====================================================
   PHASE 6 — KNOWLEDGE EXCHANGE
   ===================================================== */

let currentExchangeTab =
    "received";


/* =====================================================
   EXCHANGE STORAGE
   ===================================================== */

function getExchangeRequests() {

    return getData(
        STORAGE_KEYS.CONNECTIONS,
        []
    );
}


function saveExchangeRequests(
    requests
) {

    return saveData(
        STORAGE_KEYS.CONNECTIONS,
        requests
    );
}


function createExchangeRequest(
    senderId,
    receiverId,
    skillId,
    skillName,
    exchangeType,
    message
) {

    const requests =
        getExchangeRequests();

    const duplicate =
        requests.some(
            request =>
                request.senderId === senderId &&
                request.receiverId === receiverId &&
                request.skillId === skillId &&
                request.status === "pending"
        );

    if (duplicate) {
        return null;
    }

    const request = {

        id:
            generateId("exchange"),

        senderId:
            senderId,

        receiverId:
            receiverId,

        skillId:
            skillId,

        skillName:
            skillName,

        exchangeType:
            exchangeType,

        message:
            message || "",

        status:
            "pending",

        createdAt:
            new Date().toISOString(),

        updatedAt:
            new Date().toISOString()

    };

    requests.push(
        request
    );

    if (
        !saveExchangeRequests(
            requests
        )
    ) {
        return null;
    }

    return request;
}


function getSentExchangeRequests(
    userId
) {

    return getExchangeRequests()
        .filter(
            request =>
                request.senderId === userId
        );
}


function getReceivedExchangeRequests(
    userId
) {

    return getExchangeRequests()
        .filter(
            request =>
                request.receiverId === userId
        );
}


function getExchangeRequestsForUser(
    userId
) {

    return getExchangeRequests()
        .filter(
            request =>
                request.senderId === userId ||
                request.receiverId === userId
        );
}


function updateExchangeRequestStatus(
    requestId,
    status
) {

    const requests =
        getExchangeRequests();

    const index =
        requests.findIndex(
            request =>
                request.id === requestId
        );

    if (index === -1) {
        return false;
    }

    requests[index].status =
        status;

    requests[index].updatedAt =
        new Date().toISOString();

    return saveExchangeRequests(
        requests
    );
}


function deleteExchangeRequest(
    requestId
) {

    const requests =
        getExchangeRequests();

    const updated =
        requests.filter(
            request =>
                request.id !== requestId
        );

    if (
        updated.length ===
        requests.length
    ) {
        return false;
    }

    return saveExchangeRequests(
        updated
    );
}


/* =====================================================
   EXCHANGE MEMBERS
   ===================================================== */

function getExchangeMembers() {

    const currentUserId =
        getCurrentUser();

    return getData(
        STORAGE_KEYS.USERS,
        []
    ).filter(
        user =>
            user.id !== currentUserId
    );
}


function getExchangeMemberName(
    userId
) {

    const user =
        getData(
            STORAGE_KEYS.USERS,
            []
        ).find(
            item =>
                item.id === userId
        );

    return user
        ? user.name
        : "Unknown Member";
}


function getExchangeMemberProfile(
    userId
) {

    return getUserProfile(
        userId
    );
}


function getExchangeMemberSkills(
    userId
) {

    return getUserSkills(
        userId
    );
}


/* =====================================================
   LOAD EXCHANGE PAGE
   ===================================================== */

function loadExchangePage() {

    if (!getCurrentUser()) {
        return;
    }

    loadExchangeStatistics();

    loadExchangeMembers();

    loadExchangeSkills();

    renderExchangeRequests(
        currentExchangeTab
    );

    setupExchangeEvents();
}


/* =====================================================
   EXCHANGE STATISTICS
   ===================================================== */

function loadExchangeStatistics() {

    const currentUserId =
        getCurrentUser();

    if (!currentUserId) {
        return;
    }

    const sentRequests =
        getSentExchangeRequests(
            currentUserId
        );

    const receivedRequests =
        getReceivedExchangeRequests(
            currentUserId
        );

    const allRequests =
        getExchangeRequestsForUser(
            currentUserId
        );

    const pendingRequests =
        allRequests.filter(
            request =>
                request.status === "pending"
        );

    const acceptedRequests =
        allRequests.filter(
            request =>
                request.status === "accepted"
        );

    const sentElement =
        document.getElementById(
            "sentRequestCount"
        );

    const receivedElement =
        document.getElementById(
            "receivedRequestCount"
        );

    const pendingElement =
        document.getElementById(
            "pendingRequestCount"
        );

    const acceptedElement =
        document.getElementById(
            "acceptedRequestCount"
        );

    if (sentElement) {
        sentElement.textContent =
            sentRequests.length;
    }

    if (receivedElement) {
        receivedElement.textContent =
            receivedRequests.length;
    }

    if (pendingElement) {
        pendingElement.textContent =
            pendingRequests.length;
    }

    if (acceptedElement) {
        acceptedElement.textContent =
            acceptedRequests.length;
    }
}


/* =====================================================
   EXCHANGE MEMBER SELECT
   ===================================================== */

function loadExchangeMembers() {

    const select =
        document.getElementById(
            "exchangeMember"
        );

    if (!select) {
        return;
    }

    const members =
        getExchangeMembers();

    select.innerHTML = `
        <option value="">
            Select a member
        </option>
    `;

    members.forEach(
        member => {

            const profile =
                getExchangeMemberProfile(
                    member.id
                );

            const option =
                document.createElement(
                    "option"
                );

            option.value =
                member.id;

            option.textContent =
                member.name +
                (
                    profile?.location
                        ? ` — ${profile.location}`
                        : ""
                );

            select.appendChild(
                option
            );
        }
    );
}


/* =====================================================
   EXCHANGE SKILL SELECT
   ===================================================== */

function loadExchangeSkills() {

    const select =
        document.getElementById(
            "exchangeSkill"
        );

    if (!select) {
        return;
    }

    const currentUserId =
        getCurrentUser();

    if (!currentUserId) {
        return;
    }

    const skills =
        getUserSkills(
            currentUserId
        );

    select.innerHTML = `
        <option value="">
            Select a skill
        </option>
    `;

    if (skills.length === 0) {

        const option =
            document.createElement(
                "option"
            );

        option.disabled = true;

        option.textContent =
            "Add skills first";

        select.appendChild(
            option
        );

        return;
    }

    skills.forEach(
        skill => {

            const option =
                document.createElement(
                    "option"
                );

            option.value =
                skill.id;

            option.textContent =
                `${skill.name} (${skill.type})`;

            select.appendChild(
                option
            );
        }
    );
}


/* =====================================================
   EXCHANGE EVENTS
   ===================================================== */

function setupExchangeEvents() {

    const openButton =
        document.getElementById(
            "openExchangeModal"
        );

    const closeButton =
        document.getElementById(
            "closeExchangeModal"
        );

    const cancelButton =
        document.getElementById(
            "cancelExchange"
        );

    const emptyButton =
        document.getElementById(
            "emptyCreateExchange"
        );

    const overlay =
        document.querySelector(
            ".exchange-modal-overlay"
        );

    const form =
        document.getElementById(
            "exchangeForm"
        );

    if (openButton) {
        openButton.addEventListener(
            "click",
            openExchangeModal
        );
    }

    if (closeButton) {
        closeButton.addEventListener(
            "click",
            closeExchangeModal
        );
    }

    if (cancelButton) {
        cancelButton.addEventListener(
            "click",
            closeExchangeModal
        );
    }

    if (emptyButton) {
        emptyButton.addEventListener(
            "click",
            openExchangeModal
        );
    }

    if (overlay) {

        overlay.addEventListener(
            "click",
            event => {

                if (
                    event.target ===
                    overlay
                ) {
                    closeExchangeModal();
                }

            }
        );
    }

    if (form) {
        form.addEventListener(
            "submit",
            handleExchangeSubmit
        );
    }

    document
        .querySelectorAll(
            ".exchange-tab"
        )
        .forEach(
            tab => {

                tab.addEventListener(
                    "click",
                    () => {

                        switchExchangeTab(
                            tab.dataset.tab
                        );

                    }
                );

            }
        );
}


/* =====================================================
   OPEN EXCHANGE MODAL
   ===================================================== */

function openExchangeModal() {

    const modal =
        document.getElementById(
            "exchangeModal"
        );

    if (!modal) {
        return;
    }

    loadExchangeMembers();

    loadExchangeSkills();

    const form =
        document.getElementById(
            "exchangeForm"
        );

    if (form) {
        form.reset();
    }

    modal.style.display =
        "flex";

    document.body.classList.add(
        "modal-open"
    );
}


/* =====================================================
   CLOSE EXCHANGE MODAL
   ===================================================== */

function closeExchangeModal() {

    const modal =
        document.getElementById(
            "exchangeModal"
        );

    if (!modal) {
        return;
    }

    modal.style.display =
        "none";

    document.body.classList.remove(
        "modal-open"
    );

    const form =
        document.getElementById(
            "exchangeForm"
        );

    if (form) {
        form.reset();
    }
}


/* =====================================================
   HANDLE EXCHANGE SUBMIT
   ===================================================== */

function handleExchangeSubmit(
    event
) {

    event.preventDefault();

    const currentUserId =
        getCurrentUser();

    if (!currentUserId) {

        showAppMessage(
            "Please login to create an exchange request.",
            "error"
        );

        return;
    }

    const memberSelect =
        document.getElementById(
            "exchangeMember"
        );

    const skillSelect =
        document.getElementById(
            "exchangeSkill"
        );

    const typeSelect =
        document.getElementById(
            "exchangeType"
        );

    const messageInput =
        document.getElementById(
            "exchangeMessage"
        );

    if (
        !memberSelect ||
        !skillSelect ||
        !typeSelect
    ) {
        return;
    }

    const receiverId =
        memberSelect.value;

    const skillId =
        skillSelect.value;

    const exchangeType =
        typeSelect.value;

    const message =
        messageInput
            ? messageInput.value.trim()
            : "";

    if (!receiverId) {

        showAppMessage(
            "Please select a community member.",
            "error"
        );

        return;
    }

    if (!skillId) {

        showAppMessage(
            "Please select a skill.",
            "error"
        );

        return;
    }

    if (!exchangeType) {

        showAppMessage(
            "Please select an exchange type.",
            "error"
        );

        return;
    }

    const skill =
        getUserSkills(
            currentUserId
        ).find(
            item =>
                item.id === skillId
        );

    if (!skill) {

        showAppMessage(
            "Selected skill could not be found.",
            "error"
        );

        return;
    }

    const request =
        createExchangeRequest(
            currentUserId,
            receiverId,
            skill.id,
            skill.name,
            exchangeType,
            message
        );

    if (!request) {

        showAppMessage(
            "A pending request for this skill already exists.",
            "error"
        );

        return;
    }

    closeExchangeModal();

    loadExchangeStatistics();

    renderExchangeRequests(
        currentExchangeTab
    );

    showAppMessage(
        "Exchange request sent successfully.",
        "success"
    );
}


/* =====================================================
   SWITCH EXCHANGE TAB
   ===================================================== */

function switchExchangeTab(
    tabName
) {

    currentExchangeTab =
        tabName;

    document
        .querySelectorAll(
            ".exchange-tab"
        )
        .forEach(
            tab => {

                tab.classList.toggle(
                    "active",
                    tab.dataset.tab === tabName
                );

            }
        );

    renderExchangeRequests(
        tabName
    );
}


/* =====================================================
   GET REQUESTS FOR TAB
   ===================================================== */

function getRequestsForTab(
    tabName
) {

    const currentUserId =
        getCurrentUser();

    if (!currentUserId) {
        return [];
    }

    if (tabName === "sent") {

        return getSentExchangeRequests(
            currentUserId
        );
    }

    if (tabName === "received") {

        return getReceivedExchangeRequests(
            currentUserId
        );
    }

    return getExchangeRequestsForUser(
        currentUserId
    );
}


/* =====================================================
   RENDER EXCHANGE REQUESTS
   ===================================================== */

function renderExchangeRequests(
    tabName = "received"
) {

    const container =
        document.getElementById(
            "exchangeResults"
        );

    const emptyState =
        document.getElementById(
            "exchangeEmpty"
        );

    if (!container) {
        return;
    }

    const requests =
        getRequestsForTab(
            tabName
        );

    const sortedRequests =
        [...requests].sort(
            (a, b) =>
                new Date(b.createdAt) -
                new Date(a.createdAt)
        );

    container.innerHTML = "";

    if (sortedRequests.length === 0) {

        container.style.display =
            "none";

        if (emptyState) {
            emptyState.style.display =
                "block";
        }

        return;
    }

    container.style.display =
        "grid";

    if (emptyState) {
        emptyState.style.display =
            "none";
    }

    sortedRequests.forEach(
        request => {

            container.appendChild(
                createExchangeRequestCard(
                    request
                )
            );

        }
    );
}


/* =====================================================
   CREATE EXCHANGE CARD
   ===================================================== */

function createExchangeRequestCard(
    request
) {

    const currentUserId =
        getCurrentUser();

    const isSender =
        request.senderId ===
        currentUserId;

    const otherUserId =
        isSender
            ? request.receiverId
            : request.senderId;

    const otherUser =
        getData(
            STORAGE_KEYS.USERS,
            []
        ).find(
            user =>
                user.id === otherUserId
        );

    const otherProfile =
        getUserProfile(
            otherUserId
        );

    const card =
        document.createElement(
            "article"
        );

    card.className =
        "exchange-card";

    const memberName =
        otherUser
            ? otherUser.name
            : "Unknown Member";

    const location =
        otherProfile?.location ||
        "";

    const directionText =
        request.exchangeType === "learn"
            ? "Wants to learn"
            : "Offers to teach";

    const statusClass =
        getExchangeStatusClass(
            request.status
        );

    const statusLabel =
        getExchangeStatusLabel(
            request.status
        );

    const canRespond =
        !isSender &&
        request.status === "pending";

    const canCancel =
        isSender &&
        request.status === "pending";

    card.innerHTML = `

        <div class="exchange-card-header">

            <div class="exchange-member">

                <div class="exchange-avatar">
                    ${escapeHtml(
                        getInitials(
                            memberName
                        )
                    )}
                </div>

                <div>

                    <h3>
                        ${escapeHtml(
                            memberName
                        )}
                    </h3>

                    ${
                        location
                            ? `
                                <span class="exchange-location">
                                    ${escapeHtml(
                                        location
                                    )}
                                </span>
                            `
                            : ""
                    }

                </div>

            </div>

            <span
                class="exchange-status ${statusClass}"
            >
                ${statusLabel}
            </span>

        </div>


        <div class="exchange-card-body">

            <div class="exchange-skill">

                <span class="exchange-label">
                    Skill
                </span>

                <strong>
                    ${escapeHtml(
                        request.skillName
                    )}
                </strong>

            </div>


            <div class="exchange-direction">

                <span class="exchange-label">
                    Exchange Type
                </span>

                <span>
                    ${directionText}
                </span>

            </div>


            ${
                request.message
                    ? `
                        <div class="exchange-message">

                            <span class="exchange-label">
                                Message
                            </span>

                            <p>
                                ${escapeHtml(
                                    request.message
                                )}
                            </p>

                        </div>
                    `
                    : ""
            }


            <div class="exchange-meta">

                <span>
                    ${
                        isSender
                            ? "Sent to"
                            : "Received from"
                    }
                    ${escapeHtml(
                        memberName
                    )}
                </span>

                <span>
                    ${formatExchangeDate(
                        request.createdAt
                    )}
                </span>

            </div>

        </div>


        <div class="exchange-card-footer">

            ${
                canRespond
                    ? `
                        <button
                            type="button"
                            class="btn btn-primary exchange-action"
                            data-action="accept"
                            data-request-id="${escapeHtml(
                                request.id
                            )}"
                        >
                            Accept
                        </button>

                        <button
                            type="button"
                            class="btn btn-outline exchange-action"
                            data-action="reject"
                            data-request-id="${escapeHtml(
                                request.id
                            )}"
                        >
                            Reject
                        </button>
                    `
                    : ""
            }

            ${
                canCancel
                    ? `
                        <button
                            type="button"
                            class="btn btn-outline exchange-action"
                            data-action="cancel"
                            data-request-id="${escapeHtml(
                                request.id
                            )}"
                        >
                            Cancel Request
                        </button>
                    `
                    : ""
            }

            ${
                request.status === "accepted"
                    ? `
                        <span class="exchange-success-text">
                            ✓ Exchange accepted
                        </span>
                    `
                    : ""
            }

            ${
                request.status === "rejected"
                    ? `
                        <span class="exchange-rejected-text">
                            Request declined
                        </span>
                    `
                    : ""
            }

        </div>

    `;

    card
        .querySelectorAll(
            ".exchange-action"
        )
        .forEach(
            button => {

                button.addEventListener(
                    "click",
                    handleExchangeAction
                );

            }
        );

    return card;
}


/* =====================================================
   HANDLE EXCHANGE ACTION
   ===================================================== */

function handleExchangeAction(
    event
) {

    const button =
        event.currentTarget;

    const action =
        button.dataset.action;

    const requestId =
        button.dataset.requestId;

    if (!requestId) {
        return;
    }

    if (action === "accept") {

        if (
            updateExchangeRequestStatus(
                requestId,
                "accepted"
            )
        ) {

            loadExchangeStatistics();

            renderExchangeRequests(
                currentExchangeTab
            );

            showAppMessage(
                "Exchange request accepted.",
                "success"
            );
        }

        return;
    }

    if (action === "reject") {

        if (
            updateExchangeRequestStatus(
                requestId,
                "rejected"
            )
        ) {

            loadExchangeStatistics();

            renderExchangeRequests(
                currentExchangeTab
            );

            showAppMessage(
                "Exchange request rejected.",
                "success"
            );
        }

        return;
    }

    if (action === "cancel") {

        if (
            deleteExchangeRequest(
                requestId
            )
        ) {

            loadExchangeStatistics();

            renderExchangeRequests(
                currentExchangeTab
            );

            showAppMessage(
                "Exchange request cancelled.",
                "success"
            );
        }
    }
}


/* =====================================================
   EXCHANGE STATUS
   ===================================================== */

function getExchangeStatusClass(
    status
) {

    if (status === "accepted") {
        return "status-accepted";
    }

    if (status === "rejected") {
        return "status-rejected";
    }

    return "status-pending";
}


function getExchangeStatusLabel(
    status
) {

    if (status === "accepted") {
        return "Accepted";
    }

    if (status === "rejected") {
        return "Rejected";
    }

    return "Pending";
}


/* =====================================================
   EXCHANGE DATE
   ===================================================== */

function formatExchangeDate(
    dateString
) {

    if (!dateString) {
        return "";
    }

    const date =
        new Date(dateString);

    if (
        Number.isNaN(
            date.getTime()
        )
    ) {
        return "";
    }

    return date.toLocaleDateString(
        "en-IN",
        {
            day: "numeric",
            month: "short",
            year: "numeric"
        }
    );
}


/* =====================================================
   GET INITIALS
   ===================================================== */

function getInitials(name) {

    if (!name) {
        return "?";
    }

    const parts =
        name
            .trim()
            .split(/\s+/)
            .filter(Boolean);

    if (parts.length === 1) {

        return parts[0]
            .substring(0, 2)
            .toUpperCase();
    }

    return (
        parts[0][0] +
        parts[parts.length - 1][0]
    ).toUpperCase();
}


/* =====================================================
   APPLICATION MESSAGE
   ===================================================== */

function showAppMessage(
    message,
    type = "success"
) {

    let messageContainer =
        document.getElementById(
            "appMessage"
        );

    if (!messageContainer) {

        messageContainer =
            document.createElement(
                "div"
            );

        messageContainer.id =
            "appMessage";

        document.body.appendChild(
            messageContainer
        );
    }

    messageContainer.className =
        `app-message ${type}`;

    messageContainer.textContent =
        message;

    messageContainer.style.display =
        "block";

    window.clearTimeout(
        window.appMessageTimer
    );

    window.appMessageTimer =
        window.setTimeout(
            () => {

                messageContainer.style.display =
                    "none";

            },
            3000
        );
}


/* =====================================================
   EXCHANGE PAGE INITIALIZATION
   ===================================================== */

function initializeExchangePage() {

    const exchangeResults =
        document.getElementById(
            "exchangeResults"
        );

    if (!exchangeResults) {
        return;
    }

    loadExchangePage();
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

        if (
            document.getElementById(
                "profileName"
            )
        ) {

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


        /* ---------------------------------------------
           Skills
        --------------------------------------------- */

        const skillForm =
            document.getElementById(
                "skillForm"
            );

        if (skillForm) {

            skillForm.addEventListener(
                "submit",
                handleSkillSubmit
            );

            loadSkillsPage();
        }


        /* ---------------------------------------------
           Discovery
        --------------------------------------------- */

        if (
            document.getElementById(
                "discoverResults"
            )
        ) {

            loadDiscoveryPage();
        }


        /* ---------------------------------------------
           Matching
        --------------------------------------------- */

        if (
            document.getElementById(
                "matchesResults"
            )
        ) {

            loadMatchesPage();
        }


        /* ---------------------------------------------
           Knowledge Exchange
        --------------------------------------------- */

        if (
            document.getElementById(
                "exchangeResults"
            )
        ) {

            initializeExchangePage();
        }

    }
);
/* =====================================================
   PHASE 7
   GOALS PAGE
   ===================================================== */

let currentGoalFilter = "all";


function loadGoalsPage() {

    if (!isLoggedIn()) {
        return;
    }

    setupGoalEvents();

    renderGoals();
}


function setupGoalEvents() {

    const addGoalBtn =
        document.getElementById("addGoalBtn");

    const emptyAddGoalBtn =
        document.getElementById("emptyAddGoalBtn");

    const closeGoalModal =
        document.getElementById("closeGoalModal");

    const cancelGoalBtn =
        document.getElementById("cancelGoalBtn");

    const goalForm =
        document.getElementById("goalForm");

    const goalFilter =
        document.getElementById("goalFilter");

    const progressInput =
        document.getElementById("goalProgress");


    if (addGoalBtn) {

        addGoalBtn.addEventListener(
            "click",
            () => openGoalModal()
        );
    }


    if (emptyAddGoalBtn) {

        emptyAddGoalBtn.addEventListener(
            "click",
            () => openGoalModal()
        );
    }


    if (closeGoalModal) {

        closeGoalModal.addEventListener(
            "click",
            closeGoalModalWindow
        );
    }


    if (cancelGoalBtn) {

        cancelGoalBtn.addEventListener(
            "click",
            closeGoalModalWindow
        );
    }


    if (goalForm) {

        goalForm.addEventListener(
            "submit",
            handleGoalSubmit
        );
    }


    if (goalFilter) {

        goalFilter.addEventListener(
            "change",
            event => {

                currentGoalFilter =
                    event.target.value;

                renderGoals();
            }
        );
    }


    if (progressInput) {

        progressInput.addEventListener(
            "input",
            event => {

                const progressValue =
                    document.getElementById(
                        "progressValue"
                    );

                if (progressValue) {

                    progressValue.textContent =
                        `${event.target.value}%`;
                }
            }
        );
    }


    const modal =
        document.getElementById("goalModal");

    if (modal) {

        modal.addEventListener(
            "click",
            event => {

                if (event.target === modal) {

                    closeGoalModalWindow();
                }
            }
        );
    }
}


/* =====================================================
   OPEN GOAL MODAL
   ===================================================== */

function openGoalModal(goal = null) {

    const modal =
        document.getElementById("goalModal");

    const modalTitle =
        document.getElementById("goalModalTitle");

    const goalForm =
        document.getElementById("goalForm");

    if (!modal || !goalForm) {
        return;
    }


    goalForm.reset();


    document.getElementById(
        "goalId"
    ).value = "";


    document.getElementById(
        "goalProgress"
    ).value = 0;


    document.getElementById(
        "progressValue"
    ).textContent = "0%";


    if (goal) {

        modalTitle.textContent =
            "Edit Learning Goal";


        document.getElementById(
            "goalId"
        ).value = goal.id;


        document.getElementById(
            "goalTitle"
        ).value = goal.title;


        document.getElementById(
            "goalDescription"
        ).value = goal.description;


        document.getElementById(
            "goalCategory"
        ).value = goal.category;


        document.getElementById(
            "goalTargetDate"
        ).value = goal.targetDate;


        document.getElementById(
            "goalProgress"
        ).value = goal.progress;


        document.getElementById(
            "progressValue"
        ).textContent =
            `${goal.progress}%`;

    } else {

        modalTitle.textContent =
            "Create Learning Goal";
    }


    modal.style.display = "flex";
}


/* =====================================================
   CLOSE GOAL MODAL
   ===================================================== */

function closeGoalModalWindow() {

    const modal =
        document.getElementById("goalModal");

    if (modal) {

        modal.style.display = "none";
    }
}


/* =====================================================
   SAVE GOAL
   ===================================================== */

function handleGoalSubmit(event) {

    event.preventDefault();


    const currentUserId =
        getCurrentUser();


    if (!currentUserId) {

        showAppMessage(
            "Please login first.",
            "error"
        );

        return;
    }


    const goalId =
        document.getElementById(
            "goalId"
        ).value;


    const title =
        document.getElementById(
            "goalTitle"
        ).value.trim();


    const description =
        document.getElementById(
            "goalDescription"
        ).value.trim();


    const category =
        document.getElementById(
            "goalCategory"
        ).value;


    const targetDate =
        document.getElementById(
            "goalTargetDate"
        ).value;


    const progress =
        Number(
            document.getElementById(
                "goalProgress"
            ).value
        );


    if (!title) {

        showAppMessage(
            "Please enter a goal title.",
            "error"
        );

        return;
    }


    if (!category) {

        showAppMessage(
            "Please select a category.",
            "error"
        );

        return;
    }


    if (goalId) {

        const saved =
            updateGoal(
                goalId,
                {
                    title,
                    description,
                    category,
                    targetDate,
                    progress,
                    status:
                        progress === 100
                            ? "completed"
                            : "active"
                }
            );


        if (!saved) {

            showAppMessage(
                "Unable to update goal.",
                "error"
            );

            return;
        }


        showAppMessage(
            "Goal updated successfully.",
            "success"
        );

    } else {

        const goal =
            createGoal(
                currentUserId,
                title,
                description,
                category,
                targetDate
            );


        if (!goal) {

            showAppMessage(
                "Unable to create goal.",
                "error"
            );

            return;
        }


        if (progress > 0) {

            updateGoal(
                goal.id,
                {
                    progress,
                    status:
                        progress === 100
                            ? "completed"
                            : "active"
                }
            );
        }


        showAppMessage(
            "Goal created successfully.",
            "success"
        );
    }


    closeGoalModalWindow();

    renderGoals();
}


/* =====================================================
   RENDER GOALS
   ===================================================== */

function renderGoals() {

    const currentUserId =
        getCurrentUser();

    if (!currentUserId) {
        return;
    }


    const container =
        document.getElementById(
            "goalsContainer"
        );

    const emptyState =
        document.getElementById(
            "emptyGoals"
        );


    if (!container) {
        return;
    }


    const goals =
        getUserGoals(currentUserId);


    updateGoalStatistics(goals);


    let filteredGoals =
        goals;


    if (
        currentGoalFilter !== "all"
    ) {

        filteredGoals =
            goals.filter(
                goal =>
                    goal.status ===
                    currentGoalFilter
            );
    }


    if (
        filteredGoals.length === 0
    ) {

        container.innerHTML = "";

        if (emptyState) {

            emptyState.style.display =
                "block";
        }

        return;
    }


    if (emptyState) {

        emptyState.style.display =
            "none";
    }


    container.innerHTML =
        filteredGoals
            .sort(
                (a, b) =>
                    new Date(b.createdAt) -
                    new Date(a.createdAt)
            )
            .map(
                goal =>
                    createGoalCard(goal)
            )
            .join("");
}


/* =====================================================
   GOAL CARD
   ===================================================== */

function createGoalCard(goal) {

    const progress =
        Number(goal.progress) || 0;


    const targetDate =
        goal.targetDate
            ? formatGoalDate(
                goal.targetDate
            )
            : "No target date";


    return `
        <article class="card goal-card">

            <div class="goal-card-header">

                <div>

                    <span class="badge">
                        ${escapeHtml(goal.category)}
                    </span>

                    <h3>
                        ${escapeHtml(goal.title)}
                    </h3>

                </div>

                <span class="status-badge ${getGoalStatusClass(goal.status)}">
                    ${getGoalStatusLabel(goal.status)}
                </span>

            </div>


            <p class="goal-description">
                ${escapeHtml(
                    goal.description ||
                    "No description provided."
                )}
            </p>


            <div class="goal-progress">

                <div class="progress-header">

                    <span>
                        Progress
                    </span>

                    <strong>
                        ${progress}%
                    </strong>

                </div>


                <div class="progress-bar">

                    <div
                        class="progress-fill"
                        style="width: ${progress}%"
                    ></div>

                </div>

            </div>


            <div class="goal-meta">

                <span>
                    Target: ${targetDate}
                </span>

            </div>


            <div class="goal-actions">

                <button
                    type="button"
                    class="btn btn-secondary"
                    onclick="editGoal('${goal.id}')"
                >
                    Edit
                </button>

                ${
                    goal.status === "active"
                        ? `
                            <button
                                type="button"
                                class="btn btn-success"
                                onclick="completeGoal('${goal.id}')"
                            >
                                Complete
                            </button>
                        `
                        : ""
                }

                <button
                    type="button"
                    class="btn btn-danger"
                    onclick="removeGoal('${goal.id}')"
                >
                    Delete
                </button>

            </div>

        </article>
    `;
}


/* =====================================================
   EDIT GOAL
   ===================================================== */

function editGoal(goalId) {

    const currentUserId =
        getCurrentUser();

    const goals =
        getUserGoals(currentUserId);


    const goal =
        goals.find(
            item =>
                item.id === goalId
        );


    if (!goal) {

        showAppMessage(
            "Goal not found.",
            "error"
        );

        return;
    }


    openGoalModal(goal);
}


/* =====================================================
   COMPLETE GOAL
   ===================================================== */

function completeGoal(goalId) {

    const updated =
        updateGoal(
            goalId,
            {
                progress: 100,
                status: "completed"
            }
        );


    if (!updated) {

        showAppMessage(
            "Unable to complete goal.",
            "error"
        );

        return;
    }


    showAppMessage(
        "Goal completed! Great work.",
        "success"
    );


    renderGoals();
}


/* =====================================================
   DELETE GOAL
   ===================================================== */

function removeGoal(goalId) {

    const confirmed =
        confirm(
            "Are you sure you want to delete this goal?"
        );


    if (!confirmed) {
        return;
    }


    const deleted =
        deleteGoal(goalId);


    if (!deleted) {

        showAppMessage(
            "Unable to delete goal.",
            "error"
        );

        return;
    }


    showAppMessage(
        "Goal deleted successfully.",
        "success"
    );


    renderGoals();
}


/* =====================================================
   GOAL STATISTICS
   ===================================================== */

function updateGoalStatistics(goals) {

    const total =
        goals.length;


    const active =
        goals.filter(
            goal =>
                goal.status === "active"
        ).length;


    const completed =
        goals.filter(
            goal =>
                goal.status === "completed"
        ).length;


    const average =
        total === 0
            ? 0
            : Math.round(
                goals.reduce(
                    (sum, goal) =>
                        sum +
                        Number(
                            goal.progress
                        ),
                    0
                ) / total
            );


    const totalElement =
        document.getElementById(
            "totalGoals"
        );

    const activeElement =
        document.getElementById(
            "activeGoals"
        );

    const completedElement =
        document.getElementById(
            "completedGoals"
        );

    const averageElement =
        document.getElementById(
            "averageProgress"
        );


    if (totalElement) {
        totalElement.textContent =
            total;
    }

    if (activeElement) {
        activeElement.textContent =
            active;
    }

    if (completedElement) {
        completedElement.textContent =
            completed;
    }

    if (averageElement) {
        averageElement.textContent =
            `${average}%`;
    }
}


/* =====================================================
   GOAL HELPERS
   ===================================================== */

function getGoalStatusClass(status) {

    if (status === "completed") {
        return "status-success";
    }

    if (status === "paused") {
        return "status-warning";
    }

    return "status-active";
}


function getGoalStatusLabel(status) {

    if (status === "completed") {
        return "Completed";
    }

    if (status === "paused") {
        return "Paused";
    }

    return "Active";
}


function formatGoalDate(dateString) {

    if (!dateString) {
        return "No target date";
    }


    const date =
        new Date(
            `${dateString}T00:00:00`
        );


    if (Number.isNaN(date.getTime())) {
        return dateString;
    }


    return date.toLocaleDateString(
        "en-IN",
        {
            day: "2-digit",
            month: "short",
            year: "numeric"
        }
    );
}
/* =====================================================
   PHASE 9
   DASHBOARD
   ===================================================== */

function loadDashboardPage() {

    if (!isLoggedIn()) {
        return;
    }

    loadDashboardUser();

    loadDashboardStatistics();

    loadDashboardProgress();

    loadProfileCompletion();

    loadCommunityStatistics();

    loadRecentActivities();

    loadDashboardGoals();
}


/* =====================================================
   USER WELCOME
   ===================================================== */

function loadDashboardUser() {

    const currentUserId =
        getCurrentUser();

    const users =
        getData(
            STORAGE_KEYS.USERS,
            []
        );

    const user =
        users.find(
            item =>
                item.id === currentUserId
        );


    const welcome =
        document.getElementById(
            "dashboardWelcome"
        );


    if (!welcome) {
        return;
    }


    const name =
        user?.name ||
        user?.username ||
        "Learner";


    welcome.textContent =
        `Welcome back, ${name}!`;
}


/* =====================================================
   DASHBOARD STATISTICS
   ===================================================== */

function loadDashboardStatistics() {

    const userId =
        getCurrentUser();


    const skills =
        getUserSkills(userId);


    const goals =
        getUserGoals(userId);


    const activities =
        getUserActivities(userId);


    const activeGoals =
        goals.filter(
            goal =>
                goal.status === "active"
        );


    const totalMinutes =
        activities.reduce(
            (sum, activity) =>
                sum +
                (Number(
                    activity.duration
                ) || 0),
            0
        );


    const hours =
        Math.floor(
            totalMinutes / 60
        );


    const minutes =
        totalMinutes % 60;


    const skillsElement =
        document.getElementById(
            "dashboardSkills"
        );


    const goalsElement =
        document.getElementById(
            "dashboardGoals"
        );


    const activitiesElement =
        document.getElementById(
            "dashboardActivities"
        );


    const timeElement =
        document.getElementById(
            "dashboardLearningTime"
        );


    if (skillsElement) {
        skillsElement.textContent =
            skills.length;
    }


    if (goalsElement) {
        goalsElement.textContent =
            activeGoals.length;
    }


    if (activitiesElement) {
        activitiesElement.textContent =
            activities.length;
    }


    if (timeElement) {

        timeElement.textContent =
            `${hours}h ${minutes}m`;
    }
}


/* =====================================================
   OVERALL GOAL PROGRESS
   ===================================================== */

function loadDashboardProgress() {

    const userId =
        getCurrentUser();


    const goals =
        getUserGoals(userId);


    if (goals.length === 0) {

        updateDashboardProgress(
            0,
            "Create your first learning goal to start tracking progress."
        );

        return;
    }


    const totalProgress =
        goals.reduce(
            (sum, goal) =>
                sum +
                Number(goal.progress || 0),
            0
        );


    const averageProgress =
        Math.round(
            totalProgress /
            goals.length
        );


    let message =
        "Keep going. Every learning session counts!";


    if (averageProgress === 0) {

        message =
            "Start working on your goals to build your learning progress.";

    } else if (averageProgress < 50) {

        message =
            "You're making progress. Keep building your skills!";

    } else if (averageProgress < 100) {

        message =
            "Great progress! You're getting closer to your goals.";

    } else {

        message =
            "Excellent! You've completed all your current goals.";
    }


    updateDashboardProgress(
        averageProgress,
        message
    );
}


/* =====================================================
   UPDATE PROGRESS UI
   ===================================================== */

function updateDashboardProgress(
    progress,
    message
) {

    const progressText =
        document.getElementById(
            "overallProgress"
        );


    const progressBar =
        document.getElementById(
            "dashboardProgressBar"
        );


    const progressMessage =
        document.getElementById(
            "progressMessage"
        );


    const circle =
        document.getElementById(
            "overallProgressCircle"
        );


    if (progressText) {

        progressText.textContent =
            `${progress}%`;
    }


    if (progressBar) {

        progressBar.style.width =
            `${progress}%`;
    }


    if (progressMessage) {

        progressMessage.textContent =
            message;
    }


    if (circle) {

        circle.style.setProperty(
            "--progress",
            `${progress}%`
        );
    }
}


/* =====================================================
   PROFILE COMPLETION
   ===================================================== */

function loadProfileCompletion() {

    const userId =
        getCurrentUser();


    const profile =
        getUserProfile(userId);


    const skills =
        getUserSkills(userId);


    const users =
        getData(
            STORAGE_KEYS.USERS,
            []
        );


    const user =
        users.find(
            item =>
                item.id === userId
        );


    const checks = [

        {
            label: "Name added",
            complete:
                Boolean(user?.name)
        },

        {
            label: "Email added",
            complete:
                Boolean(user?.email)
        },

        {
            label: "Bio added",
            complete:
                Boolean(profile?.bio)
        },

        {
            label: "Location added",
            complete:
                Boolean(profile?.location)
        },

        {
            label: "Education added",
            complete:
                Boolean(profile?.education)
        },

        {
            label: "At least one skill added",
            complete:
                skills.length > 0
        }

    ];


    const completed =
        checks.filter(
            item =>
                item.complete
        ).length;


    const percentage =
        Math.round(
            (completed /
                checks.length) *
            100
        );


    const progressBar =
        document.getElementById(
            "profileProgressBar"
        );


    const percentageElement =
        document.getElementById(
            "profileCompletion"
        );


    const checklist =
        document.getElementById(
            "profileChecklist"
        );


    if (progressBar) {

        progressBar.style.width =
            `${percentage}%`;
    }


    if (percentageElement) {

        percentageElement.textContent =
            `${percentage}%`;
    }


    if (checklist) {

        checklist.innerHTML =
            checks.map(
                item => `
                    <li class="${
                        item.complete
                            ? "completed"
                            : ""
                    }">

                        <span>
                            ${
                                item.complete
                                    ? "✓"
                                    : "○"
                            }
                        </span>

                        ${item.label}

                    </li>
                `
            ).join("");
    }
}


/* =====================================================
   COMMUNITY STATISTICS
   ===================================================== */

function loadCommunityStatistics() {

    const userId =
        getCurrentUser();


    const exchangeRequests =
        getExchangeRequestsForUser(
            userId
        );


    const matches =
        getSkillMatches(
            userId
        );


    const matchesElement =
        document.getElementById(
            "dashboardMatches"
        );


    const requestsElement =
        document.getElementById(
            "dashboardExchangeRequests"
        );


    if (matchesElement) {

        matchesElement.textContent =
            matches.length;
    }


    if (requestsElement) {

        requestsElement.textContent =
            exchangeRequests.length;
    }
}


/* =====================================================
   RECENT ACTIVITIES
   ===================================================== */

function loadRecentActivities() {

    const userId =
        getCurrentUser();


    const activities =
        getUserActivities(userId);


    const container =
        document.getElementById(
            "recentActivities"
        );


    const emptyState =
        document.getElementById(
            "noRecentActivities"
        );


    if (!container) {
        return;
    }


    const recent =
        activities
            .sort(
                (a, b) =>
                    new Date(
                        b.activityDate
                    ) -
                    new Date(
                        a.activityDate
                    )
            )
            .slice(0, 5);


    if (recent.length === 0) {

        container.innerHTML = "";


        if (emptyState) {

            emptyState.style.display =
                "block";
        }

        return;
    }


    if (emptyState) {

        emptyState.style.display =
            "none";
    }


    container.innerHTML =
        recent.map(
            activity => `

                <div class="dashboard-activity">

                    <div>

                        <strong>
                            ${escapeHtml(
                                activity.title
                            )}
                        </strong>

                        <span>
                            ${escapeHtml(
                                activity.type
                            )}
                        </span>

                    </div>

                    <div>

                        <span>
                            ${formatActivityDate(
                                activity.activityDate
                            )}
                        </span>

                        <span>
                            ${Number(
                                activity.duration || 0
                            )} min
                        </span>

                    </div>

                </div>

            `
        ).join("");
}


/* =====================================================
   ACTIVE GOALS
   ===================================================== */

function loadDashboardGoals() {

    const userId =
        getCurrentUser();


    const goals =
        getUserGoals(userId);


    const activeGoals =
        goals
            .filter(
                goal =>
                    goal.status === "active"
            )
            .sort(
                (a, b) =>
                    Number(b.progress) -
                    Number(a.progress)
            )
            .slice(0, 4);


    const container =
        document.getElementById(
            "dashboardGoalsList"
        );


    if (!container) {
        return;
    }


    if (activeGoals.length === 0) {

        container.innerHTML = `

            <div class="empty-state">

                <h3>
                    No active goals
                </h3>

                <p>
                    Create a learning goal to start tracking your progress.
                </p>

                <a
                    href="goals.html"
                    class="btn btn-primary"
                >
                    Create Goal
                </a>

            </div>

        `;

        return;
    }


    container.innerHTML =
        activeGoals.map(
            goal => `

                <article class="card goal-summary">

                    <span class="badge">
                        ${escapeHtml(
                            goal.category
                        )}
                    </span>

                    <h3>
                        ${escapeHtml(
                            goal.title
                        )}
                    </h3>

                    <div class="progress-header">

                        <span>
                            Progress
                        </span>

                        <strong>
                            ${Number(
                                goal.progress || 0
                            )}%
                        </strong>

                    </div>

                    <div class="progress-bar">

                        <div
                            class="progress-fill"
                            style="width: ${
                                Number(
                                    goal.progress || 0
                                )
                            }%"
                        ></div>

                    </div>

                </article>

            `
        ).join("");
}
/* =====================================================
   PHASE 10
   ACHIEVEMENTS & BADGES
   ===================================================== */

function loadAchievementsPage() {

    if (!isLoggedIn()) {
        return;
    }

    const userId = getCurrentUser();

    checkAchievementsForCurrentUser(userId);

    renderAchievements(userId);
}


function checkAchievementsForCurrentUser(userId) {

    if (!userId) {
        return;
    }

    const definitions = getAchievementDefinitions();

    definitions.forEach(definition => {

        if (hasAchievement(userId, definition.id)) {
            return;
        }

        const progress = getAchievementProgress(
            definition,
            userId
        );

        if (progress.current >= definition.target) {

            awardAchievement(
                userId,
                definition.id
            );
        }

    });
}


function getAchievementProgress(
    definition,
    userId
) {

    const skills = getUserSkills(userId);

    const goals = getUserGoals(userId);

    const activities = getUserActivities(userId);

    const exchangeRequests =
        getSentExchangeRequests(userId);

    let current = 0;

    switch (definition.id) {

        case "first_skill":

            current = skills.length;

            break;


        case "goal_setter":

            current = goals.length;

            break;


        case "first_activity":

            current = activities.length;

            break;


        case "activity_builder":

            current = activities.length;

            break;


        case "goal_achiever":

            current = goals.filter(
                goal => goal.status === "completed"
            ).length;

            break;


        case "community_connector":

            current = exchangeRequests.length;

            break;


        case "match_explorer":

            current = getSkillMatches(userId).length;

            break;


        case "dedicated_learner":

            current = activities.reduce(
                (total, activity) =>
                    total + (Number(activity.duration) || 0),
                0
            );

            break;


        default:

            current = 0;
    }

    return {
        current: current,
        target: definition.target,
        percentage: Math.min(
            100,
            Math.round(
                (current / definition.target) * 100
            )
        )
    };
}


function renderAchievements(userId) {

    const container =
        document.getElementById(
            "achievementsContainer"
        );

    if (!container) {
        return;
    }

    const definitions =
        getAchievementDefinitions();

    const earned =
        getUserAchievements(userId);

    const earnedIds =
        earned.map(
            achievement =>
                achievement.achievementId
        );


    const earnedCount =
        earned.length;

    const totalCount =
        definitions.length;

    const percentage =
        totalCount === 0
            ? 0
            : Math.round(
                (earnedCount / totalCount) * 100
            );


    const earnedElement =
        document.getElementById(
            "earnedAchievements"
        );

    const totalElement =
        document.getElementById(
            "totalAchievements"
        );

    const percentageElement =
        document.getElementById(
            "achievementPercentage"
        );


    if (earnedElement) {
        earnedElement.textContent =
            earnedCount;
    }

    if (totalElement) {
        totalElement.textContent =
            totalCount;
    }

    if (percentageElement) {
        percentageElement.textContent =
            `${percentage}%`;
    }


    container.innerHTML =
        definitions.map(definition => {

            const isEarned =
                earnedIds.includes(
                    definition.id
                );

            const progress =
                getAchievementProgress(
                    definition,
                    userId
                );

            const achievementRecord =
                earned.find(
                    item =>
                        item.achievementId ===
                        definition.id
                );


            return createAchievementCard(
                definition,
                progress,
                isEarned,
                achievementRecord
            );

        }).join("");
}


function createAchievementCard(
    definition,
    progress,
    isEarned,
    achievementRecord
) {

    const statusClass =
        isEarned
            ? "achievement-earned"
            : "achievement-locked";


    const statusText =
        isEarned
            ? "Unlocked"
            : "Locked";


    const earnedDate =
        achievementRecord
            ? new Date(
                achievementRecord.earnedAt
            ).toLocaleDateString()
            : "";


    return `
        <article
            class="card ${statusClass}"
            style="
                position: relative;
                overflow: hidden;
            "
        >

            <div
                style="
                    display: flex;
                    align-items: flex-start;
                    justify-content: space-between;
                    gap: 16px;
                "
            >

                <div
                    style="
                        font-size: 42px;
                        line-height: 1;
                        opacity: ${isEarned ? "1" : "0.45"};
                    "
                >
                    ${definition.icon}
                </div>


                <span class="badge">
                    ${statusText}
                </span>

            </div>


            <h3
                style="
                    margin-top: 18px;
                "
            >
                ${escapeHtml(
                    definition.title
                )}
            </h3>


            <p>
                ${escapeHtml(
                    definition.description
                )}
            </p>


            ${
                isEarned
                    ? `
                        <div
                            style="
                                margin-top: 14px;
                                font-size: 14px;
                            "
                        >
                            <strong>
                                Achievement unlocked!
                            </strong>

                            <br>

                            <span>
                                Earned on ${earnedDate}
                            </span>
                        </div>
                    `
                    : `
                        <div
                            style="
                                margin-top: 16px;
                            "
                        >

                            <div
                                style="
                                    display: flex;
                                    justify-content: space-between;
                                    margin-bottom: 6px;
                                    font-size: 14px;
                                "
                            >

                                <span>
                                    ${escapeHtml(
                                        definition.requirement
                                    )}
                                </span>

                                <strong>
                                    ${Math.min(
                                        progress.current,
                                        progress.target
                                    )}
                                    /
                                    ${progress.target}
                                </strong>

                            </div>


                            <div class="progress-bar">

                                <div
                                    class="progress-fill"
                                    style="
                                        width: ${progress.percentage}%;
                                    "
                                ></div>

                            </div>

                        </div>
                    `
            }

        </article>
    `;
}


/* =====================================================
   PHASE 10 INITIALIZATION
   ===================================================== */

if (
    document.getElementById(
        "achievementsContainer"
    )
) {
    loadAchievementsPage();
}
/* =====================================================
   PHASE 11
   ANALYTICS DASHBOARD
   ===================================================== */

let skillsCategoryChart = null;
let activityTypeChart = null;
let goalProgressChart = null;
let learningTrendChart = null;


/* -----------------------------------------------------
   LOAD ANALYTICS PAGE
   ----------------------------------------------------- */

function loadAnalyticsPage() {

    if (!isLoggedIn()) {
        return;
    }

    const userId = getCurrentUser();

    loadAnalyticsSummary(userId);

    renderSkillsCategoryChart(userId);

    renderActivityTypeChart(userId);

    renderGoalProgressChart(userId);

    renderLearningTrendChart(userId);

    renderAnalyticsInsights(userId);
}


/* -----------------------------------------------------
   SUMMARY
   ----------------------------------------------------- */

function loadAnalyticsSummary(userId) {

    const skills =
        getUserSkills(userId);

    const goals =
        getUserGoals(userId);

    const activities =
        getUserActivities(userId);


    const completedGoals =
        goals.filter(
            goal => goal.status === "completed"
        );


    const totalMinutes =
        activities.reduce(
            (total, activity) =>
                total +
                (Number(activity.duration) || 0),
            0
        );


    const hours =
        Math.floor(totalMinutes / 60);

    const minutes =
        totalMinutes % 60;


    const skillsElement =
        document.getElementById(
            "analyticsTotalSkills"
        );

    const goalsElement =
        document.getElementById(
            "analyticsTotalGoals"
        );

    const completedElement =
        document.getElementById(
            "analyticsCompletedGoals"
        );

    const timeElement =
        document.getElementById(
            "analyticsLearningTime"
        );


    if (skillsElement) {
        skillsElement.textContent =
            skills.length;
    }

    if (goalsElement) {
        goalsElement.textContent =
            goals.length;
    }

    if (completedElement) {
        completedElement.textContent =
            completedGoals.length;
    }

    if (timeElement) {
        timeElement.textContent =
            `${hours}h ${minutes}m`;
    }
}


/* -----------------------------------------------------
   SKILLS BY CATEGORY
   ----------------------------------------------------- */

function renderSkillsCategoryChart(userId) {

    const canvas =
        document.getElementById(
            "skillsCategoryChart"
        );

    if (!canvas || typeof Chart === "undefined") {
        return;
    }


    const skills =
        getUserSkills(userId);


    const categoryCounts = {};


    skills.forEach(skill => {

        const category =
            skill.category || "Other";

        categoryCounts[category] =
            (categoryCounts[category] || 0) + 1;

    });


    const labels =
        Object.keys(categoryCounts);


    const values =
        Object.values(categoryCounts);


    if (skillsCategoryChart) {
        skillsCategoryChart.destroy();
    }


    skillsCategoryChart =
        new Chart(canvas, {

            type: "doughnut",

            data: {

                labels: labels.length
                    ? labels
                    : ["No Skills"],

                datasets: [{

                    data: values.length
                        ? values
                        : [1]

                }]

            },

            options: {

                responsive: true,

                maintainAspectRatio: false,

                plugins: {

                    legend: {
                        position: "bottom"
                    }

                }

            }

        });
}


/* -----------------------------------------------------
   ACTIVITY TYPES
   ----------------------------------------------------- */

function renderActivityTypeChart(userId) {

    const canvas =
        document.getElementById(
            "activityTypeChart"
        );

    if (!canvas || typeof Chart === "undefined") {
        return;
    }


    const activities =
        getUserActivities(userId);


    const typeCounts = {};


    activities.forEach(activity => {

        const type =
            activity.type || "other";

        typeCounts[type] =
            (typeCounts[type] || 0) + 1;

    });


    const labels =
        Object.keys(typeCounts);


    const values =
        Object.values(typeCounts);


    if (activityTypeChart) {
        activityTypeChart.destroy();
    }


    activityTypeChart =
        new Chart(canvas, {

            type: "pie",

            data: {

                labels: labels.length
                    ? labels
                    : ["No Activities"],

                datasets: [{

                    data: values.length
                        ? values
                        : [1]

                }]

            },

            options: {

                responsive: true,

                maintainAspectRatio: false,

                plugins: {

                    legend: {
                        position: "bottom"
                    }

                }

            }

        });
}


/* -----------------------------------------------------
   GOAL PROGRESS
   ----------------------------------------------------- */

function renderGoalProgressChart(userId) {

    const canvas =
        document.getElementById(
            "goalProgressChart"
        );

    if (!canvas || typeof Chart === "undefined") {
        return;
    }


    const goals =
        getUserGoals(userId);


    const labels =
        goals.map(
            goal => goal.title
        );


    const values =
        goals.map(
            goal =>
                Number(goal.progress) || 0
        );


    if (goalProgressChart) {
        goalProgressChart.destroy();
    }


    goalProgressChart =
        new Chart(canvas, {

            type: "bar",

            data: {

                labels: labels.length
                    ? labels
                    : ["No Goals"],

                datasets: [{

                    label: "Progress (%)",

                    data: values.length
                        ? values
                        : [0]

                }]

            },

            options: {

                responsive: true,

                maintainAspectRatio: false,

                indexAxis: "y",

                scales: {

                    x: {

                        beginAtZero: true,

                        max: 100

                    }

                },

                plugins: {

                    legend: {
                        display: false
                    }

                }

            }

        });
}


/* -----------------------------------------------------
   LEARNING TREND
   ----------------------------------------------------- */

function renderLearningTrendChart(userId) {

    const canvas =
        document.getElementById(
            "learningTrendChart"
        );

    if (!canvas || typeof Chart === "undefined") {
        return;
    }


    const activities =
        getUserActivities(userId);


    const labels = [];

    const values = [];


    for (let i = 6; i >= 0; i--) {

        const date =
            new Date();

        date.setHours(
            0,
            0,
            0,
            0
        );

        date.setDate(
            date.getDate() - i
        );


        const dateKey =
            date.toISOString()
                .split("T")[0];


        labels.push(
            date.toLocaleDateString(
                undefined,
                {
                    weekday: "short"
                }
            )
        );


        const minutes =
            activities
                .filter(activity => {

                    const activityDate =
                        new Date(
                            activity.activityDate
                        );

                    return (
                        activityDate
                            .toISOString()
                            .split("T")[0] ===
                        dateKey
                    );

                })
                .reduce(
                    (total, activity) =>
                        total +
                        (Number(
                            activity.duration
                        ) || 0),
                    0
                );


        values.push(minutes);

    }


    if (learningTrendChart) {
        learningTrendChart.destroy();
    }


    learningTrendChart =
        new Chart(canvas, {

            type: "line",

            data: {

                labels: labels,

                datasets: [{

                    label:
                        "Learning Minutes",

                    data: values,

                    tension: 0.3,

                    fill: true

                }]

            },

            options: {

                responsive: true,

                maintainAspectRatio: false,

                scales: {

                    y: {

                        beginAtZero: true

                    }

                }

            }

        });
}


/* -----------------------------------------------------
   INSIGHTS
   ----------------------------------------------------- */

function renderAnalyticsInsights(userId) {

    const container =
        document.getElementById(
            "analyticsInsights"
        );

    if (!container) {
        return;
    }


    const skills =
        getUserSkills(userId);

    const goals =
        getUserGoals(userId);

    const activities =
        getUserActivities(userId);


    const completedGoals =
        goals.filter(
            goal => goal.status === "completed"
        );


    const totalMinutes =
        activities.reduce(
            (total, activity) =>
                total +
                (Number(activity.duration) || 0),
            0
        );


    const averageActivityTime =
        activities.length
            ? Math.round(
                totalMinutes /
                activities.length
            )
            : 0;


    const activeGoals =
        goals.filter(
            goal => goal.status === "active"
        );


    const highestProgressGoal =
        [...goals]
            .sort(
                (a, b) =>
                    Number(b.progress || 0) -
                    Number(a.progress || 0)
            )[0];


    const insights = [

        {
            title: "Skills Developed",
            value: skills.length,
            text:
                skills.length === 0
                    ? "Add your first skill to start building your learning profile."
                    : "Keep adding skills as you expand your knowledge."
        },


        {
            title: "Goal Completion",
            value:
                goals.length
                    ? `${Math.round(
                        (completedGoals.length /
                            goals.length) *
                        100
                    )}%`
                    : "0%",
            text:
                completedGoals.length
                    ? "Great work on completing your learning goals."
                    : "Keep working toward your learning goals."
        },


        {
            title: "Average Session",
            value:
                `${averageActivityTime} min`,
            text:
                activities.length
                    ? "This is your average recorded learning session."
                    : "Record activities to discover your learning pattern."
        },


        {
            title: "Active Goals",
            value: activeGoals.length,
            text:
                activeGoals.length
                    ? "You have active objectives to continue working on."
                    : "Create a new goal to continue your learning journey."
        },


        {
            title: "Top Goal",
            value:
                highestProgressGoal
                    ? `${Number(
                        highestProgressGoal.progress || 0
                    )}%`
                    : "—",
            text:
                highestProgressGoal
                    ? highestProgressGoal.title
                    : "Your most advanced goal will appear here."
        }

    ];


    container.innerHTML =
        insights.map(insight => `

            <article class="card">

                <h3>
                    ${escapeHtml(
                        insight.title
                    )}
                </h3>

                <div
                    style="
                        font-size: 28px;
                        font-weight: 700;
                        margin: 10px 0;
                    "
                >
                    ${escapeHtml(
                        String(insight.value)
                    )}
                </div>

                <p>
                    ${escapeHtml(
                        insight.text
                    )}
                </p>

            </article>

        `).join("");
}


/* =====================================================
   PHASE 11 INITIALIZATION
   ===================================================== */

if (
    document.getElementById(
        "skillsCategoryChart"
    )
) {
    loadAnalyticsPage();
}
/* =====================================================
   PHASE 12
   SMART RECOMMENDATIONS
   ===================================================== */


/* -----------------------------------------------------
   LOAD RECOMMENDATIONS PAGE
   ----------------------------------------------------- */

function loadRecommendationsPage() {

    if (!isLoggedIn()) {
        return;
    }

    const userId = getCurrentUser();

    const skills =
        generateSkillRecommendations(userId);

    const people =
        generatePeopleRecommendations(userId);

    const learning =
        generateLearningRecommendations(userId);

    const actions =
        generateNextActions(userId);


    renderSkillRecommendations(skills);

    renderPeopleRecommendations(people);

    renderLearningRecommendations(learning);

    renderNextActions(actions);


    updateRecommendationStatistics(
        skills,
        people,
        learning,
        actions
    );
}


/* -----------------------------------------------------
   SKILL RECOMMENDATIONS
   ----------------------------------------------------- */

function generateSkillRecommendations(userId) {

    const userSkills =
        getUserSkills(userId);


    const existingSkills =
        userSkills.map(skill =>
            normalizeSkillName(skill.name)
        );


    const skillLibrary = [

        {
            name: "JavaScript",
            category: "Programming",
            relatedTo: [
                "html",
                "css",
                "react",
                "web development"
            ]
        },

        {
            name: "React",
            category: "Web Development",
            relatedTo: [
                "javascript",
                "frontend",
                "web development"
            ]
        },

        {
            name: "Node.js",
            category: "Backend Development",
            relatedTo: [
                "javascript",
                "express",
                "backend"
            ]
        },

        {
            name: "Python",
            category: "Programming",
            relatedTo: [
                "programming",
                "machine learning",
                "data science"
            ]
        },

        {
            name: "SQL",
            category: "Database",
            relatedTo: [
                "database",
                "backend",
                "javascript",
                "python"
            ]
        },

        {
            name: "Git",
            category: "Development Tools",
            relatedTo: [
                "github",
                "programming",
                "software development"
            ]
        },

        {
            name: "GitHub",
            category: "Development Tools",
            relatedTo: [
                "git",
                "programming",
                "software development"
            ]
        },

        {
            name: "REST API",
            category: "Backend Development",
            relatedTo: [
                "javascript",
                "node.js",
                "backend"
            ]
        },

        {
            name: "Data Structures",
            category: "Computer Science",
            relatedTo: [
                "programming",
                "java",
                "python",
                "c++"
            ]
        },

        {
            name: "Machine Learning",
            category: "Artificial Intelligence",
            relatedTo: [
                "python",
                "data science",
                "artificial intelligence"
            ]
        }

    ];


    const recommendations = [];


    skillLibrary.forEach(skill => {

        const normalizedName =
            normalizeSkillName(
                skill.name
            );


        if (
            existingSkills.includes(
                normalizedName
            )
        ) {
            return;
        }


        let score = 0;

        let matchedSkill = "";


        userSkills.forEach(userSkill => {

            const userSkillName =
                normalizeSkillName(
                    userSkill.name
                );


            if (
                skill.relatedTo.includes(
                    userSkillName
                )
            ) {

                score += 2;

                matchedSkill =
                    userSkill.name;

            }

        });


        if (score > 0) {

            recommendations.push({

                ...skill,

                score: score,

                reason:
                    `Related to your skill ${
                        matchedSkill || "profile"
                    }.`

            });

        }

    });


    return recommendations
        .sort(
            (a, b) =>
                b.score - a.score
        )
        .slice(0, 6);
}


/* -----------------------------------------------------
   PEOPLE RECOMMENDATIONS
   ----------------------------------------------------- */

function generatePeopleRecommendations(userId) {

    const members =
        getDiscoveryMembers();


    const currentUserSkills =
        getUserSkills(userId);


    const currentSkillNames =
        currentUserSkills.map(skill =>
            normalizeSkillName(
                skill.name
            )
        );


    return members
        .filter(member =>
            member.userId !== userId
        )
        .map(member => {

            const memberSkills =
                getUserSkills(
                    member.userId
                );


            const matchingSkills =
                memberSkills.filter(skill => {

                    const memberSkillName =
                        normalizeSkillName(
                            skill.name
                        );


                    return currentSkillNames.some(
                        currentSkill =>
                            currentSkill ===
                            memberSkillName
                    );

                });


            const usefulSkills =
                memberSkills.filter(skill => {

                    const memberSkillName =
                        normalizeSkillName(
                            skill.name
                        );

                    return !currentSkillNames.includes(
                        memberSkillName
                    );

                });


            return {

                member: member,

                matchingSkills:
                    matchingSkills,

                usefulSkills:
                    usefulSkills,

                score:
                    matchingSkills.length * 2 +
                    usefulSkills.length

            };

        })
        .filter(item =>
            item.score > 0
        )
        .sort(
            (a, b) =>
                b.score - a.score
        )
        .slice(0, 6);
}


/* -----------------------------------------------------
   LEARNING RECOMMENDATIONS
   ----------------------------------------------------- */

function generateLearningRecommendations(userId) {

    const goals =
        getUserGoals(userId);


    const activities =
        getUserActivities(userId);


    const recommendations = [];


    const activeGoals =
        goals.filter(
            goal =>
                goal.status === "active"
        );


    if (activeGoals.length === 0) {

        recommendations.push({

            title: "Create a Learning Goal",

            description:
                "Set a clear learning objective so you can track your progress.",

            type: "Goal",

            link: "goals.html"

        });

    }


    if (activities.length === 0) {

        recommendations.push({

            title: "Record Your First Activity",

            description:
                "Start tracking courses, practice sessions, projects or reading.",

            type: "Activity",

            link: "activities.html"

        });

    }


    activeGoals.forEach(goal => {

        const progress =
            Number(
                goal.progress || 0
            );


        if (progress < 25) {

            recommendations.push({

                title:
                    `Start working on "${goal.title}"`,

                description:
                    "Your goal has low progress. Begin with a small learning session.",

                type: "Goal",

                link: "goals.html"

            });

        } else if (progress < 75) {

            recommendations.push({

                title:
                    `Continue "${goal.title}"`,

                description:
                    "You're making progress. Keep practicing consistently.",

                type: "Goal",

                link: "goals.html"

            });

        } else if (progress < 100) {

            recommendations.push({

                title:
                    `Finish "${goal.title}"`,

                description:
                    "You're close to completing this goal. Keep going!",

                type: "Goal",

                link: "goals.html"

            });

        }

    });


    if (activities.length >= 5) {

        recommendations.push({

            title: "Review Your Learning Pattern",

            description:
                "Use Analytics to understand which activities are helping you most.",

            type: "Analytics",

            link: "analytics.html"

        });

    }


    return recommendations.slice(0, 6);
}


/* -----------------------------------------------------
   NEXT ACTIONS
   ----------------------------------------------------- */

function generateNextActions(userId) {

    const skills =
        getUserSkills(userId);

    const goals =
        getUserGoals(userId);

    const activities =
        getUserActivities(userId);

    const actions = [];


    if (skills.length === 0) {

        actions.push({

            title: "Add Your First Skill",

            description:
                "Tell the community what you already know.",

            icon: "🌱",

            link: "skills.html"

        });

    }


    if (skills.length > 0) {

        actions.push({

            title: "Explore Skill Matches",

            description:
                "Find community members with compatible skills.",

            icon: "🔎",

            link: "matches.html"

        });

    }


    if (goals.length === 0) {

        actions.push({

            title: "Set a Learning Goal",

            description:
                "Create a measurable objective for your learning journey.",

            icon: "🎯",

            link: "goals.html"

        });

    }


    if (activities.length === 0) {

        actions.push({

            title: "Log a Learning Activity",

            description:
                "Record your first learning session.",

            icon: "📚",

            link: "activities.html"

        });

    }


    if (activities.length >= 3) {

        actions.push({

            title: "Check Your Analytics",

            description:
                "Review your learning trends and progress.",

            icon: "📊",

            link: "analytics.html"

        });

    }


    actions.push({

        title: "Explore the Community",

        description:
            "Discover people and skills around you.",

        icon: "👥",

        link: "discover.html"

    });


    return actions.slice(0, 6);
}


/* -----------------------------------------------------
   RENDER SKILL RECOMMENDATIONS
   ----------------------------------------------------- */

function renderSkillRecommendations(
    recommendations
) {

    const container =
        document.getElementById(
            "skillRecommendations"
        );


    if (!container) {
        return;
    }


    if (recommendations.length === 0) {

        container.innerHTML = `
            <div class="empty-state">

                <h3>
                    No skill suggestions yet
                </h3>

                <p>
                    Add more skills to your profile
                    to receive personalized suggestions.
                </p>

                <a
                    href="skills.html"
                    class="btn btn-primary"
                >
                    Add Skills
                </a>

            </div>
        `;

        return;
    }


    container.innerHTML =
        recommendations.map(skill => `

            <article class="card">

                <span class="badge">
                    ${escapeHtml(
                        skill.category
                    )}
                </span>

                <h3>
                    ${escapeHtml(
                        skill.name
                    )}
                </h3>

                <p>
                    ${escapeHtml(
                        skill.reason
                    )}
                </p>

                <a
                    href="skills.html"
                    class="btn btn-secondary"
                >
                    Add Skill
                </a>

            </article>

        `).join("");
}


/* -----------------------------------------------------
   RENDER PEOPLE RECOMMENDATIONS
   ----------------------------------------------------- */

function renderPeopleRecommendations(
    recommendations
) {

    const container =
        document.getElementById(
            "peopleRecommendations"
        );


    if (!container) {
        return;
    }


    if (recommendations.length === 0) {

        container.innerHTML = `
            <div class="empty-state">

                <h3>
                    No people recommendations yet
                </h3>

                <p>
                    Add skills and explore the
                    community to improve your matches.
                </p>

                <a
                    href="discover.html"
                    class="btn btn-primary"
                >
                    Discover Members
                </a>

            </div>
        `;

        return;
    }


    container.innerHTML =
        recommendations.map(item => {

            const member =
                item.member;


            const name =
                member.name ||
                member.username ||
                "Community Member";


            const usefulSkills =
                item.usefulSkills
                    .slice(0, 3)
                    .map(
                        skill =>
                            escapeHtml(
                                skill.name
                            )
                    )
                    .join(", ");


            return `

                <article class="card">

                    <div
                        style="
                            display: flex;
                            align-items: center;
                            gap: 14px;
                            margin-bottom: 14px;
                        "
                    >

                        <div
                            style="
                                width: 48px;
                                height: 48px;
                                border-radius: 50%;
                                display: flex;
                                align-items: center;
                                justify-content: center;
                                font-weight: 700;
                                background: #e2e8f0;
                            "
                        >
                            ${getInitials(name)}
                        </div>


                        <div>

                            <h3>
                                ${escapeHtml(name)}
                            </h3>

                            <span class="badge">
                                ${item.score}
                                compatibility
                            </span>

                        </div>

                    </div>


                    ${
                        usefulSkills
                            ? `
                                <p>
                                    Skills you may learn:
                                    <strong>
                                        ${usefulSkills}
                                    </strong>
                                </p>
                            `
                            : `
                                <p>
                                    You have compatible
                                    skills with this member.
                                </p>
                            `
                    }


                    <a
                        href="discover.html"
                        class="btn btn-secondary"
                    >
                        View Community
                    </a>

                </article>

            `;

        }).join("");
}


/* -----------------------------------------------------
   RENDER LEARNING RECOMMENDATIONS
   ----------------------------------------------------- */

function renderLearningRecommendations(
    recommendations
) {

    const container =
        document.getElementById(
            "learningRecommendations"
        );


    if (!container) {
        return;
    }


    if (recommendations.length === 0) {

        container.innerHTML = `
            <div class="empty-state">

                <h3>
                    You're doing great!
                </h3>

                <p>
                    Continue working on your current
                    goals and activities.
                </p>

            </div>
        `;

        return;
    }


    container.innerHTML =
        recommendations.map(item => `

            <article class="card">

                <span class="badge">
                    ${escapeHtml(
                        item.type
                    )}
                </span>

                <h3>
                    ${escapeHtml(
                        item.title
                    )}
                </h3>

                <p>
                    ${escapeHtml(
                        item.description
                    )}
                </p>

                <a
                    href="${item.link}"
                    class="btn btn-secondary"
                >
                    Take Action
                </a>

            </article>

        `).join("");
}


/* -----------------------------------------------------
   RENDER NEXT ACTIONS
   ----------------------------------------------------- */

function renderNextActions(actions) {

    const container =
        document.getElementById(
            "nextActions"
        );


    if (!container) {
        return;
    }


    container.innerHTML =
        actions.map(action => `

            <article class="card">

                <div
                    style="
                        font-size: 36px;
                        margin-bottom: 10px;
                    "
                >
                    ${action.icon}
                </div>

                <h3>
                    ${escapeHtml(
                        action.title
                    )}
                </h3>

                <p>
                    ${escapeHtml(
                        action.description
                    )}
                </p>

                <a
                    href="${action.link}"
                    class="btn btn-primary"
                >
                    Get Started
                </a>

            </article>

        `).join("");
}


/* -----------------------------------------------------
   UPDATE STATISTICS
   ----------------------------------------------------- */

function updateRecommendationStatistics(
    skills,
    people,
    learning,
    actions
) {

    const skillElement =
        document.getElementById(
            "recommendationSkillCount"
        );

    const peopleElement =
        document.getElementById(
            "recommendationPeopleCount"
        );

    const goalElement =
        document.getElementById(
            "recommendationGoalCount"
        );

    const totalElement =
        document.getElementById(
            "recommendationTotalCount"
        );


    if (skillElement) {
        skillElement.textContent =
            skills.length;
    }


    if (peopleElement) {
        peopleElement.textContent =
            people.length;
    }


    if (goalElement) {
        goalElement.textContent =
            learning.length;
    }


    if (totalElement) {
        totalElement.textContent =
            skills.length +
            people.length +
            learning.length +
            actions.length;
    }
}


/* =====================================================
   PHASE 12 INITIALIZATION
   ===================================================== */

if (
    document.getElementById(
        "skillRecommendations"
    )
) {
    loadRecommendationsPage();
}
/* =====================================================
   PHASE 13
   EXPORT DATA
   ===================================================== */

function downloadFile(content, fileName, type) {

    const blob = new Blob(
        [content],
        { type: type }
    );

    const url =
        URL.createObjectURL(blob);

    const link =
        document.createElement("a");

    link.href = url;
    link.download = fileName;

    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);

    URL.revokeObjectURL(url);
}


/* -----------------------------------------------------
   EXPORT JSON
   ----------------------------------------------------- */

function exportUserDataJSON() {

    if (!isLoggedIn()) {
        showAppMessage(
            "Please login first.",
            "error"
        );
        return;
    }

    const userId =
        getCurrentUser();

    const users =
        getData(
            STORAGE_KEYS.USERS,
            []
        );

    const user =
        users.find(
            item => item.id === userId
        );

    const profile =
        getUserProfile(userId);

    const skills =
        getUserSkills(userId);

    const goals =
        getUserGoals(userId);

    const activities =
        getUserActivities(userId);

    const achievements =
        getUserAchievements(userId);

    const exchangeRequests =
        getExchangeRequestsForUser(
            userId
        );


    const exportData = {

        exportedAt:
            new Date().toISOString(),

        platform:
            "Community-Skill-Exchange",

        user: user
            ? {
                id: user.id,
                name: user.name,
                email: user.email
            }
            : null,

        profile: profile,

        skills: skills,

        goals: goals,

        activities: activities,

        achievements: achievements,

        exchangeRequests:
            exchangeRequests

    };


    const json =
        JSON.stringify(
            exportData,
            null,
            2
        );


    downloadFile(
        json,
        "community-skill-exchange-data.json",
        "application/json"
    );


    showAppMessage(
        "Your data has been exported successfully.",
        "success"
    );
}


/* -----------------------------------------------------
   CSV HELPER
   ----------------------------------------------------- */

function convertToCSV(data) {

    if (!data || data.length === 0) {
        return "";
    }


    const headers =
        Object.keys(data[0]);


    const rows =
        data.map(item => {

            return headers.map(header => {

                let value =
                    item[header];

                if (
                    value === null ||
                    value === undefined
                ) {
                    value = "";
                }

                value =
                    String(value)
                        .replace(/"/g, '""');

                return `"${value}"`;

            }).join(",");

        });


    return [
        headers.join(","),
        ...rows
    ].join("\n");
}


/* -----------------------------------------------------
   EXPORT SKILLS CSV
   ----------------------------------------------------- */

function exportSkillsCSV() {

    const userId =
        getCurrentUser();

    if (!userId) {
        return;
    }


    const skills =
        getUserSkills(userId);


    if (skills.length === 0) {

        showAppMessage(
            "There are no skills to export.",
            "error"
        );

        return;
    }


    const csv =
        convertToCSV(skills);


    downloadFile(
        csv,
        "community-skills.csv",
        "text/csv"
    );


    showAppMessage(
        "Skills exported successfully.",
        "success"
    );
}


/* -----------------------------------------------------
   EXPORT GOALS CSV
   ----------------------------------------------------- */

function exportGoalsCSV() {

    const userId =
        getCurrentUser();


    const goals =
        getUserGoals(userId);


    if (goals.length === 0) {

        showAppMessage(
            "There are no goals to export.",
            "error"
        );

        return;
    }


    const csv =
        convertToCSV(goals);


    downloadFile(
        csv,
        "community-goals.csv",
        "text/csv"
    );


    showAppMessage(
        "Goals exported successfully.",
        "success"
    );
}


/* -----------------------------------------------------
   EXPORT ACTIVITIES CSV
   ----------------------------------------------------- */

function exportActivitiesCSV() {

    const userId =
        getCurrentUser();


    const activities =
        getUserActivities(userId);


    if (activities.length === 0) {

        showAppMessage(
            "There are no activities to export.",
            "error"
        );

        return;
    }


    const csv =
        convertToCSV(
            activities
        );


    downloadFile(
        csv,
        "community-learning-activities.csv",
        "text/csv"
    );


    showAppMessage(
        "Activities exported successfully.",
        "success"
    );
}


/* =====================================================
   PHASE 13 INITIALIZATION
   ===================================================== */

const exportJSONButton =
    document.getElementById(
        "exportJSONButton"
    );

if (exportJSONButton) {

    exportJSONButton.addEventListener(
        "click",
        exportUserDataJSON
    );
}


const exportSkillsButton =
    document.getElementById(
        "exportSkillsButton"
    );

if (exportSkillsButton) {

    exportSkillsButton.addEventListener(
        "click",
        exportSkillsCSV
    );
}


const exportGoalsButton =
    document.getElementById(
        "exportGoalsButton"
    );

if (exportGoalsButton) {

    exportGoalsButton.addEventListener(
        "click",
        exportGoalsCSV
    );
}


const exportActivitiesButton =
    document.getElementById(
        "exportActivitiesButton"
    );

if (exportActivitiesButton) {

    exportActivitiesButton.addEventListener(
        "click",
        exportActivitiesCSV
    );
}