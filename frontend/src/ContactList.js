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

    const [searchTerm, setSearchTerm] = useState('');

    const [sortOrder, setSortOrder] = useState('asc');

    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);

    const [showDropdown, setShowDropdown] = useState(false);

    const [showModal, setShowModal] = useState(false);
    const [modalContent, setModalContent] = useState(null);
    const [modalKey, setModalKey] = useState(0);

    const editIcon = '/edit-icon-png-3587.png';
    const deleteIcon = '/trash-can-icon-28680.png';
    const EditIcon = () => <img src={editIcon} alt="Edit" />;
    const DeleteIcon = () => <img src={deleteIcon} alt="Delete" />;

    useEffect(() => {
        fetchContacts();
    }, []);

    const toggleDropdown = () => {
        setShowDropdown(!showDropdown);
    };

    const fetchContacts = async () => {
        try {
            const response = await axios.get('http://localhost:8080/api/contacts');
            setContacts(response.data);
        } catch (error) {
            console.error('Error fetching contacts:', error);
        }
    };

    const sortedContacts = contacts.sort((a, b) => {
        const fieldA = a.firstName.toLowerCase();
        const fieldB = b.firstName.toLowerCase();

        if (fieldA < fieldB) return sortOrder === 'asc' ? -1 : 1;
        if (fieldA > fieldB) return sortOrder === 'asc' ? 1 : -1;
        return 0;
    });

    const handleSortByField = (field) => {
        // Implement sorting logic based on the selected field
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

    const indexOfLastContact = currentPage * itemsPerPage;
    const indexOfFirstContact = indexOfLastContact - itemsPerPage;
    const currentContacts = filteredContacts.slice(indexOfFirstContact, indexOfLastContact);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const handleUpdateContact = async (contact) => {
        try {
            const response = await axios.put(`http://localhost:8080/api/contacts/${contact.id}`, contact);
            setContacts(contacts.map((c) => (c.id === contact.id ? response.data : c)));
            setEditingContact(null);
            handleCloseModal();
        } catch (error) {
            console.error('Error updating contact:', error);
        }
    };

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
                value={searchTerm}
                onChange={handleSearchChange}
            />
            <div className="actions-container">
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
                {currentContacts.map((contact) => (
                    <div key={contact.id} className="contact-item">
                            <>
                                <Link to={`/contacts/${contact.id}`}>
                                    <div>
                                        {contact.firstName} {contact.lastName}
                                    </div>
                                </Link>
                                <button onClick={() => openModalForUpdating(contact)}><EditIcon /></button>
                                <button onClick={() => handleDeleteContact(contact.id)}><DeleteIcon /></button>
                            </>
                    </div>
                ))}
            </div>
            <div>
                <button onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1}>
                    ←
                </button>
                <button
                    onClick={() => paginate(currentPage + 1)}
                    disabled={indexOfLastContact >= filteredContacts.length}
                >
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