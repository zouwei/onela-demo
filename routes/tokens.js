const express = require("express");
const bodyParser = require("body-parser");
var router = express.Router();
var token_handlers = require("../handlers/tokens");

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({extended: false}));

// 获取token
router.post("/authenticate", token_handlers.getToken);

// router.post("/", token_handlers.getToken);
// router.get("/:id", perm_handlers.detail);
// router.put("/:id", perm_handlers.update);
// router.delete("/:id", perm_handlers.remove);

module.exports = exports = router;
