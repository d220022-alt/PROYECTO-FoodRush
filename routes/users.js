const express = require('express');
const rateLimit = require('express-rate-limit');
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: 'TOO_MANY_LOGIN_ATTEMPTS',
    message: 'Demasiados intentos de login. Intenta mas tarde.'
  }
});

router.post('/login', loginLimiter, userController.login);
router.post('/', userController.crear);

router.use(authMiddleware);

router.get('/', userController.listar);
router.get('/:id', userController.obtener);
router.put('/:id', userController.actualizar);
router.put('/:id/password', userController.cambiarContrasena);
router.delete('/:id', userController.eliminar);

module.exports = router;
