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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-blue-secondary/90">
      <div className="bg-blue-surface rounded-xl shadow-lg p-4 mx-4 max-w-lg w-full relative" style={{ marginTop: '96px', maxHeight: '80vh', overflowY: 'auto' }}>
        <button
          className="absolute top-4 right-4 text-gold text-5xl font-bold hover:text-text-main cursor-pointer"
          onClick={onClose}
          aria-label="Cerrar"
        >
          ×
        </button>
        <div className="flex flex-col items-center mb-6">
          <img src={logo} alt={name} className="w-24 h-24 rounded-full mb-2 object-cover border-2 border-gold" />
          <h2 className="text-2xl font-bold text-gold mb-1">{name}</h2>
          <p className="text-text-main text-center mb-2">{description}</p>
        </div>
        <div>
          <h3 className="text-lg font-bold text-gold mb-2">Jugadores</h3>
          <ul className="divide-y divide-slate-700">
            {mainPlayers.map((player, idx) => (
              <li key={idx} className="py-2 flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <div className="flex flex-row items-center justify-between w-full">
                  <div className="flex items-center">
                    <p className="font-semibold text-sm xs:text-base text-text-main">{player.name}</p>
                    {player.isSub && <h3 className="text-2xl font-bold text-gold mb-1">(Suplente)</h3>}
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
                        <span className="text-sm text-gold">{player.role}</span>
                      )}
                    </span>
                    <button
                      onClick={() => window.open(player.opgg, '_blank')}
                      className="text-gold hover:underline text-sm cursor-pointer"
                    >
                      op.gg
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
          {subs.length > 0 && (
            <>
              <h3 className="text-lg font-bold text-gold mt-6 mb-2">Suplentes</h3>
              <ul className="divide-y divide-slate-700">
                {subs.map((player, idx) => (
                  <li key={idx} className="py-2 flex flex-col sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex flex-row items-center justify-between w-full">
                      <div className="flex items-center">
                        <p className="font-semibold text-sm xs:text-base text-text-main">{player.name}</p>
                        {player.isSub && <h3 className="text-2xl font-bold text-gold mb-1">(Suplente)</h3>}
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
                            <span className="text-sm text-gold">{player.role}</span>
                          )}
                        </span>
                        <button
                          onClick={() => window.open(player.opgg, '_blank')}
                          className="text-gold hover:underline text-sm cursor-pointer"
                        >
                          op.gg
                        </button>
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
