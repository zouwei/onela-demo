const express = require("express");
const bodyParser = require("body-parser");
var router = express.Router();
var users_handlers = require("../handlers/users");
// var {configPermList, configPermUpdate} = require("../handlers/apps");
var {checkManageAuth} = require("../handlers/middlewares/management");

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({extended: false}));

router.use("*", checkManageAuth);

router.get("/", users_handlers.list);
router.post("/", users_handlers.create);
router.get("/:id", users_handlers.detail);
router.put("/:id", users_handlers.update);
router.delete("/:id", users_handlers.remove);

// router.get("/:id/perms/", configPermList);
// router.post("/:id/perms", configPermUpdate);

module.exports = exports = router;
