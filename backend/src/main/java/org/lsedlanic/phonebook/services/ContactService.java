package org.lsedlanic.phonebook.services;

import org.lsedlanic.phonebook.entities.Contact;
import org.lsedlanic.phonebook.repositories.ContactRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ContactService {
    @Autowired
    private ContactRepository contactRepository;

    public Contact addContact(Contact contact) {
        return contactRepository.save(contact);
    }
}
