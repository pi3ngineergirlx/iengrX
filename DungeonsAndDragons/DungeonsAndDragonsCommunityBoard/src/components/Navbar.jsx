import React from 'react';
import { Link } from 'react-router-dom';

const defaultLinks = [
    { to: '/', label: 'Home' },
    { to: '/characterdesigner', label: 'Character Designer' }
];

const Navbar = ({ links = defaultLinks }) => {
    return (
        <header className="navbar">
            <nav className="nav-inner">
                {links.map((link) => (
                    <Link key={link.to} to={link.to} className="nav-link">
                        {link.label}
                    </Link>
                ))}
            </nav>
        </header>
    );
};

export default Navbar;