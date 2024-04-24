import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import './ContactDetails.css';

const ContactDetails = () => {
    const { id } = useParams();
    const [contact, setContact] = useState(null);
    const [imageFile, setImageFile] = useState(null);
    const [imageUrl, setImageUrl] = useState(null);
    const fileInputRef = useRef(null);

    const handleImageUpload = (event) => {
        const file = event.target.files[0];
        setImageFile(file);
    };

    useEffect(() => {
        fetchContactDetails();
    }, [id]);

    const handleButtonClick = (event) => {
        event.preventDefault(); // Prevent the file input from opening
        fileInputRef.current.click();
    };

    useEffect(() => {
        if (imageFile) {
            const formData = new FormData();
            formData.append('image', imageFile);
            axios
                .put(`http://localhost:8080/api/contacts/${id}/image`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                })
                .then(() => {
                    fetchContactDetails();
                })
                .catch((error) => {
                    console.error('Error updating contact image:', error);
                });
        }
    }, [imageFile, id]);

    const fetchContactDetails = async () => {
        try {
            const response = await axios.get(`http://localhost:8080/api/contacts/${id}`);
            setContact(response.data);
            if (response.data.image) {
                if (typeof response.data.image === 'string') {
                    setImageUrl(`data:image/jpeg;base64,${response.data.image}`);
                } else {
                    const imageBlob = new Blob([response.data.image.data], { type: 'image/jpeg' });
                    const imageUrl = URL.createObjectURL(imageBlob);
                    setImageUrl(imageUrl);
                }
            }
        } catch (error) {
            console.error('Error fetching contact details:', error);
        }
    };

    if (!contact) {
        return <div>Loading...</div>;
    }

    const getInitials = () => {
        const firstName = contact.firstName ? contact.firstName.charAt(0).toUpperCase() : '';
        const lastName = contact.lastName ? contact.lastName.charAt(0).toUpperCase() : '';
        return `${firstName}${lastName}`;
    };

    return (
        <div className="contact-details-container">
            <div className="contact-details-header">
                <div className="contact-avatar">
                    {imageUrl ? (
                        <img src={imageUrl} alt="Contact Avatar"/>
                    ) : (
                        getInitials()
                    )}
                </div>
                <h1>
                    {contact.firstName} {contact.lastName}
                </h1>
            </div>
            <div className="image-upload">
                <label htmlFor="image-upload" className="upload-button" onClick={handleButtonClick}>
                    Upload Contact Picture
                </label>
                <input
                    id="image-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    style={{display: 'none'}}
                    ref={fileInputRef}
                />
            </div>
            <div className="contact-details-body">
                <p>
                    <strong>OIB:</strong> {contact.oib}
                </p>
                <p>
                    <strong>Address:</strong> {contact.address}
                </p>
                <p>
                    <strong>City:</strong> {contact.city}
                </p>
                <p>
                    <strong>Phone Number:</strong> {contact.phoneNumber}
                </p>
            </div>
            <div className="contact-subActions">
                <button className="call-button" onClick={() => window.open(`tel:${contact.phoneNumber}`, '_self')}>
                    <i className="fas fa-phone"></i> Call {contact.phoneNumber}
                </button>
                <button className="message-button" onClick={() => window.open(`sms:${contact.phoneNumber}`, '_self')}>
                    <i className="fas fa-sms"></i> Message {contact.phoneNumber}
                </button>
            </div>
            <div className="back-link">
                <a href="/">Back to Home</a>
            </div>
        </div>
    );
};

export default ContactDetails;