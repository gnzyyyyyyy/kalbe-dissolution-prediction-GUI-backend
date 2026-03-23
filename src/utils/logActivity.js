const ActivityLog = require("../models/ActivityLog");

const logActivity = async (action, description, user) => {
    try {
        await ActivityLog.create({ 
            action, 
            description,
            userId: user?.id || null,
            doneBy: user?.username || null,
            role: user?.role || "System"
        });
    } catch (error) {
        console.error("Error logging activity:", error.message);
    }
}

module.exports = logActivity