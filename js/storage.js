/* =====================================================
   COMMUNITY-SKILL-EXCHANGE
   STORAGE MANAGEMENT
   ===================================================== */

const STORAGE_KEYS = {
    USERS: "skillconnect_users",
    CURRENT_USER: "skillconnect_current_user",
    PROFILES: "skillconnect_profiles",
    SKILLS: "skillconnect_skills",
    GOALS: "skillconnect_goals",
    ACTIVITIES: "skillconnect_activities",
    CONNECTIONS: "skillconnect_connections",

    // Dedicated storage for Phase 6
    EXCHANGE_REQUESTS: "skillconnect_exchange_requests",

    ACHIEVEMENTS: "skillconnect_achievements",
    PREFERENCES: "skillconnect_preferences"
};


/* =====================================================
   GENERIC STORAGE FUNCTIONS
   ===================================================== */

function saveData(key, data) {
    try {
        localStorage.setItem(key, JSON.stringify(data));
        return true;
    } catch (error) {
        console.error("Error saving data:", error);
        return false;
    }
}


function getData(key, defaultValue = []) {
    try {
        const data = localStorage.getItem(key);

        if (data === null) {
            return defaultValue;
        }

        return JSON.parse(data);

    } catch (error) {
        console.error("Error reading data:", error);
        return defaultValue;
    }
}


function removeData(key) {
    try {
        localStorage.removeItem(key);
        return true;

    } catch (error) {
        console.error("Error removing data:", error);
        return false;
    }
}


function clearAllData() {

    Object.values(STORAGE_KEYS).forEach(key => {
        localStorage.removeItem(key);
    });

    console.log("Community-Skill-Exchange data cleared.");
}


/* =====================================================
   ID GENERATOR
   ===================================================== */

function generateId(prefix = "id") {

    return `${prefix}_${Date.now()}_${Math.random()
        .toString(36)
        .substring(2, 8)}`;
}


/* =====================================================
   CURRENT USER
   ===================================================== */

function setCurrentUser(userId) {

    localStorage.setItem(
        STORAGE_KEYS.CURRENT_USER,
        userId
    );
}


function getCurrentUser() {

    return localStorage.getItem(
        STORAGE_KEYS.CURRENT_USER
    );
}


function clearCurrentUser() {

    localStorage.removeItem(
        STORAGE_KEYS.CURRENT_USER
    );
}


function isLoggedIn() {

    return getCurrentUser() !== null;
}


/* =====================================================
   PROFILE STORAGE
   ===================================================== */

function getUserProfile(userId) {

    const profiles = getData(
        STORAGE_KEYS.PROFILES,
        []
    );

    return profiles.find(
        profile => profile.userId === userId
    ) || null;
}


function createUserProfile(userId) {

    const profiles = getData(
        STORAGE_KEYS.PROFILES,
        []
    );

    const existingProfile = profiles.find(
        profile => profile.userId === userId
    );

    if (existingProfile) {
        return existingProfile;
    }

    const newProfile = {

        id: generateId("profile"),

        userId: userId,

        bio: "",

        location: "",

        education: "",

        createdAt:
            new Date().toISOString(),

        updatedAt:
            new Date().toISOString()
    };

    profiles.push(newProfile);

    saveData(
        STORAGE_KEYS.PROFILES,
        profiles
    );

    return newProfile;
}


/* =====================================================
   SKILLS STORAGE
   ===================================================== */

function getUserSkills(userId) {

    const skills = getData(
        STORAGE_KEYS.SKILLS,
        []
    );

    return skills.filter(
        skill => skill.userId === userId
    );
}


function addUserSkill(
    userId,
    name,
    type,
    category,
    level
) {

    const skills = getData(
        STORAGE_KEYS.SKILLS,
        []
    );

    const newSkill = {

        id: generateId("skill"),

        userId: userId,

        name: name.trim(),

        type: type,

        category: category,

        level: level,

        createdAt:
            new Date().toISOString()
    };

    skills.push(newSkill);

    const saved = saveData(
        STORAGE_KEYS.SKILLS,
        skills
    );

    if (!saved) {
        return null;
    }

    return newSkill;
}


