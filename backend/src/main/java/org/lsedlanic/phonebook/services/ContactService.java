package org.lsedlanic.phonebook.services;

import com.querydsl.core.types.dsl.BooleanExpression;
import org.lsedlanic.phonebook.entities.Contact;
import org.lsedlanic.phonebook.entities.QContact;
import org.lsedlanic.phonebook.repositories.ContactRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;

import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.Files;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.io.IOException;



@Service
public class ContactService {
    @Autowired
    private ContactRepository contactRepository;

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

        try (BufferedWriter writer = Files.newBufferedWriter(filePath)) {
            writer.write("OIB,First Name,Last Name,Address,City,Phone Number");
            writer.newLine();

            for (Contact contact : contacts) {
                writer.write(String.format("%d,%s,%s,%s,%s,%s",
                        contact.getOib(),
                        contact.getFirstName(),
                        contact.getLastName(),
                        contact.getAddress(),
                        contact.getCity(),
                        contact.getPhoneNumber()));
                writer.newLine();
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    public void importFromCSV(String fileName) {
        Path filePath = Paths.get(fileName);
        List<Contact> contacts = new ArrayList<>();

        try (BufferedReader reader = Files.newBufferedReader(filePath)) {
            reader.readLine();

            String line;
            while ((line = reader.readLine()) != null) {
                String[] data = line.split(",");
                if (data.length == 6) {
                    Contact contact = new Contact();
                    contact.setOib(data[0].trim());
                    contact.setFirstName(data[1].trim());
                    contact.setLastName(data[2].trim());
                    contact.setAddress(data[3].trim());
                    contact.setCity(data[4].trim());
                    contact.setPhoneNumber(data[5].trim());
                    contacts.add(contact);
                }
            }
        } catch (IOException e) {
            e.printStackTrace();
        }

        for (Contact contact : contacts) {
            addContact(contact);
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
