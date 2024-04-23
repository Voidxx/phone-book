package org.lsedlanic.phonebook.repositories;

import org.lsedlanic.phonebook.entities.Contact;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import java.util.List;

public interface ContactRepository extends MongoRepository<Contact, String> {
}