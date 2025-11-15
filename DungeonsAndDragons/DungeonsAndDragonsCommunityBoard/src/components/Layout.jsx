import React from 'react'
import { Outlet, Link } from 'react-router-dom'

// Inline navbar markup so Layout owns the navbar and Navbar.jsx can be removed.
export default function Layout() {
  const links = [
    { to: '/', label: 'Home' },
    { to: '/characterdesigner', label: 'Character Designer' }
  ]

  return (
    <div>
      <header className="navbar">
        <nav className="nav-inner">
          {links.map(link => (
            <Link key={link.to} to={link.to} className="nav-link">{link.label}</Link>
          ))}
        </nav>
      </header>
      <main>
        <Outlet />
      </main>
    </div>
  )
}