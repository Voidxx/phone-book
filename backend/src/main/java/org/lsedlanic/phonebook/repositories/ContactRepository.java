package org.lsedlanic.phonebook.repositories;

import org.lsedlanic.phonebook.entities.Contact;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.querydsl.QuerydslPredicateExecutor;

import java.util.Optional;


public interface ContactRepository extends  MongoRepository<Contact, String>, QuerydslPredicateExecutor<Contact> {
    Optional<Contact> findByOib(String oib);
    Optional<Contact> findByPhoneNumber(String oib);
}