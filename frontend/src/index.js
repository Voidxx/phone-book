import React from 'react';
import './styles.css';
import ContactList from './ContactList';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ContactDetails from "./ContactDetails";
import { createRoot } from "react-dom/client";

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<ContactList />} />
                <Route path="/contacts/:id" element={<ContactDetails />} />
            </Routes>
        </Router>
    );
};

const container = document.getElementById('root');
const root = createRoot(container);

root.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>,
);