import React from 'react';
const ContactModalContent = ({ onSubmit, initialContact = null }) => {
    const [contact, setContact] = React.useState(initialContact || {
        oib: '',
        firstName: '',
        lastName: '',
        adress: '',
        city: '',
        phoneNumber: '',
    });

    const handleInputChange = (e) => {
        setContact({ ...contact, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(contact);
    };

    return (
        <form onSubmit={handleSubmit}>
            <input name="oib" placeholder="OIB" value={contact.oib} onChange={handleInputChange} required />
            <input name="firstName" placeholder="First Name" value={contact.firstName} onChange={handleInputChange} required />
            <input name="lastName" placeholder="Last Name" value={contact.lastName} onChange={handleInputChange} required />
            <input name="adress" placeholder="Address" value={contact.adress} onChange={handleInputChange} required />
            <input name="city" placeholder="City" value={contact.city} onChange={handleInputChange} required />
            <input name="phoneNumber" placeholder="Phone Number" value={contact.phoneNumber} onChange={handleInputChange} required />
            <button type="submit">{initialContact ? 'Update Contact' : 'Add Contact'}</button>
        </form>
    );
};

export default ContactModalContent;