package org.lsedlanic.phonebook.config;

import org.lsedlanic.phonebook.utils.ContactValidator;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class ValidatorConfig {
    @Bean
    public ContactValidator contactValidator() {
        return new ContactValidator();
    }
}