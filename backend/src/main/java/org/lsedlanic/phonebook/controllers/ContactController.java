package org.lsedlanic.phonebook.controllers;


import org.lsedlanic.phonebook.entities.Contact;
import org.lsedlanic.phonebook.services.ContactService;
import org.lsedlanic.phonebook.utils.ContactValidator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.InputStreamResource;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;


import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;

@RestController
@RequestMapping("/api/contacts")
public class ContactController {

    @Autowired
    private ContactService contactService;

    @Autowired
    private ContactValidator contactValidator;


    @GetMapping("/{id}")
    public Contact getContactById(@PathVariable String id) {
        return contactService.getContactById(id);
    }

    @PostMapping
    public ResponseEntity<?> addContact(@RequestBody Contact contact, BindingResult bindingResult) {
        contactValidator.validate(contact, bindingResult);
        if (bindingResult.hasErrors()) {
            return ResponseEntity.badRequest().body(bindingResult.getAllErrors());
        } else {
            try {
                return ResponseEntity.ok(contactService.addContact(contact));
            } catch (Exception e) {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to add contact");
            }
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateContact(@PathVariable String id, @RequestBody Contact contact, BindingResult bindingResult) {
        contactValidator.validate(contact, bindingResult);
        if (bindingResult.hasErrors()) {
            return ResponseEntity.badRequest().body(bindingResult.getAllErrors());
        } else {
            try {
                Contact updatedContact = contactService.updateContact(id, contact);
                return updatedContact != null ?
                        ResponseEntity.ok(updatedContact) :
                        ResponseEntity.notFound().build();
            } catch (Exception e) {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to update contact");
            }
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

    @GetMapping("/export")
    public ResponseEntity<InputStreamResource> exportToCSV() throws IOException {
        String fileName = "contacts.csv";
        File file = new File(fileName);

        contactService.exportToCSV(fileName);

        InputStreamResource resource = new InputStreamResource(new FileInputStream(file));

        HttpHeaders headers = new HttpHeaders();
        headers.add("Content-Disposition", String.format("attachment; filename=\"%s\"", file.getName()));
        headers.add("Cache-Control", "no-cache, no-store, must-revalidate");
        headers.add("Pragma", "no-cache");
        headers.add("Expires", "0");

        return ResponseEntity.ok()
                .headers(headers)
                .contentLength(file.length())
                .contentType(MediaType.parseMediaType("application/csv"))
                .body(resource);
    }

    @PostMapping("/import")
    public ResponseEntity<?> importFromCSV(@RequestParam("file") MultipartFile file) {
        try {
            String fileName = file.getOriginalFilename();
            assert fileName != null;
            file.transferTo(new File(fileName));
            contactService.importFromCSV(fileName);
            return ResponseEntity.ok("Contacts imported successfully");
        } catch (IOException e) {
            return ResponseEntity.badRequest().body("Failed to import contacts");
        }
    }



    @GetMapping
    public Page<Contact> getContactsPage(
            @RequestParam(defaultValue = "") String query, Pageable pageable) {
            return contactService.getContactsPage(query, pageable);
    }

    @PutMapping("/{id}/image")
    public ResponseEntity<?> updateContactImage(@PathVariable String id, @RequestParam("image") MultipartFile file) {
        try {
            Contact contact = contactService.getContactById(id);
            if (contact == null) {
                return ResponseEntity.notFound().build();
            }

            byte[] imageData = file.getBytes();
            contact.setImage(imageData);
            contactService.updateContact(id, contact);

            return ResponseEntity.ok().build();
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to update contact image");
        }
    }

}