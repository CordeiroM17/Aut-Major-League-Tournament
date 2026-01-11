
export type Role = 'TOP' | 'JG' | 'MID' | 'ADC' | 'SUP';

export interface PlayerStats {
  name: string;
  role: Role;
  champion: string;
  k: number;
  d: number;
  a: number;
}

export interface MatchDetails {
  team1Players: PlayerStats[];
  team2Players: PlayerStats[];
}

export interface Team {
  id: string;
  name: string;
  logo: string;
  seed: number;
}

export interface Match {
  id: string;
  team1Id: string;
  team2Id: string;
  score1: number;
  score2: number;
  winnerId: string | null;
  status: 'completed' | 'pending';
  details?: MatchDetails;
}

export interface Round {
  number: number;
  matches: Match[];
}

export interface TournamentData {
  name: string;
  teams: Team[];
  rounds: Round[];
}

export interface TeamStats {
  teamId: string;
  wins: number;
  losses: number;
  buchholz: number;
  status: 'active' | 'qualified' | 'eliminated';
}
