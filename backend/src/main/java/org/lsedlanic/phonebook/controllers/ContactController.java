package org.lsedlanic.phonebook.controllers;


import org.lsedlanic.phonebook.entities.Contact;
import org.lsedlanic.phonebook.services.ContactService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/contacts")
public class ContactController {

    @Autowired
    private ContactService contactService;

    @PostMapping
    public Contact addContact(@RequestBody Contact contact) {
        return contactService.addContact(contact);
    }
}