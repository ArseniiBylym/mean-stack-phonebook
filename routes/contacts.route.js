const { Router } = require('express');
const contactsController = require('../controllers/contacts.controller');
const {createContactValidator} = require('../middlewares/validators');

const router = Router();

router.get('/', contactsController.getContacts);
router.get('/:id', contactsController.getContactDetails);
router.post('/', createContactValidator, contactsController.createContact);
router.put('/:id', contactsController.updateContact);
router.delete('/:id', contactsController.deleteContact);

module.exports = router;