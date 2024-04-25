package org.lsedlanic.phonebook.services;

import com.querydsl.core.types.dsl.BooleanExpression;
import org.lsedlanic.phonebook.entities.Contact;
import org.lsedlanic.phonebook.entities.QContact;
import org.lsedlanic.phonebook.repositories.ContactRepository;

import org.lsedlanic.phonebook.utils.ContactValidator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.*;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.validation.BeanPropertyBindingResult;
import org.springframework.validation.BindingResult;
import org.springframework.web.multipart.MultipartFile;

import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.Files;
import java.util.ArrayList;
import java.util.Base64;
import java.util.List;
import java.util.Optional;
import java.io.IOException;
import java.util.stream.Collectors;


@Service
public class ContactService {
    @Autowired
    private ContactRepository contactRepository;
    @Autowired
    private ContactValidator contactValidator;

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
            contact.setAddress(updatedContact.getAddress());
            contact.setCity(updatedContact.getCity());
            contact.setPhoneNumber(updatedContact.getPhoneNumber());
            contact.setImage(updatedContact.getImage());
            return contactRepository.save(contact);
        } else {
            return null;
        }
    }

    public void deleteContact(String id) {
        contactRepository.deleteById(id);
    }

    public void exportToCSV(String fileName) {
        List<Contact> contacts = getAllContacts();
        Path filePath = Paths.get(fileName);

        try (BufferedWriter writer = Files.newBufferedWriter(filePath, StandardCharsets.UTF_8)) {
            writer.write("\uFEFF");
            writer.write("OIB,First Name,Last Name,Address,City,Phone Number,Image");
            writer.newLine();

            for (Contact contact : contacts) {
                String base64Image = contact.getImage() != null ? Base64.getEncoder().encodeToString(contact.getImage()) : "";
                writer.write(String.format("%s,%s,%s,%s,%s,%s,%s",
                        contact.getOib(),
                        contact.getFirstName(),
                        contact.getLastName(),
                        contact.getAddress(),
                        contact.getCity(),
                        contact.getPhoneNumber(),
                        base64Image));
                writer.newLine();
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    public ResponseEntity<String> importFromCSV(MultipartFile file) {
        List<String> errorMessages = new ArrayList<>();

        try (BufferedReader reader = new BufferedReader(new InputStreamReader(file.getInputStream(), StandardCharsets.UTF_8))) {
            reader.readLine();
            int lineNumber = 1;
            String line;
            while ((line = reader.readLine()) != null) {
                lineNumber++;
                String[] data = line.split(",");
                if (data.length == 7) {
                    Contact contact = new Contact();
                    contact.setOib(data[0].trim());
                    contact.setFirstName(data[1].trim());
                    contact.setLastName(data[2].trim());
                    contact.setAddress(data[3].trim());
                    contact.setCity(data[4].trim());
                    contact.setPhoneNumber(data[5].trim());
                    String base64Image = data[6].trim();
                    if (!base64Image.isEmpty()) {
                        contact.setImage(Base64.getDecoder().decode(base64Image));
                    }

                    BindingResult bindingResult = new BeanPropertyBindingResult(contact, "contact");
                    contactValidator.validate(contact, bindingResult);
                    if (bindingResult.hasErrors()) {
                        errorMessages.add("Error importing contact on line " + lineNumber + ":" + bindingResult.getAllErrors());
                        continue;
                    }

                    contactRepository.save(contact);
                }
                else if(data.length == 6){
                    Contact contact = new Contact();
                    contact.setOib(data[0].trim());
                    contact.setFirstName(data[1].trim());
                    contact.setLastName(data[2].trim());
                    contact.setAddress(data[3].trim());
                    contact.setCity(data[4].trim());
                    contact.setPhoneNumber(data[5].trim());
                    contact.setImage(null);

                    BindingResult bindingResult = new BeanPropertyBindingResult(contact, "contact");
                    contactValidator.validate(contact, bindingResult);
                    if (bindingResult.hasErrors()) {
                        errorMessages.add("Error importing contact on line " + lineNumber + ":" + bindingResult.getAllErrors());
                        continue;
                    }

                    contactRepository.save(contact);
                }
            }
        } catch (Exception e) {
            errorMessages.add("Import failed: " + e.getMessage());
        }
        if (errorMessages.isEmpty()) {
            return ResponseEntity.ok().body("{\"message\": \"Contacts imported successfully\"}");
        } else {
            String escapedErrors = "[" + String.join(", ", errorMessages.stream()
                    .map(error -> String.format("\"%s\"", error.replace("\\", "\\\\")))
                    .collect(Collectors.toList())) + "]";
            return ResponseEntity.badRequest().body("{\"errors\": " + escapedErrors + "}");
        }
    }
    public Page<Contact> getContactsPage(String query, Pageable pageable) {
        return contactRepository.findAll(getPredicate(query), pageable);
    }

    private BooleanExpression getPredicate(String query){
        QContact contact = QContact.contact;
        return contact.firstName.containsIgnoreCase(query)
                .or(contact.lastName.containsIgnoreCase(query))
                .or(contact.city.containsIgnoreCase(query))
                .or(contact.address.containsIgnoreCase(query))
                .or(contact.phoneNumber.containsIgnoreCase(query));
    }

}
