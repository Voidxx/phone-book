package org.lsedlanic.phonebook.services;

import org.lsedlanic.phonebook.entities.Contact;
import org.lsedlanic.phonebook.repositories.ContactRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ContactService {
    @Autowired
    private ContactRepository contactRepository;
    //private final Logger logger = LoggerFactory.getLogger(ContactService.class);

    public Contact addContact(Contact contact) {
        return contactRepository.save(contact);
    }


    public List<Contact> getAllContacts() {
        return contactRepository.findAll();
    }

    public Contact getContactById(String id) {
        Optional<Contact> contact = contactRepository.findById(id);
        return contact.orElse(null);
    }

    public Contact updateContact(String id, Contact updatedContact) {
        Optional<Contact> existingContact = contactRepository.findById(id);
        if (existingContact.isPresent()) {
            Contact contact = existingContact.get();
            contact.setOib(updatedContact.getOib());
            contact.setFirstName(updatedContact.getFirstName());
            contact.setLastName(updatedContact.getLastName());
            contact.setAdress(updatedContact.getAdress());
            contact.setCity(updatedContact.getCity());
            contact.setPhoneNumber(updatedContact.getPhoneNumber());
            return contactRepository.save(contact);
        } else {
            return null;
        }
    }

    public void deleteContact(String id) {
        contactRepository.deleteById(id);
    }
}
