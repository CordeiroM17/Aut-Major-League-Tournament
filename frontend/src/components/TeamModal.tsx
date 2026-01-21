import React from 'react';

export interface TeamPlayer {
  name: string;
  role: string;
  opgg: string;
  isSub?: boolean;
}

export interface TeamModalProps {
  open: boolean;
  onClose: () => void;
  logo: string;
  name: string;
  description: string;
  players: TeamPlayer[];
}

import topIcon from '../resources/top.png';
import jgIcon from '../resources/jg.png';
import midIcon from '../resources/mid.png';
import adcIcon from '../resources/adc.png';
import suppIcon from '../resources/supp.png';

const roleImages: Record<string, string> = {
  TOP: topIcon,
  JG: jgIcon,
  MID: midIcon,
  ADC: adcIcon,
  SUP: suppIcon,
};


export const TeamModal: React.FC<TeamModalProps> = ({ open, onClose, logo, name, description, players }) => {
  if (!open) return null;

  const mainPlayers = players.slice(0, 5);
  const subs = players.slice(5);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: 'rgba(12, 28, 47, 0.88)' }}>
      <div className="bg-[#101a27] rounded-xl shadow-lg p-8 max-w-lg w-full relative" style={{ marginTop: '96px', maxHeight: '80vh', overflowY: 'auto' }}>
        <button
          className="absolute top-4 right-4 text-[#d7b84a] text-2xl font-bold hover:text-[#f3f3f3]"
          onClick={onClose}
          aria-label="Cerrar"
        >
          ×
        </button>
        <div className="flex flex-col items-center mb-6">
          <img src={logo} alt={name} className="w-24 h-24 rounded-full mb-2 object-cover border-2 border-[#d7b84a]" />
          <h2 className="text-2xl font-bold text-[#d7b84a] mb-1">{name}</h2>
          <p className="text-[#f3f3f3] text-center mb-2">{description}</p>
        </div>
        <div>
          <h3 className="text-lg font-bold text-[#d7b84a] mb-2">Jugadores</h3>
          <ul className="divide-y divide-[#2a3a54]">
            {mainPlayers.map((player, idx) => (
              <li key={idx} className="py-2 flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <div className="flex flex-row items-center justify-between w-full">
                  <div className="flex items-center">
                    <span className="font-semibold text-[#f3f3f3]">{player.name}</span>
                    {player.isSub && <span className="ml-2 text-xs text-[#d7b84a]">(Suplente)</span>}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="align-middle">
                      {roleImages[player.role] ? (
                        <img
                          src={roleImages[player.role]}
                          alt={player.role}
                          className="inline w-6 h-6 object-contain align-middle"
                          title={player.role}
                        />
                      ) : (
                        <span className="text-sm text-[#d7b84a]">{player.role}</span>
                      )}
                    </span>
                    <a
                      href={player.opgg}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#d7b84a] hover:underline text-sm"
                    >
                      opgg
                    </a>
                  </div>
                </div>
              </li>
            ))}
          </ul>
          {subs.length > 0 && (
            <>
              <h3 className="text-lg font-bold text-[#d7b84a] mt-6 mb-2">Suplentes</h3>
              <ul className="divide-y divide-[#2a3a54]">
                {subs.map((player, idx) => (
                  <li key={idx} className="py-2 flex flex-col sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex flex-row items-center justify-between w-full">
                      <div className="flex items-center">
                        <span className="font-semibold text-[#f3f3f3]">{player.name}</span>
                        {player.isSub && <span className="ml-2 text-xs text-[#d7b84a]">(Suplente)</span>}
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="align-middle">
                          {roleImages[player.role] ? (
                            <img
                              src={roleImages[player.role]}
                              alt={player.role}
                              className="inline w-6 h-6 object-contain align-middle"
                              title={player.role}
                            />
                          ) : (
                            <span className="text-sm text-[#d7b84a]">{player.role}</span>
                          )}
                        </span>
                        <a
                          href={player.opgg}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[#d7b84a] hover:underline text-sm"
                        >
                          opgg
                        </a>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
