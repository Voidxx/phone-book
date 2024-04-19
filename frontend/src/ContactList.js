import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ContactList = () => {
    const [contacts, setContacts] = useState([]);
    const [newContact, setNewContact] = useState({
        oib: '',
        firstName: '',
        lastName: '',
        adress: '',
        city: '',
        phoneNumber: '',
    });

    useEffect(() => {
        fetchContacts();
    }, []);

    const fetchContacts = async () => {
        try {
            const response = await axios.get('http://localhost:8080/api/contacts');
            setContacts(response.data);
        } catch (error) {
            console.error('Error fetching contacts:', error);
        }
    };

    const handleInputChange = (e) => {
        setNewContact({ ...newContact, [e.target.name]: e.target.value });
    };

    const handleAddContact = async () => {
        try {
            const response = await axios.post('http://localhost:8080/api/contacts', newContact);
            setContacts([...contacts, response.data]);
            setNewContact({
                oib: '',
                firstName: '',
                lastName: '',
                adress: '',
                city: '',
                phoneNumber: '',
            });
        } catch (error) {
            console.error('Error adding contact:', error);
        }
    };

    return (
        <div>
            <h1>Contact List</h1>
            <ul>
                {contacts.map((contact) => (
                    <li key={contact.id}>
                        {contact.firstName} {contact.lastName} - {contact.phoneNumber}
                    </li>
                ))}
            </ul>
            <h2>Add Contact</h2>
            <input
                name="oib"
                placeholder="OIB"
                value={newContact.oib}
                onChange={handleInputChange}
            />
            <input
                name="firstName"
                placeholder="First Name"
                value={newContact.firstName}
                onChange={handleInputChange}
            />
            <input
                name="lastName"
                placeholder="Last Name"
                value={newContact.lastName}
                onChange={handleInputChange}
            />
            <input
                name="adress"
                placeholder="Address"
                value={newContact.adress}
                onChange={handleInputChange}
            />
            <input
                name="city"
                placeholder="City"
                value={newContact.city}
                onChange={handleInputChange}
            />
            <input
                name="phoneNumber"
                placeholder="Phone Number"
                value={newContact.phoneNumber}
                onChange={handleInputChange}
            />
            <button onClick={handleAddContact}>Add Contact</button>
        </div>
    );
};

export default ContactList;