import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import ContactModalContent from './ContactModalContent';
import Modal from './Modal';

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


    const [searchQuery, setSearchQuery] = useState('');
    const [searchTerm, setSearchTerm] = useState('');

    const [sortOrder, setSortOrder] = useState('asc');
    const sortFields = [
        { label: 'First Name', value: 'firstName' },
        { label: 'Last Name', value: 'lastName' },
        { label: 'Phone Number', value: 'phoneNumber' },
    ];
    const [sortField, setSortField] = useState('firstName');

    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);

    const [page, setPage] = useState(0);
    const [size, setSize] = useState(10);
    const [totalPages, setTotalPages] = useState(0);

    const [showDropdown, setShowDropdown] = useState(false);

    const [showModal, setShowModal] = useState(false);
    const [modalContent, setModalContent] = useState(null);
    const [modalKey, setModalKey] = useState(0);

    const [imageUrls, setImageUrls] = useState({});


    const editIcon = '/edit-icon-png-3587.png';
    const deleteIcon = '/trash-can-icon-28680.png';
    const EditIcon = () => <img src={editIcon} alt="Edit" />;
    const DeleteIcon = () => <img src={deleteIcon} alt="Delete" />;

    useEffect(() => {
        fetchContacts();
    }, [sortField, sortOrder, page, size, searchQuery]);
    const toggleDropdown = () => {
        setShowDropdown(!showDropdown);
    };

    const fetchContacts = async () => {
        try {
            const response = await axios.get(`http://localhost:8080/api/contacts?query=${searchQuery}&page=${page}&size=${size}&sortField=${sortField}&sortOrder=${sortOrder}`);
            setContacts(response.data.content);
            setTotalPages(response.data.totalPages);

            const imageUrlPromises = response.data.content.map(async (contact) => {
                if (contact.image) {
                    if (typeof contact.image === 'string') {
                        return { id: contact.id, imageUrl: `data:image/jpeg;base64,${contact.image}` };
                    } else {
                        const imageBlob = new Blob([contact.image.data], { type: 'image/jpeg' });
                        const imageUrl = URL.createObjectURL(imageBlob);
                        return { id: contact.id, imageUrl };
                    }
                } else {
                    return { id: contact.id, imageUrl: null };
                }
            });

            const imageUrlData = await Promise.all(imageUrlPromises);
            const imageUrlMap = Object.fromEntries(imageUrlData.map(({ id, imageUrl }) => [id, imageUrl]));
            setImageUrls(imageUrlMap);
        } catch (error) {
            console.error('Error fetching contacts:', error);
        }
    };

    const getInitials = (contact) => {
        const imageUrl = imageUrls[contact.id];
        if (imageUrl) {
            return <img src={imageUrl} alt="Contact Avatar" />;
        } else {
            const firstName = contact.firstName ? contact.firstName.charAt(0).toUpperCase() : '';
            const lastName = contact.lastName ? contact.lastName.charAt(0).toUpperCase() : '';
            return `${firstName}${lastName}`;
        }
    };


    const handleAddContact = async (newContact) => {
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
            handleCloseModal();
        } catch (error) {
            if (error.response.data) {
                const errorMessage = error.response.data[0].code;
                alert(errorMessage);
            } else {
                console.error('Error adding contact:', error);
            }
        }
    };

    const handleUpdateContact = async (contact) => {
        try {
            const response = await axios.put(`http://localhost:8080/api/contacts/${contact.id}`, contact);
            setContacts(contacts.map((c) => (c.id === contact.id ? response.data : c)));
            setEditingContact(null);
            handleCloseModal();
        } catch (error) {
            if (error.response.data) {
                const errorMessage = error.response.data[0].code;
                alert(errorMessage);
            } else {
                console.error('Error adding contact:', error);
            }
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

    const indexOfLastContact = currentPage * itemsPerPage;
    const indexOfFirstContact = indexOfLastContact - itemsPerPage;
    const currentContacts = filteredContacts.slice(indexOfFirstContact, indexOfLastContact);




    const openModalForAdding = () => {
        setModalContent({
            onSubmit: handleAddContact,
            initialContact: null,
        });
        handleOpenModal();
    };


    const openModalForUpdating = (contact) => {
        setModalContent({
            onSubmit: handleUpdateContact,
            initialContact: contact,
        });
        handleOpenModal();
    };

    const handleOpenModal = () => {
        setShowModal(true);
        setModalKey(prevKey => prevKey + 1);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setModalKey(prevKey => prevKey + 1);
    };

    const handleDeleteContact = async (id) => {
        try {
            await axios.delete(`http://localhost:8080/api/contacts/${id}`);
            setContacts(contacts.filter((contact) => contact.id !== id));
            fetchContacts();
        } catch (error) {
            console.error('Error deleting contact:', error);
        }
    };

    const handleExportContacts = async () => {
        try {
            const response = await axios.get('http://localhost:8080/api/contacts/export', { responseType: 'blob' });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'contacts.csv');
            document.body.appendChild(link);
            link.click();
        } catch (error) {
            console.error('Error exporting contacts:', error);
        }
    };

    const handleImportContacts = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await axios.post('http://localhost:8080/api/contacts/import', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            console.log(response.data);
            fetchContacts();
        } catch (error) {
            console.error('Error importing contacts:', error);
        }
    };



    return (
        <div>
            <h1>Contact List</h1>
            <input
                type="text"
                placeholder="Search contacts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
            />
            <div className="actions-container">
                <div className="sort-container">
                    <label>Sort By:</label>
                    <select value={sortField} onChange={(e) => setSortField(e.target.value)} className="sort-select">
                        {sortFields.map((field) => (
                            <option key={field.value} value={field.value}>
                                {field.label}
                            </option>
                        ))}
                    </select>
                    <div className="sort-order">
                        <button
                            className={`sort-order-button ${sortOrder === 'asc' ? 'active' : ''}`}
                            onClick={() => setSortOrder('asc')}
                        >↑
                            <i className="fas fa-sort-up"></i>
                        </button>
                        <button
                            className={`sort-order-button ${sortOrder === 'desc' ? 'active' : ''}`}
                            onClick={() => setSortOrder('desc')}
                        >↓
                            <i className="fas fa-sort-down"></i>
                        </button>
                    </div>
                </div>
                <div className={`dropdown ${showDropdown ? 'open' : ''}`}>
                    <button className="dropdown-toggle" onClick={toggleDropdown}>
                        Actions <span className="caret"></span>
                    </button>
                    {showDropdown && (
                        <div className="dropdown-menu">
                            <button onClick={openModalForAdding}>Add Contact</button>
                            <button onClick={handleExportContacts}>Export Contacts</button>
                            <label htmlFor="importFile" className="import-label">
                                Import Contacts
                                <input type="file" id="importFile" onChange={handleImportContacts}
                                       className="import-file"/>
                            </label>
                        </div>
                    )}
                </div>
            </div>
            <div className="contact-list-container">
                {contacts.map((contact) => (
                    <div className="contact-card">
                        <Link key={contact.id} to={`/contacts/${contact.id}`} className="contact-link">
                            <div className="contact-avatar">
                                {getInitials(contact)}
                            </div>
                            <div className="contact-info">
                                <h3>{`${contact.firstName} ${contact.lastName}`}</h3>
                                <p>{contact.phoneNumber}</p>
                            </div>
                        </Link>
                        <div className="contact-actions">
                            <button onClick={() => openModalForUpdating(contact)}>
                                <EditIcon/>
                            </button>
                            <button onClick={() => handleDeleteContact(contact.id)}>
                                <DeleteIcon/>
                            </button>
                        </div>
                    </div>
                ))}
            </div>
            <div className="pagination-container">
                <button onClick={() => setPage(page - 1)} disabled={page === 0}>
                    ←
                </button>
                <span>
    Page {page + 1} of {totalPages}
  </span>
                <button onClick={() => setPage(page + 1)} disabled={page === totalPages - 1}>
                    →
                </button>
            </div>
            <Modal isOpen={showModal} key={modalKey}
                   onClose={() => setShowModal(false)}
            >
                {modalContent && <ContactModalContent {...modalContent} />}
            </Modal>

        </div>
    );
};

export default ContactList;