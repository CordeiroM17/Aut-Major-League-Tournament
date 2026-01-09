
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
  buchholz: number; // Sum of wins of opponents
  status: 'active' | 'qualified' | 'eliminated';
}
