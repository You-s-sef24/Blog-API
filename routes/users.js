const { Router } = require("express");
const {
  getAllUsers,
  login,
  register,
  logout,
} = require("../controllers/users");
const verifyToken = require("../middleware/verifyToken");
const validateRegister = require("../middleware/valiateRegister");
const validateLogin = require("../middleware/validateLogin");
const router = Router();

router.get("/", verifyToken, getAllUsers);
router.post("/login", validateLogin(), login);
router.post("/logout", verifyToken, logout);
router.post("/register", validateRegister(), register);

module.exports = router;
