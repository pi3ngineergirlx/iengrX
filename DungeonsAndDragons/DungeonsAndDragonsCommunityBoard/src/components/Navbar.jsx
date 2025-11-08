import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = ({ links = [{ to: '/', label: 'Home' }] }) => {
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