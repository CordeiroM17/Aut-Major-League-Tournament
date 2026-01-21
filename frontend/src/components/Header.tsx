import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const navLinks = [
  { label: 'Overview', href: '/', activeKey: 'overview' },
  { label: 'Equipos', href: '#equipos', activeKey: 'equipos' },
  { label: 'Reglamento', href: '/reglamento', activeKey: 'reglamento' },
  { label: 'Inscribirse', href: 'https://forms.gle/cEAKt88AKbkG64FU9', activeKey: 'inscribirse' },
  { label: 'Discord', href: '/discord', activeKey: 'discord' },
  { label: 'Swiss', href: '/swiss', activeKey: 'swiss' },
  { label: 'Playoffs', href: '/playoffs', activeKey: 'playoffs' }
];

export const Header: React.FC<{ active?: string }> = ({ active }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleNav = (link: typeof navLinks[0]) => {
    setMenuOpen(false);
    if (link.label === 'Equipos') {
      navigate('/');
      setTimeout(() => {
        const equiposSection = document.getElementById('equipos');
        if (equiposSection) {
          equiposSection.scrollIntoView({ behavior: 'smooth' });
        }
      }, 300);
      return;
    }
    if (link.label === 'Overview') {
      navigate('/');
      return;
    }
    if (link.href.startsWith('http')) {
      window.open(link.href, '_blank');
    } else {
      navigate(link.href);
    }
  };

  return (
    <header className="bg-[#18283a] border-b border-[#152A42] sticky top-0 z-30 shadow-sm" style={{ height: '100px' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between">
        <div className="flex items-center h-full">
          <img src="/src/resources/Logo 3.png" alt="Logo AUT" className="h-14 w-auto" />
        </div>
        {/* Desktop nav */}
        <nav className="hidden md:flex items-center h-full justify-center flex-1">
          {navLinks.map((link, idx) => (
            <React.Fragment key={link.label}>
              <button
                className={`px-6 text-[18px] font-bold transition-colors duration-200 ${active === link.activeKey ? 'text-[#d7b84a]' : 'text-white hover:text-[#d7b84a]'} bg-transparent`}
                style={{ outline: 'none', border: 'none', background: 'none', cursor: 'pointer' }}
                onClick={() => handleNav(link)}
              >
                {link.label}
              </button>
              {idx < navLinks.length - 1 && (
                <span className="h-8 border-l border-[#f3f3f3] mx-2"></span>
              )}
            </React.Fragment>
          ))}
        </nav>
        {/* Mobile menu button */}
        <button
          className="md:hidden flex items-center justify-center p-2 rounded focus:outline-none focus:ring-2 focus:ring-[#d7b84a]"
          onClick={() => setMenuOpen((v) => !v)}
          aria-label="Abrir menú"
        >
          <svg className="w-8 h-8 text-[#d7b84a]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        {/* Mobile nav dropdown */}
        {menuOpen && (
          <div className="absolute top-full right-4 mt-2 w-56 bg-[#18283a] border border-[#152A42] rounded-lg shadow-lg flex flex-col z-50 animate-fade-in">
            {navLinks.map((link, idx) => (
              <button
                key={link.label}
                className={`w-full text-left px-6 py-3 text-[18px] font-bold transition-colors duration-200 ${active === link.activeKey ? 'text-[#d7b84a]' : 'text-white hover:text-[#d7b84a]'} bg-transparent border-b border-[#152A42] last:border-b-0`}
                style={{ outline: 'none', border: 'none', background: 'none', cursor: 'pointer' }}
                onClick={() => handleNav(link)}
              >
                {link.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </header>
  );
};
