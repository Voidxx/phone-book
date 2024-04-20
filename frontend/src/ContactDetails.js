import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const ContactDetails = () => {
    const { id } = useParams();
    const [contact, setContact] = useState(null);

    useEffect(() => {
        fetchContactDetails();
    }, [id]);

    const fetchContactDetails = async () => {
        try {
            const response = await axios.get(`http://localhost:8080/api/contacts/${id}`);
            setContact(response.data);
        } catch (error) {
            console.error('Error fetching contact details:', error);
        }
    };

    if (!contact) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <h1>Contact Details</h1>
            <p>
                <strong>OIB:</strong> {contact.oib}
            </p>
            <p>
                <strong>First Name:</strong> {contact.firstName}
            </p>
            <p>
                <strong>Last Name:</strong> {contact.lastName}
            </p>
            <p>
                <strong>Address:</strong> {contact.adress}
            </p>
            <p>
                <strong>City:</strong> {contact.city}
            </p>
            <p>
                <strong>Phone Number:</strong> {contact.phoneNumber}
            </p>
        </div>
    );
};

export default ContactDetails;