function deleteUserSkill(skillId) {

    const skills = getData(
        STORAGE_KEYS.SKILLS,
        []
    );

    const updatedSkills =
        skills.filter(
            skill => skill.id !== skillId
        );

    return saveData(
        STORAGE_KEYS.SKILLS,
        updatedSkills
    );
}


/* =====================================================
   PHASE 6
   KNOWLEDGE EXCHANGE REQUEST STORAGE
   ===================================================== */

function getExchangeRequests() {

    return getData(
        STORAGE_KEYS.EXCHANGE_REQUESTS,
        []
    );
}


/* =====================================================
   CREATE EXCHANGE REQUEST
   ===================================================== */

function createExchangeRequest(
    senderId,
    receiverId,
    skillId,
    skillName,
    exchangeType,
    message = ""
) {

    const requests =
        getExchangeRequests();


    /*
       Prevent duplicate pending requests
       for the same skill and members.
    */

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

        id: generateId("exchange"),

        senderId: senderId,

        receiverId: receiverId,

        skillId: skillId,

        skillName:
            String(skillName || "").trim(),

        exchangeType: exchangeType,

        message:
            String(message || "").trim(),

        status: "pending",

        createdAt:
            new Date().toISOString(),

        updatedAt:
            new Date().toISOString()
    };


    requests.push(request);


    const saved = saveData(
        STORAGE_KEYS.EXCHANGE_REQUESTS,
        requests
    );


    if (!saved) {

        return null;
    }


    return request;
}


/* =====================================================
   SENT REQUESTS
   ===================================================== */

function getSentExchangeRequests(userId) {

    return getExchangeRequests().filter(
        request =>
            request.senderId === userId
    );
}


/* =====================================================
   RECEIVED REQUESTS
   ===================================================== */

function getReceivedExchangeRequests(userId) {

    return getExchangeRequests().filter(
        request =>
            request.receiverId === userId
    );
}


/* =====================================================
   ALL REQUESTS FOR USER
   ===================================================== */

function getExchangeRequestsForUser(userId) {

    return getExchangeRequests().filter(
        request =>
            request.senderId === userId ||
            request.receiverId === userId
    );
}


/* =====================================================
   UPDATE REQUEST STATUS
   ===================================================== */

function updateExchangeRequestStatus(
    requestId,
    status
) {

    const allowedStatuses = [
        "accepted",
        "rejected"
    ];


    if (
        !allowedStatuses.includes(status)
    ) {

        return false;
    }


    const currentUserId =
        getCurrentUser();


    if (!currentUserId) {

        return false;
    }


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


    const request =
        requests[index];


    /*
       Only the receiver can accept
       or reject a request.
    */

    if (
        request.receiverId !==
        currentUserId
    ) {

        return false;
    }


    /*
       Only pending requests
       can be updated.
    */

    if (
        request.status !== "pending"
    ) {

        return false;
    }


    request.status = status;

    request.updatedAt =
        new Date().toISOString();


    return saveData(
        STORAGE_KEYS.EXCHANGE_REQUESTS,
        requests
    );
}


/* =====================================================
   DELETE / CANCEL EXCHANGE REQUEST
   ===================================================== */

function deleteExchangeRequest(
    requestId
) {

    const currentUserId =
        getCurrentUser();


    if (!currentUserId) {

        return false;
    }


    const requests =
        getExchangeRequests();


    const request =
        requests.find(
            item =>
                item.id === requestId
        );


    if (!request) {

        return false;
    }


    /*
       Only the sender can cancel
       a pending request.
    */

    if (
        request.senderId !==
            currentUserId ||
        request.status !== "pending"
    ) {

        return false;
    }


    const updatedRequests =
        requests.filter(
            item =>
                item.id !== requestId
        );


    return saveData(
        STORAGE_KEYS.EXCHANGE_REQUESTS,
        updatedRequests
    );
}
/* =====================================================
   PHASE 7
   GOALS STORAGE
   ===================================================== */

function getUserGoals(userId) {

    const goals = getData(
        STORAGE_KEYS.GOALS,
        []
    );

    return goals.filter(
        goal => goal.userId === userId
    );
}


