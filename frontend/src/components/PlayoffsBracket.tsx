import React from 'react';
import { Crown } from 'lucide-react';

interface Team {
  name: string;
  logo: string;
  score: number;
}

interface Match {
  id: string;
  round: string;
  team1: Team;
  team2: Team;
  winner: string;
}

interface PlayoffBracketProps {
  matches: Match[];
}

const MatchCard: React.FC<{ match: Match; isFinal?: boolean }> = ({ match, isFinal }) => {
  const isTeam1Winner = match.winner === 'team1';
  const isTeam2Winner = match.winner === 'team2';

  return (
    <div className={`relative bg-white border ${isFinal ? 'border-amber-200 shadow-amber-100/50 ring-1 ring-amber-100' : 'border-slate-200'} rounded-xl shadow-sm w-full overflow-hidden z-20 transition-transform hover:scale-105 duration-200 group`}>
       {isFinal && (
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-amber-300 via-amber-500 to-amber-300" />
      )}
      <div className="p-3 space-y-2">
        {/* Team 1 */}
        <div className={`flex justify-between items-center p-2 rounded-lg transition-colors ${isTeam1Winner ? 'bg-gold/20' : 'group-hover:bg-slate-50'}`}>
          <div className="flex items-center space-x-3 overflow-hidden">
             {match.team1.logo ? (
                 <img src={match.team1.logo} alt={match.team1.name} className="w-6 h-6 rounded-full object-cover border border-slate-100" />
             ) : (
                <div className="w-6 h-6 rounded-full bg-slate-100 border border-slate-200 flex-shrink-0" />
             )}
            <span className={`text-xs font-bold truncate ${isTeam1Winner ? 'text-blue-primary' : 'text-text-dark'}`}>
              {match.team1.name}
            </span>
          </div>
          <span className={`text-sm font-black ${isTeam1Winner ? 'text-gold' : 'text-slate-400'}`}>
            {match.team1.score}
          </span>
        </div>

        {/* Divider */}
        <div className="h-px bg-slate-100 mx-2" />

        {/* Team 2 */}
        <div className={`flex justify-between items-center p-2 rounded-lg transition-colors ${isTeam2Winner ? 'bg-gold/20' : 'group-hover:bg-slate-50'}`}>
           <div className="flex items-center space-x-3 overflow-hidden">
             {match.team2.logo ? (
                 <img src={match.team2.logo} alt={match.team2.name} className="w-6 h-6 rounded-full object-cover border border-slate-100" />
             ) : (
                <div className="w-6 h-6 rounded-full bg-slate-100 border border-slate-200 flex-shrink-0" />
             )}
            <span className={`text-xs font-bold truncate ${isTeam2Winner ? 'text-blue-primary' : 'text-text-dark'}`}>
              {match.team2.name}
            </span>
          </div>
          <span className={`text-sm font-black ${isTeam2Winner ? 'text-gold' : 'text-slate-400'}`}>
            {match.team2.score}
          </span>
        </div>
      </div>
      
      {isFinal && (
        <div className="absolute -top-1 -right-1">
             <div className="bg-amber-100 rounded-bl-lg p-1">
                <Crown className="w-4 h-4 text-amber-500 fill-amber-300" />
             </div>
        </div>
      )}
    </div>
  );
};

