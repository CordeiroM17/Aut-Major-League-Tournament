
import { TournamentData, Role } from './types';

const roles: Role[] = ['TOP', 'JNG', 'MID', 'ADC', 'SUP'];
const generateMockPlayers = (prefix: string) => roles.map(role => ({
  name: `${prefix} ${role}`,
  role,
  champion: role === 'TOP' ? 'Garen' : role === 'JNG' ? 'JarvanIV' : role === 'MID' ? 'Ahri' : role === 'ADC' ? 'Ezreal' : 'Thresh',
  k: Math.floor(Math.random() * 10),
  d: Math.floor(Math.random() * 5),
  a: Math.floor(Math.random() * 15),
}));

export const SWISS_TOURNAMENT_DATA: TournamentData = {
  name: "League of Legends: Swiss Masters",
  teams: [],
  rounds: [
    {
      number: 1,
      matches: [
        { 
          id: "r1m1", team1Id: "t1", team2Id: "t16", score1: 1, score2: 0, winnerId: "t1", status: 'completed',
          details: { team1Players: generateMockPlayers("ZE"), team2Players: generateMockPlayers("PE") }
        },
        { id: "r1m2", team1Id: "t2", team2Id: "t15", score1: 1, score2: 0, winnerId: "t2", status: 'completed', details: { team1Players: generateMockPlayers("LUE"), team2Players: generateMockPlayers("INK") } },
        { id: "r1m3", team1Id: "t3", team2Id: "t14", score1: 1, score2: 0, winnerId: "t3", status: 'completed', details: { team1Players: generateMockPlayers("T1P"), team2Players: generateMockPlayers("RRE") } },
        { id: "r1m4", team1Id: "t4", team2Id: "t13", score1: 0, score2: 0, winnerId: "t13", status: 'pending' },
        { id: "r1m5", team1Id: "t5", team2Id: "t12", score1: 0, score2: 0, winnerId: "t5", status: 'pending' },
        { id: "r1m6", team1Id: "t6", team2Id: "t11", score1: 0, score2: 0, winnerId: "t6", status: 'pending' },
        { id: "r1m7", team1Id: "t7", team2Id: "t10", score1: 0, score2: 0, winnerId: "t7", status: 'pending' },
        { id: "r1m8", team1Id: "t8", team2Id: "t9", score1: 0, score2: 0, winnerId: "t8", status: 'pending' },
      ]
    },
    {
      number: 2,
      matches: []
    },
    {
      number: 3,
      matches: []
    },
    {
      number: 4,
      matches: []
    },
    {
      number: 5,
      matches: []
    }
  ]
};