function createGoal(
    userId,
    title,
    description,
    category,
    targetDate
) {

    const goals = getData(
        STORAGE_KEYS.GOALS,
        []
    );

    const goal = {

        id: generateId("goal"),

        userId: userId,

        title:
            String(title || "").trim(),

        description:
            String(description || "").trim(),

        category:
            String(category || "").trim(),

        targetDate:
            targetDate || "",

        status: "active",

        progress: 0,

        createdAt:
            new Date().toISOString(),

        updatedAt:
            new Date().toISOString()
    };

    goals.push(goal);

    const saved = saveData(
        STORAGE_KEYS.GOALS,
        goals
    );

    if (!saved) {
        return null;
    }

    return goal;
}


function updateGoal(
    goalId,
    updates
) {

    const currentUserId =
        getCurrentUser();

    if (!currentUserId) {
        return false;
    }

    const goals =
        getData(
            STORAGE_KEYS.GOALS,
            []
        );

    const index =
        goals.findIndex(
            goal =>
                goal.id === goalId &&
                goal.userId === currentUserId
        );

    if (index === -1) {
        return false;
    }

    const goal = goals[index];

    if (
        updates.title !== undefined
    ) {
        goal.title =
            String(updates.title).trim();
    }

    if (
        updates.description !== undefined
    ) {
        goal.description =
            String(updates.description).trim();
    }

    if (
        updates.category !== undefined
    ) {
        goal.category =
            String(updates.category).trim();
    }

    if (
        updates.targetDate !== undefined
    ) {
        goal.targetDate =
            updates.targetDate;
    }

    if (
        updates.progress !== undefined
    ) {
        const progress =
            Number(updates.progress);

        goal.progress =
            Math.min(
                100,
                Math.max(0, progress)
            );
    }

    if (
        updates.status !== undefined
    ) {
        const allowedStatuses = [
            "active",
            "completed",
            "paused"
        ];

        if (
            allowedStatuses.includes(
                updates.status
            )
        ) {
            goal.status =
                updates.status;
        }
    }

    goal.updatedAt =
        new Date().toISOString();

    return saveData(
        STORAGE_KEYS.GOALS,
        goals
    );
}


function deleteGoal(goalId) {

    const currentUserId =
        getCurrentUser();

    if (!currentUserId) {
        return false;
    }

    const goals =
        getData(
            STORAGE_KEYS.GOALS,
            []
        );

    const goal =
        goals.find(
            item =>
                item.id === goalId
        );

    if (!goal) {
        return false;
    }

    if (
        goal.userId !== currentUserId
    ) {
        return false;
    }

    const updatedGoals =
        goals.filter(
            item =>
                item.id !== goalId
        );

    return saveData(
        STORAGE_KEYS.GOALS,
        updatedGoals
    );
}
/* =====================================================
   PHASE 8
   ACTIVITIES STORAGE
   ===================================================== */

function getUserActivities(userId) {

    const activities = getData(
        STORAGE_KEYS.ACTIVITIES,
        []
    );

    return activities.filter(
        activity => activity.userId === userId
    );
}


/* =====================================================
   CREATE ACTIVITY
   ===================================================== */

function createActivity(
    userId,
    title,
    description,
    type,
    skill,
    duration,
    activityDate,
    goalId = ""
) {

    const activities = getData(
        STORAGE_KEYS.ACTIVITIES,
        []
    );

    const activity = {

        id: generateId("activity"),

        userId: userId,

        title:
            String(title || "").trim(),

        description:
            String(description || "").trim(),

        type:
            String(type || "").trim(),

        skill:
            String(skill || "").trim(),

        duration:
            Number(duration) || 0,

        activityDate:
            activityDate || "",

        goalId:
            goalId || "",

        createdAt:
            new Date().toISOString(),

        updatedAt:
            new Date().toISOString()
    };

    activities.push(activity);

    const saved = saveData(
        STORAGE_KEYS.ACTIVITIES,
        activities
    );

    if (!saved) {
        return null;
    }

    return activity;
}


/* =====================================================
   UPDATE ACTIVITY
   ===================================================== */

