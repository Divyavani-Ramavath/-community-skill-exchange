/* =====================================================
   SKILLCONNECT - LOCAL STORAGE MANAGER
   Community Skill Exchange & Learning Network
   ===================================================== */

const STORAGE_KEYS = {
    USERS: "skillconnect_users",
    CURRENT_USER: "skillconnect_current_user",
    PROFILES: "skillconnect_profiles",
    SKILLS: "skillconnect_skills",
    GOALS: "skillconnect_goals",
    ACTIVITIES: "skillconnect_activities",
    CONNECTIONS: "skillconnect_connections",
    ACHIEVEMENTS: "skillconnect_achievements",
    PREFERENCES: "skillconnect_preferences"
};


/* =====================================================
   SAVE DATA
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


/* =====================================================
   GET DATA
   ===================================================== */

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


/* =====================================================
   REMOVE DATA
   ===================================================== */

function removeData(key) {
    try {
        localStorage.removeItem(key);
        return true;

    } catch (error) {
        console.error("Error removing data:", error);
        return false;
    }
}


/* =====================================================
   CLEAR ALL SKILLCONNECT DATA
   ===================================================== */

function clearAllData() {

    Object.values(STORAGE_KEYS).forEach(key => {
        localStorage.removeItem(key);
    });

    console.log("SkillConnect data cleared.");
}


/* =====================================================
   GENERATE UNIQUE ID
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


/* =====================================================
   CHECK LOGIN
   ===================================================== */

function isLoggedIn() {
    return getCurrentUser() !== null;
}