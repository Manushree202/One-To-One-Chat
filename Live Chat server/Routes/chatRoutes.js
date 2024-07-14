const express = require("express");
const {
    accessChat,
    fetchChats,
    createGroupChat,
    groupExit,
    fetchGroups,
    addSelfToGroup,
} = require("../Controllers/chatController");
const { protect } = require("../middlewares/authMiddleware");

const router = express.Router();

// Log to verify routes
router.post("/", protect, (req, res, next) => {
    console.log("Accessing / route");
    next();
}, accessChat);

router.get("/", protect, (req, res, next) => {
    console.log("Fetching chats with / route");
    next();
}, fetchChats);

router.post("/createGroup", protect, (req, res, next) => {
    console.log("Creating group with /createGroup route");
    next();
}, createGroupChat);

router.get("/fetchGroups", protect, (req, res, next) => {
    console.log("Fetching groups with /fetchGroups route");
    next();
}, fetchGroups);

router.put("/groupExit", protect, (req, res, next) => {
    console.log("Exiting group with /groupExit route");
    next();
}, groupExit);

router.put("/addSelfToGroup", protect, (req, res, next) => {
    console.log("Adding self to group with /addSelfToGroup route");
    next();
}, addSelfToGroup);

module.exports = router;
