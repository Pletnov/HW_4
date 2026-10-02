const express = require('express');
const controllers = require('../controllers/category');
const passport = require('passport');
const router = express.Router();

router.get('/', passport.authenticate('jwt', {session: false}), controllers.getAll);
router.get('/:id', passport.authenticate('jwt', {session: false}), controllers.getById);
router.post('/', passport.authenticate('jwt', {session: false}), controllers.create);
router.patch('/:id', passport.authenticate('jwt', {session: false}), controllers.update);
router.delete('/:id', passport.authenticate('jwt', {session: false}), controllers.remove);

module.exports = router;