export const PlayoffBracket: React.FC<PlayoffBracketProps> = ({ matches }) => {
  const qfMatches = matches.filter(m => m.round === 'QF');
  const sfMatches = matches.filter(m => m.round === 'SF');
  const thirdPlaceMatch = matches.find(m => m.round === 'T');
  const finalMatch = matches.find(m => m.round === 'F');

  const showQF = qfMatches.length > 0;
  const showSF = sfMatches.length > 0;
  const showF = !!finalMatch;

  const activeCols = (showQF ? 1 : 0) + (showSF ? 1 : 0) + (showF ? 1 : 0);
  
  // Determine grid class
  let gridClass = 'grid-cols-1';
  let minWidthClass = 'min-w-[320px]'; // Default small
  if (activeCols === 2) {
    gridClass = 'grid-cols-2';
    minWidthClass = 'min-w-[768px]';
  } else if (activeCols === 3) {
    gridClass = 'grid-cols-3';
    minWidthClass = 'min-w-[1024px]';
  }

  // Helper to draw connector lines for QF -> SF
  const QFConnector = ({ index }: { index: number }) => {
     // Even index (0, 2) is top of pair, Odd index (1, 3) is bottom
     const isTop = index % 2 === 0;
     // Only show if SF exists
     if (!showSF) return null;

     return (
         <>
            {/* Horizontal from card */}
            <div className="absolute left-full top-1/2 w-8 h-px bg-black" />
            {/* Vertical Segment */}
            <div className={`absolute left-[calc(100%+32px)] w-px bg-black ${isTop ? 'h-[calc(50%+24px)] top-1/2' : 'h-[calc(50%+24px)] bottom-1/2'}`} />
            {/* Horizontal into SF (only on one of the pair, ideally, but we can rely on the SF incoming line) */}
         </>
     )
  }

  return (
    <div className="w-full overflow-x-auto pb-8">
      <div className={`${minWidthClass} transition-all duration-500`}>
        <div className={`grid ${gridClass} gap-16 w-full mb-8 transition-all duration-500`} >
          {showQF && (
            <div className="text-center bg-gold text-blue-primary p-2 rounded-lg uppercase font-bold text-xs shadow-md animate-in fade-in slide-in-from-top-4">
                Cuartos de final
            </div>
          )}
          {showSF && (
            <div className="text-center bg-gold text-blue-primary p-2 rounded-lg uppercase font-bold text-xs shadow-md animate-in fade-in slide-in-from-top-4 delay-100">
                Semifinales
            </div>
          )}
          {showF && (
            <div className="text-center bg-gold text-blue-primary p-2 rounded-lg uppercase font-bold text-xs shadow-md animate-in fade-in slide-in-from-top-4 delay-200">
                Final
            </div>  
          )}
        </div>
        
       <div className={`grid ${gridClass} gap-16 w-full transition-all duration-500`}>
          {/* Quarter Finals Column */}
          {showQF && (
            <div className="flex flex-col justify-center space-y-8 z-10 animate-in fade-in slide-in-from-left-4 duration-500">
                {qfMatches.map((match, i) => (
                    <div key={match.id} className="relative flex items-center cursor-pointer">
                        <MatchCard match={match} />
                        <QFConnector index={i} />
                    </div>
                ))}
            </div>
          )}

          {/* Semifinals Column */} 
          {/* Spacing logic: The SF match should be centered between its QF source pair. 
              QF1 is at 0, QF2 is at H + 48 (12 gap + cards). 
              We adjust space-y to align visual center. */}
            {showSF && (
                <div className="flex flex-col justify-center z-10 relative animate-in fade-in slide-in-from-left-4 duration-500 delay-150 h-full">
                    {/* Main Semifinals Bracket */}
                    <div className="flex flex-col space-y-[180px] w-full">
                        {sfMatches.map((match, i) => (
                            <div key={match.id} className="relative flex items-center cursor-pointer">
                                {/* Incoming Connector from QF Pair - Only if QF showed */}
                                {showQF && <div className="absolute -left-8 w-8 h-px bg-black" />}
                                
                                <MatchCard match={match} />

                                {/* Outgoing Connector to Final - Only if Final showed */}
                                {showF && (
                                    <>
                                        <div className="absolute left-full w-8 h-px bg-black" />
                                        {/* Vertical Joiner */}
                                        <div className={`absolute left-[calc(100%+32px)] w-px bg-black ${i === 0 ? 'h-[calc(50%+140px)] top-1/2' : 'h-[calc(50%+140px)] bottom-1/2'}`} />
                                    </>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}

          {/* Final Column */}
            {showF && (
                <div className="flex flex-col justify-center z-10 relative animate-in fade-in slide-in-from-left-4 duration-500 delay-300">
                    {finalMatch && (
                        <div className="relative flex flex-col items-center cursor-pointer">
                            <div className="relative w-full">
                                {/* Incoming Connector - Only if SF showed */}
                                {showSF && <div className="absolute -left-8 top-1/2 w-8 h-px bg-black" />}
                                <MatchCard match={finalMatch} isFinal />
                            </div>
                            
                            <div className="mt-6 text-center animate-in fade-in slide-in-from-bottom-4 duration-700 delay-500">
                                    <span className="text-amber-500 font-bold tracking-widest uppercase text-[10px] bg-amber-50 px-3 py-1 rounded-full border border-amber-100">Grand Final Winner</span>
                                    <div className="text-2xl font-black text-slate-800 mt-3 flex flex-col items-center flex-wrap break-words w-full">
                                        {finalMatch.winner === 'team1' ? (
                                            <>
                                                {finalMatch.team1.logo && <img src={finalMatch.team1.logo} className="w-16 h-16 rounded-full mb-2 border-2 border-amber-400 p-0.5" />}
                                                {finalMatch.team1.name}
                                            </>
                                        ) : finalMatch.winner === 'team2' ? (
                                            <>
                                                {finalMatch.team2.logo && <img src={finalMatch.team2.logo} className="w-16 h-16 rounded-full mb-2 border-2 border-amber-400 p-0.5" />}
                                                {finalMatch.team2.name}
                                            </>
                                        ) : (
                                            <span className="text-slate-400 text-sm italic">Por definir</span>
                                        )}
                                    </div>
                                </div>
                        </div>
                    )}
                    {/* Third Place Match */}
                    {thirdPlaceMatch && (
                        <div className="absolute top-[calc(100%-80px)] left-0 right-0 flex flex-col items-center">
                             <div className="flex items-center space-x-2 text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 bg-slate-100 px-3 py-1 rounded-full border border-slate-200">
                                <span className="w-2 h-2 rounded-full bg-orange-400" />
                                <span>Tercer Puesto</span>
                             </div>
                             <MatchCard match={thirdPlaceMatch} />
                        </div>
                    )}
                </div>
            )}
       </div>
      </div>
    </div>
  );
};
