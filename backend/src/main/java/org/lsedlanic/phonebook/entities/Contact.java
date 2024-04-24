package org.lsedlanic.phonebook.entities;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;


@Document(collection = "contacts")
@Data
public class Contact {
    @Id
    private String id;
    private String oib;
    private String firstName;
    private String lastName;
    private String address;
    private String city;
    private String phoneNumber;

    private byte[] image;


}