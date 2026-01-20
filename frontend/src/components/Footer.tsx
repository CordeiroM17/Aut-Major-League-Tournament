import React from 'react';

export const Footer: React.FC = () => {
    return (
      <footer className="flex flex-col items-center text-center gap-6 bg-[#152a42] p-16 border-t border-slate-800">
        <img className="w-32 opacity-90" src="Aut-Logo.png" alt="Aut Logo" />
        
        <div className="flex items-center gap-6">
           {/* Instagram */}
           <a href="https://www.instagram.com/aut_major_league/" target="_blank" rel="noopener noreferrer" className="group p-3 bg-white/5 rounded-full hover:bg-[#d7b84a] transition-all duration-300">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white group-hover:text-[#152a42]">
                 <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
              </svg>
           </a>

           {/* Twitch */}
           <a href="https://www.twitch.tv/autmajorleague" target="_blank" rel="noopener noreferrer" className="group p-3 bg-white/5 rounded-full hover:bg-[#9146FF] transition-all duration-300">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                 <path d="M21 2H3v16h5v4l4-4h5l4-4V2zm-10 9V7m5 4V7"/>
              </svg>
           </a>

            {/* Discord */}
           <a href="https://discord.gg/zgZ8a8EYbm" target="_blank" rel="noopener noreferrer" className="group p-3 bg-white/5 rounded-full hover:bg-[#5865F2] transition-all duration-300">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                 <circle cx="9" cy="12" r="1"/><circle cx="15" cy="12" r="1"/><path d="M7.5 7.5c3.5-1 5.5-1 9 0"/><path d="M7 16.5c3.5 1 6.5 1 10 0"/><path d="M2 12c0 5 2 9 7 11 0-4-2-6-3-7 4-1 8-1 12 0-1 1-3 3-3 7 5-2 7-6 7-11S17 2 12 2 7 2 2 12z"/>
              </svg>
           </a>
        </div>

        <p className="text-slate-400 text-sm">© 2026 AUT Major League. Todos los derechos reservados.</p>
      </footer>
    )
}