function updateActivity(
    activityId,
    updates
) {

    const currentUserId =
        getCurrentUser();

    if (!currentUserId) {
        return false;
    }

    const activities =
        getData(
            STORAGE_KEYS.ACTIVITIES,
            []
        );

    const index =
        activities.findIndex(
            activity =>
                activity.id === activityId &&
                activity.userId === currentUserId
        );

    if (index === -1) {
        return false;
    }

    const activity =
        activities[index];


    if (updates.title !== undefined) {
        activity.title =
            String(updates.title).trim();
    }


    if (updates.description !== undefined) {
        activity.description =
            String(updates.description).trim();
    }


    if (updates.type !== undefined) {
        activity.type =
            String(updates.type).trim();
    }


    if (updates.skill !== undefined) {
        activity.skill =
            String(updates.skill).trim();
    }


    if (updates.duration !== undefined) {
        activity.duration =
            Number(updates.duration) || 0;
    }


    if (updates.activityDate !== undefined) {
        activity.activityDate =
            updates.activityDate;
    }


    if (updates.goalId !== undefined) {
        activity.goalId =
            updates.goalId || "";
    }


    activity.updatedAt =
        new Date().toISOString();


    return saveData(
        STORAGE_KEYS.ACTIVITIES,
        activities
    );
}


/* =====================================================
   DELETE ACTIVITY
   ===================================================== */

function deleteActivity(activityId) {

    const currentUserId =
        getCurrentUser();

    if (!currentUserId) {
        return false;
    }

    const activities =
        getData(
            STORAGE_KEYS.ACTIVITIES,
            []
        );

    const activity =
        activities.find(
            item =>
                item.id === activityId
        );

    if (!activity) {
        return false;
    }


    if (
        activity.userId !== currentUserId
    ) {
        return false;
    }


    const updatedActivities =
        activities.filter(
            item =>
                item.id !== activityId
        );


    return saveData(
        STORAGE_KEYS.ACTIVITIES,
        updatedActivities
    );
}
/* =====================================================
   PHASE 8
   ACTIVITIES PAGE
   ===================================================== */

let currentActivityFilter = "all";


function loadActivitiesPage() {

    if (!isLoggedIn()) {
        return;
    }

    setupActivityEvents();

    setDefaultActivityDate();

    loadActivityGoalOptions();

    renderActivities();
}


/* =====================================================
   EVENTS
   ===================================================== */

function setupActivityEvents() {

    const addButton =
        document.getElementById(
            "addActivityBtn"
        );

    const emptyButton =
        document.getElementById(
            "emptyAddActivityBtn"
        );

    const closeButton =
        document.getElementById(
            "closeActivityModal"
        );

    const cancelButton =
        document.getElementById(
            "cancelActivityBtn"
        );

    const form =
        document.getElementById(
            "activityForm"
        );

    const filter =
        document.getElementById(
            "activityFilter"
        );


    if (addButton) {

        addButton.addEventListener(
            "click",
            () => openActivityModal()
        );
    }


    if (emptyButton) {

        emptyButton.addEventListener(
            "click",
            () => openActivityModal()
        );
    }


    if (closeButton) {

        closeButton.addEventListener(
            "click",
            closeActivityModal
        );
    }


    if (cancelButton) {

        cancelButton.addEventListener(
            "click",
            closeActivityModal
        );
    }


    if (form) {

        form.addEventListener(
            "submit",
            handleActivitySubmit
        );
    }


    if (filter) {

        filter.addEventListener(
            "change",
            event => {

                currentActivityFilter =
                    event.target.value;

                renderActivities();
            }
        );
    }


    const modal =
        document.getElementById(
            "activityModal"
        );

    if (modal) {

        modal.addEventListener(
            "click",
            event => {

                if (
                    event.target === modal
                ) {
                    closeActivityModal();
                }
            }
        );
    }
}


/* =====================================================
   DEFAULT DATE
   ===================================================== */

function setDefaultActivityDate() {

    const dateInput =
        document.getElementById(
            "activityDate"
        );

    if (!dateInput) {
        return;
    }


    if (!dateInput.value) {

        const today =
            new Date()
                .toISOString()
                .split("T")[0];

        dateInput.value = today;
    }
}


/* =====================================================
   LOAD GOALS INTO SELECT
   ===================================================== */

