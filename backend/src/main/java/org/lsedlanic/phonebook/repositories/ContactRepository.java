package org.lsedlanic.phonebook.repositories;

import org.lsedlanic.phonebook.entities.Contact;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface ContactRepository extends MongoRepository<Contact, String> {
}