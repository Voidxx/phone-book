package org.lsedlanic.phonebook.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.data.mongodb.repository.config.EnableMongoRepositories;

@Configuration
@EnableMongoRepositories(basePackages = "org.lsedlanic.phonebook.repositories")
public class MongoConfig {
}