function loadActivityGoalOptions() {

    const select =
        document.getElementById(
            "activityGoal"
        );

    if (!select) {
        return;
    }


    const currentUserId =
        getCurrentUser();


    const goals =
        getUserGoals(currentUserId);


    select.innerHTML = `
        <option value="">
            No specific goal
        </option>

        ${goals.map(
            goal => `
                <option value="${goal.id}">
                    ${escapeHtml(goal.title)}
                </option>
            `
        ).join("")}
    `;
}


/* =====================================================
   OPEN MODAL
   ===================================================== */

function openActivityModal(
    activity = null
) {

    const modal =
        document.getElementById(
            "activityModal"
        );

    const title =
        document.getElementById(
            "activityModalTitle"
        );

    const form =
        document.getElementById(
            "activityForm"
        );


    if (!modal || !form) {
        return;
    }


    form.reset();


    document.getElementById(
        "activityId"
    ).value = "";


    loadActivityGoalOptions();


    setDefaultActivityDate();


    if (activity) {

        title.textContent =
            "Edit Learning Activity";


        document.getElementById(
            "activityId"
        ).value =
            activity.id;


        document.getElementById(
            "activityTitle"
        ).value =
            activity.title;


        document.getElementById(
            "activityDescription"
        ).value =
            activity.description;


        document.getElementById(
            "activityType"
        ).value =
            activity.type;


        document.getElementById(
            "activitySkill"
        ).value =
            activity.skill;


        document.getElementById(
            "activityDuration"
        ).value =
            activity.duration;


        document.getElementById(
            "activityDate"
        ).value =
            activity.activityDate;


        document.getElementById(
            "activityGoal"
        ).value =
            activity.goalId || "";

    } else {

        title.textContent =
            "Add Learning Activity";
    }


    modal.style.display = "flex";
}


/* =====================================================
   CLOSE MODAL
   ===================================================== */

function closeActivityModal() {

    const modal =
        document.getElementById(
            "activityModal"
        );

    if (modal) {

        modal.style.display =
            "none";
    }
}


/* =====================================================
   SAVE ACTIVITY
   ===================================================== */

function handleActivitySubmit(event) {

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


    const activityId =
        document.getElementById(
            "activityId"
        ).value;


    const title =
        document.getElementById(
            "activityTitle"
        ).value.trim();


    const description =
        document.getElementById(
            "activityDescription"
        ).value.trim();


    const type =
        document.getElementById(
            "activityType"
        ).value;


    const skill =
        document.getElementById(
            "activitySkill"
        ).value.trim();


    const duration =
        Number(
            document.getElementById(
                "activityDuration"
            ).value
        ) || 0;


    const activityDate =
        document.getElementById(
            "activityDate"
        ).value;


    const goalId =
        document.getElementById(
            "activityGoal"
        ).value;


    if (!title) {

        showAppMessage(
            "Please enter an activity title.",
            "error"
        );

        return;
    }


    if (!type) {

        showAppMessage(
            "Please select an activity type.",
            "error"
        );

        return;
    }


    if (!activityDate) {

        showAppMessage(
            "Please select the activity date.",
            "error"
        );

        return;
    }


    if (activityId) {

        const updated =
            updateActivity(
                activityId,
                {
                    title,
                    description,
                    type,
                    skill,
                    duration,
                    activityDate,
                    goalId
                }
            );


        if (!updated) {

            showAppMessage(
                "Unable to update activity.",
                "error"
            );

            return;
        }


        showAppMessage(
            "Activity updated successfully.",
            "success"
        );

    } else {

        const activity =
            createActivity(
                currentUserId,
                title,
                description,
                type,
                skill,
                duration,
                activityDate,
                goalId
            );


        if (!activity) {

            showAppMessage(
                "Unable to create activity.",
                "error"
            );

            return;
        }


        showAppMessage(
            "Learning activity added successfully.",
            "success"
        );
    }


    closeActivityModal();

    renderActivities();
}


/* =====================================================
   RENDER ACTIVITIES
   ===================================================== */

