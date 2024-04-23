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

    const title = initialContact ? 'Update Contact' : 'Add Contact';

    return (
        <form onSubmit={handleSubmit}>
            <h2 className="modal-title">{title}</h2>
            <input
                name="oib"
                placeholder="OIB"
                value={contact.oib}
                onChange={handleInputChange}
                required
                className="form-input"
            />
            <input
                name="firstName"
                placeholder="First Name"
                value={contact.firstName}
                onChange={handleInputChange}
                required
                className="form-input"
            />
            <input
                name="lastName"
                placeholder="Last Name"
                value={contact.lastName}
                onChange={handleInputChange}
                required
                className="form-input"
            />
            <input
                name="adress"
                placeholder="Address"
                value={contact.adress}
                onChange={handleInputChange}
                required
                className="form-input"
            />
            <input
                name="city"
                placeholder="City"
                value={contact.city}
                onChange={handleInputChange}
                required
                className="form-input"
            />
            <input
                name="phoneNumber"
                placeholder="Phone Number"
                value={contact.phoneNumber}
                onChange={handleInputChange}
                required
                className="form-input"
            />
            <button
                type="submit"
                className="submit-button"
            >
                {title}
            </button>
        </form>
    );
};

export default ContactModalContent;