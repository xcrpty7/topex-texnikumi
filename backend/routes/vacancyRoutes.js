const express = require('express');
const router = express.Router();
const { protect, restrictTo } = require('../middleware/auth');
const ctrl = require('../controllers/vacancyController');

router.get('/', ctrl.getVacancies);
router.get('/active', ctrl.getActive);
router.get('/:id', ctrl.getVacancy);
router.post('/', protect, restrictTo('ADMIN', 'SUPER_ADMIN'), ctrl.createVacancy);
router.put('/:id', protect, restrictTo('ADMIN', 'SUPER_ADMIN'), ctrl.updateVacancy);
router.delete('/:id', protect, restrictTo('ADMIN', 'SUPER_ADMIN'), ctrl.deleteVacancy);

module.exports = router;