function renderActivities() {

    const currentUserId =
        getCurrentUser();


    if (!currentUserId) {
        return;
    }


    const container =
        document.getElementById(
            "activitiesContainer"
        );

    const emptyState =
        document.getElementById(
            "emptyActivities"
        );


    if (!container) {
        return;
    }


    const activities =
        getUserActivities(
            currentUserId
        );


    updateActivityStatistics(
        activities
    );


    let filteredActivities =
        activities;


    if (
        currentActivityFilter !==
        "all"
    ) {

        filteredActivities =
            activities.filter(
                activity =>
                    activity.type ===
                    currentActivityFilter
            );
    }


    filteredActivities.sort(
        (a, b) =>
            new Date(
                b.activityDate
            ) -
            new Date(
                a.activityDate
            )
    );


    if (
        filteredActivities.length === 0
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
        filteredActivities
            .map(
                activity =>
                    createActivityCard(
                        activity
                    )
            )
            .join("");
}


/* =====================================================
   ACTIVITY CARD
   ===================================================== */

function createActivityCard(
    activity
) {

    const goal =
        activity.goalId
            ? getUserGoals(
                getCurrentUser()
            ).find(
                item =>
                    item.id ===
                    activity.goalId
            )
            : null;


    const duration =
        Number(activity.duration) || 0;


    const hours =
        Math.floor(
            duration / 60
        );


    const minutes =
        duration % 60;


    let durationText = "";


    if (hours > 0) {

        durationText =
            `${hours}h ${minutes}m`;

    } else {

        durationText =
            `${minutes} min`;
    }


    return `
        <article class="card activity-card">

            <div class="activity-card-header">

                <div>

                    <span class="badge">
                        ${escapeHtml(
                            activity.type
                        )}
                    </span>

                    <h3>
                        ${escapeHtml(
                            activity.title
                        )}
                    </h3>

                </div>

            </div>


            <p>
                ${escapeHtml(
                    activity.description ||
                    "No description provided."
                )}
            </p>


            <div class="activity-meta">

                <span>
                    📅
                    ${formatActivityDate(
                        activity.activityDate
                    )}
                </span>

                <span>
                    ⏱
                    ${durationText}
                </span>

                ${
                    activity.skill
                        ? `
                            <span>
                                Skill:
                                ${escapeHtml(
                                    activity.skill
                                )}
                            </span>
                        `
                        : ""
                }

            </div>


            ${
                goal
                    ? `
                        <div class="activity-goal">

                            <strong>
                                Related Goal:
                            </strong>

                            ${escapeHtml(
                                goal.title
                            )}

                        </div>
                    `
                    : ""
            }


            <div class="activity-actions">

                <button
                    type="button"
                    class="btn btn-secondary"
                    onclick="editActivity('${activity.id}')"
                >
                    Edit
                </button>

                <button
                    type="button"
                    class="btn btn-danger"
                    onclick="removeActivity('${activity.id}')"
                >
                    Delete
                </button>

            </div>

        </article>
    `;
}


/* =====================================================
   EDIT ACTIVITY
   ===================================================== */

function editActivity(
    activityId
) {

    const currentUserId =
        getCurrentUser();


    const activities =
        getUserActivities(
            currentUserId
        );


    const activity =
        activities.find(
            item =>
                item.id === activityId
        );


    if (!activity) {

        showAppMessage(
            "Activity not found.",
            "error"
        );

        return;
    }


    openActivityModal(activity);
}


/* =====================================================
   DELETE ACTIVITY
   ===================================================== */

function removeActivity(
    activityId
) {

    const confirmed =
        confirm(
            "Are you sure you want to delete this activity?"
        );


    if (!confirmed) {
        return;
    }


    const deleted =
        deleteActivity(
            activityId
        );


    if (!deleted) {

        showAppMessage(
            "Unable to delete activity.",
            "error"
        );

        return;
    }


    showAppMessage(
        "Activity deleted successfully.",
        "success"
    );


    renderActivities();
}


/* =====================================================
   ACTIVITY STATISTICS
   ===================================================== */

function updateActivityStatistics(
    activities
) {

    const total =
        activities.length;


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


    const today =
        new Date();


    const currentMonth =
        today.getMonth();


    const currentYear =
        today.getFullYear();


    const thisMonth =
        activities.filter(
            activity => {

                if (!activity.activityDate) {
                    return false;
                }


                const date =
                    new Date(
                        `${activity.activityDate}T00:00:00`
                    );


                return (
                    date.getMonth() ===
                        currentMonth &&
                    date.getFullYear() ===
                        currentYear
                );
            }
        ).length;


    const skills =
        new Set(
            activities
                .map(
                    activity =>
                        activity.skill
                            ?.trim()
                            .toLowerCase()
                )
                .filter(Boolean)
        );


    const totalElement =
        document.getElementById(
            "totalActivities"
        );


    const hoursElement =
        document.getElementById(
            "totalLearningHours"
        );


    const monthElement =
        document.getElementById(
            "thisMonthActivities"
        );


    const skillsElement =
        document.getElementById(
            "skillsPracticed"
        );


    if (totalElement) {

        totalElement.textContent =
            total;
    }


    if (hoursElement) {

        hoursElement.textContent =
            `${hours}h ${minutes}m`;
    }


    if (monthElement) {

        monthElement.textContent =
            thisMonth;
    }


    if (skillsElement) {

        skillsElement.textContent =
            skills.size;
    }
}


/* =====================================================
   DATE FORMAT
   ===================================================== */

function formatActivityDate(
    dateString
) {

    if (!dateString) {
        return "Unknown date";
    }


    const date =
        new Date(
            `${dateString}T00:00:00`
        );


    if (
        Number.isNaN(
            date.getTime()
        )
    ) {

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
   PHASE 10
   ACHIEVEMENTS STORAGE
   ===================================================== */

function getAchievementDefinitions() {
    return [
        {
            id: "first_skill",
            title: "First Skill",
            description: "Add your first skill to your profile.",
            icon: "🌱",
            requirement: "Add 1 skill",
            target: 1
        },
        {
            id: "goal_setter",
            title: "Goal Setter",
            description: "Create your first learning goal.",
            icon: "🎯",
            requirement: "Create 1 goal",
            target: 1
        },
        {
            id: "first_activity",
            title: "First Step",
            description: "Record your first learning activity.",
            icon: "🚀",
            requirement: "Log 1 activity",
            target: 1
        },
        {
            id: "activity_builder",
            title: "Activity Builder",
            description: "Complete five learning activities.",
            icon: "📚",
            requirement: "Log 5 activities",
            target: 5
        },
        {
            id: "goal_achiever",
            title: "Goal Achiever",
            description: "Complete your first learning goal.",
            icon: "🏅",
            requirement: "Complete 1 goal",
            target: 1
        },
        {
            id: "community_connector",
            title: "Community Connector",
            description: "Send your first knowledge exchange request.",
            icon: "🤝",
            requirement: "Send 1 exchange request",
            target: 1
        },
        {
            id: "match_explorer",
            title: "Match Explorer",
            description: "Find your first skill match.",
            icon: "🔎",
            requirement: "Find 1 skill match",
            target: 1
        },
        {
            id: "dedicated_learner",
            title: "Dedicated Learner",
            description: "Spend at least 10 hours on learning activities.",
            icon: "⏱️",
            requirement: "Complete 600 learning minutes",
            target: 600
        }
    ];
}

function getUserAchievements(userId) {
    const achievements = getData(
        STORAGE_KEYS.ACHIEVEMENTS,
        []
    );

    return achievements.filter(
        achievement => achievement.userId === userId
    );
}

function hasAchievement(userId, achievementId) {
    return getUserAchievements(userId).some(
        achievement => achievement.achievementId === achievementId
    );
}

function awardAchievement(userId, achievementId) {
    if (!userId || !achievementId) {
        return null;
    }

    if (hasAchievement(userId, achievementId)) {
        return null;
    }

    const achievements = getData(
        STORAGE_KEYS.ACHIEVEMENTS,
        []
    );

    const achievement = {
        id: generateId("achievement"),
        userId: userId,
        achievementId: achievementId,
        earnedAt: new Date().toISOString()
    };

    achievements.push(achievement);

    const saved = saveData(
        STORAGE_KEYS.ACHIEVEMENTS,
        achievements
    );

    return saved ? achievement : null;
}