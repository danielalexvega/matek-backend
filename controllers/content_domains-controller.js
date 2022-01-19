const { validationResult } = require("express-validator");
const mongoose = require("mongoose");

const HttpError = require("../models/http-error");
const ContentDomain = require("../models/content-domains");

const getContentDomainById = async (req, res, next) => {
    const contentDomainId = req.params.contentDomainId;
    let contentDomain;
    try {
        contentDomain = await ContentDomain.findById(contentDomainId);
    } catch (err) {
        const error = new HttpError(
            "Something went wrong, could not find a content domain.",
            500
        );

        return next(error);
    }

    if (!contentDomain) {
        return next(
            new HttpError(
                "Could not find a content domain for the provided id.",
                404
            )
        );
    }

    res.json({ contentDomain: contentDomain.toObject({ getters: true }) });
};

const getContentDomains = async (req, res, next) => {
    let contentDomains;

    try {
        contentDomains = await ContentDomain.find();
    } catch (err) {
        const error = new HttpError(
            "Something went wrong, could not find any content domains.",
            500
        );
        return next(error);
    }

    res.json({
        contentDomains: contentDomains.map((contentDomain) =>
            contentDomain.toObject({ getters: true })
        ),
    });
};

exports.getContentDomainById = getContentDomainById;
exports.getContentDomains = getContentDomains;
