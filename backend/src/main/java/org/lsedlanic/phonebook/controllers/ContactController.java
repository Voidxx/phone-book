package org.lsedlanic.phonebook.controllers;


import org.lsedlanic.phonebook.entities.Contact;
import org.lsedlanic.phonebook.services.ContactService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/contacts")
public class ContactController {

    @Autowired
    private ContactService contactService;

    @PostMapping
    public ResponseEntity<?> addContact(@RequestBody Contact contact) {

        try {
            contactService.addContact(contact);
            return new ResponseEntity<>("Contact added successfully with the id: " + contact.getId(), HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>("Contact not added", HttpStatus.NOT_FOUND);
        }
    }

    @GetMapping
    public List<Contact> getAllContacts() {
        return contactService.getAllContacts();
    }

    @GetMapping("/{id}")
    public Contact getContactById(@PathVariable String id) {
        return contactService.getContactById(id);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateContact(@PathVariable String id, @RequestBody Contact contact) {
        try {
            contactService.updateContact(id, contact);
            return new ResponseEntity<>(contact, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>("Contact not updated", HttpStatus.NOT_FOUND);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteContact(@PathVariable String id) {
        try {
            contactService.deleteContact(id);
            return new ResponseEntity<>("Contact deleted successfully", HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>("Contact not found", HttpStatus.NOT_FOUND);
        }
    }
}