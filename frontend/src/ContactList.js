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
    const [editingContact, setEditingContact] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

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

        if (editingContact) {
            console.log(e.target.name, e.target.value);
            setEditingContact({ ...editingContact, [e.target.name]: e.target.value });
        } else {
            setNewContact({ ...newContact, [e.target.name]: e.target.value });
        }
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

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const filteredContacts = contacts.filter((contact) =>
        Object.values(contact).some((value) =>
            value.toString().toLowerCase().includes(searchTerm.toLowerCase())
        )
    );

    const handleUpdateContact = async (contact) => {
        try {
            const updatedContact = { ...contact };
            updatedContact.id = editingContact.id;
            updatedContact.oib = editingContact.oib;
            updatedContact.firstName = editingContact.firstName;
            updatedContact.lastName = editingContact.lastName;
            updatedContact.adress = editingContact.adress;
            updatedContact.city = editingContact.city;
            updatedContact.phoneNumber = editingContact.phoneNumber;
            console.log(updatedContact);
            const response = await axios.put(`http://localhost:8080/api/contacts/${contact.id}`, updatedContact);
            setContacts(contacts.map((c) => (c.id === contact.id ? response.data : c)));
            setEditingContact(null);
        } catch (error) {
            console.error('Error updating contact:', error);
        }
    };

    const handleDeleteContact = async (id) => {
        try {
            await axios.delete(`http://localhost:8080/api/contacts/${id}`);
            setContacts(contacts.filter((contact) => contact.id !== id));
        } catch (error) {
            console.error('Error deleting contact:', error);
        }
    };

    return (
        <div>
            <h1>Contact List</h1>
            <input
                type="text"
                placeholder="Search contacts..."
                value={searchTerm}
                onChange={handleSearchChange}
            />
            <ul>
                {filteredContacts.map((contact) => (
                    <li key={contact.id}>
                        {editingContact && editingContact.id === contact.id ? (
                            <>
                                <input
                                    name="oib"
                                    placeholder="OIB"
                                    value={editingContact ? editingContact.oib : ''}
                                    onChange={handleInputChange}
                                />

                                <input
                                    name="firstName"
                                    placeholder="First Name"
                                    value={editingContact ? editingContact.firstName : ''}
                                    onChange={handleInputChange}
                                />

                                <input
                                    name="lastName"
                                    placeholder="Last Name"
                                    value={editingContact ? editingContact.lastName : ''}
                                    onChange={handleInputChange}
                                />

                                <input
                                    name="adress"
                                    placeholder="Address"
                                    value={editingContact ? editingContact.adress : ''}
                                    onChange={handleInputChange}
                                />

                                <input
                                    name="city"
                                    placeholder="City"
                                    value={editingContact ? editingContact.city : ''}
                                    onChange={handleInputChange}
                                />

                                <input
                                    name="phoneNumber"
                                    placeholder="Phone Number"
                                    value={editingContact ? editingContact.phoneNumber : ''}
                                    onChange={handleInputChange}
                                />
                                <button onClick={() => handleUpdateContact(contact)}>Save</button>
                                <button onClick={() => setEditingContact(null)}>Cancel</button>
                            </>
                        ) : (
                            <>
                                {contact.firstName} {contact.lastName} - {contact.phoneNumber}
                                <button onClick={() => setEditingContact(contact)}>Update</button>
                                <button onClick={() => handleDeleteContact(contact.id)}>Delete</button>
                            </>
                        )}
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