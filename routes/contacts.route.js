const { Router } = require('express');
const contactsController = require('../controllers/contacts.controller');
const {createContactValidator} = require('../middlewares/validators');
const isAuth = require('../middlewares/isAuth');

const router = Router();

router.get('/', isAuth, contactsController.getContacts);
router.get('/:id', isAuth, contactsController.getContactDetails);
router.post('/', isAuth, createContactValidator, contactsController.createContact);
router.put('/:id', isAuth, contactsController.updateContact);
router.delete('/:id', isAuth, contactsController.deleteContact);

module.exports = router;