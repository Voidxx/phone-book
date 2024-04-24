package org.lsedlanic.phonebook.repositories;

import org.lsedlanic.phonebook.entities.Contact;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.querydsl.QuerydslPredicateExecutor;


public interface ContactRepository extends  MongoRepository<Contact, String>, QuerydslPredicateExecutor<Contact> {
}