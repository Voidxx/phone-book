package org.lsedlanic.phonebook.utils;

import org.lsedlanic.phonebook.entities.Contact;
import org.springframework.stereotype.Component;
import org.springframework.validation.Errors;
import org.springframework.validation.ValidationUtils;
import org.springframework.validation.Validator;

@Component
public class ContactValidator implements Validator {
    @Override
    public boolean supports(Class<?> clazz) {
        return Contact.class.equals(clazz);
    }

    @Override
    public void validate(Object target, Errors errors) {
        Contact contact = (Contact) target;
        System.out.println("Validating OIB: " + contact.getOib());
        System.out.println("Validating Phone Number: " + contact.getPhoneNumber());

        ValidationUtils.rejectIfEmptyOrWhitespace(errors, "oib", "OIB is required");
        System.out.println("OIB required validation: " + errors.hasErrors());

        ValidationUtils.rejectIfEmptyOrWhitespace(errors, "firstName", "First name is required");
        System.out.println("First name required validation: " + errors.hasErrors());

        ValidationUtils.rejectIfEmptyOrWhitespace(errors, "lastName", "Last name is required");
        System.out.println("Last name required validation: " + errors.hasErrors());

        ValidationUtils.rejectIfEmptyOrWhitespace(errors, "address", "Address is required");
        System.out.println("Address required validation: " + errors.hasErrors());

        ValidationUtils.rejectIfEmptyOrWhitespace(errors, "city", "City is required");
        System.out.println("City required validation: " + errors.hasErrors());

        ValidationUtils.rejectIfEmptyOrWhitespace(errors, "phoneNumber", "Phone number is required");
        System.out.println("Phone number required validation: " + errors.hasErrors());

        if (contact.getOib() != null && !contact.getOib().toString().matches("\\d{11}")) {
            errors.rejectValue("oib", "OIB must be an 11-digit number");
            System.out.println("OIB format validation: " + errors.hasErrors());
        }

        if (contact.getPhoneNumber() != null && !contact.getPhoneNumber().matches("\\d{10}")) {
            errors.rejectValue("phoneNumber", "Phone number must be a 10-digit number");
            System.out.println("Phone number format validation: " + errors.hasErrors());
        }
    }
}