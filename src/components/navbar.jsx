import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    { label: 'Work', href: '/#work' },
    { label: 'About', href: '/about' },
    { label: 'Contact', href: '/#contact' },
  ];

  return (
    <>
      <nav className="w-full fixed top-0 left-0 z-30 bg-transparent text-white mix-blend-difference">
        <div className="w-full px-4 sm:px-6 md:px-10 lg:px-16 py-3 flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="text-lg md:text-xl font-medium uppercase tracking-tight cursor-pointer">
            nino
          </Link>

          {/* Desktop links */}
          <div className="hidden md:flex gap-10 font-medium uppercase tracking-tight text-sm md:text-base">
            {menuItems.map(({ label, href }) => (
              <Link key={label} to={href} onClick={() => setIsOpen(false)} className="cursor-pointer">
                {label}
              </Link>
            ))}
          </div>

          {/* Mobile Hamburger */}
          <div className="md:hidden relative z-40">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="focus:outline-none"
              aria-label="Toggle menu"
            >
              {isOpen ? (
                <svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h20M4 14h20M4 22h20" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Dropdown menu — fuera del subárbol con mix-blend-mode del nav, para que quede opaco normal */}
      {isOpen && (
        <div className="md:hidden fixed top-16 right-4 w-40 bg-white text-[#1D212A] border border-black/10 rounded-lg flex flex-col gap-3 py-4 px-6 z-40">
          {menuItems.map(({ label, href }) => (
            <Link
              key={label}
              to={href}
              onClick={() => setIsOpen(false)}
              className="font-medium uppercase tracking-tight text-sm cursor-pointer transition-colors duration-300 hover:text-[#385BF0]"
            >
              {label}
            </Link>
          ))}
        </div>
      )}
    </>
  );
}
