import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ContactList from './ContactList';
import ContactDetails from './ContactDetails';

const App = () => {
    return (
        <Router>
            <Routes>
                <Route exact path="/" component={ContactList} />
                <Route path="/contacts/:id" component={ContactDetails} />
            </Routes>
        </Router>
    );
};

export default App;