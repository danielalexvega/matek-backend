const express = require("express");

const {
    getContentDomains,
    getContentDomainById,
} = require("../controllers/content_domains-controller");

const router = express.Router();

// get all content domains
router.get("/", getContentDomains);

// get a content domain
router.get("/:contentDomainId", getContentDomainById);

module.exports = router;
