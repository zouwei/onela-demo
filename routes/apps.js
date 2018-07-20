const express = require("express");
const bodyParser = require("body-parser");
var router = express.Router();
var apps_handlers = require("../handlers/apps");
var {checkManageAuth} = require("../handlers/middlewares/management");
// var {clientPermList, clientPermUpdate} = require("../handlers/apps");

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({extended: false}));

router.use("*", checkManageAuth);

router.get("/", apps_handlers.list);
router.post("/", apps_handlers.create);
router.get("/:id", apps_handlers.detail);
router.put("/:id", apps_handlers.update);
router.delete("/:id", apps_handlers.remove);

// router.get("/:id/perms/", clientPermList);
// router.post("/:id/perms/", clientPermUpdate);

module.exports = exports = router;
