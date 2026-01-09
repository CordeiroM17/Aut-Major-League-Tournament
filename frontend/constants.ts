
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
  teams: [
    { id: "t1", name: "Zapadores (ZE)", seed: 1, logo: "https://api.dicebear.com/7.x/initials/svg?seed=ZE" },
    { id: "t2", name: "Leon Usach Esports (LUE)", seed: 2, logo: "https://api.dicebear.com/7.x/initials/svg?seed=LUE" },
    { id: "t3", name: "T1 Peyker (T1P)", seed: 3, logo: "https://api.dicebear.com/7.x/initials/svg?seed=T1P" },
    { id: "t4", name: "AFG Esports (AFG)", seed: 4, logo: "https://api.dicebear.com/7.x/initials/svg?seed=AFG" },
    { id: "t5", name: "Aut-gang (AUT)", seed: 5, logo: "https://api.dicebear.com/7.x/initials/svg?seed=AUT" },
    { id: "t6", name: "Black wolves (BW)", seed: 6, logo: "https://api.dicebear.com/7.x/initials/svg?seed=BW" },
    { id: "t7", name: "Dark ascension (DRK)", seed: 7, logo: "https://api.dicebear.com/7.x/initials/svg?seed=DRK" },
    { id: "t8", name: "Runaans (RNS)", seed: 8, logo: "https://api.dicebear.com/7.x/initials/svg?seed=RNS" },
    { id: "t9", name: "Gaping (GPG)", seed: 9, logo: "https://api.dicebear.com/7.x/initials/svg?seed=GPG" },
    { id: "t10", name: "Aegis (AEG)", seed: 10, logo: "https://api.dicebear.com/7.x/initials/svg?seed=AEG" },
    { id: "t11", name: "Cuncunas (CUN)", seed: 11, logo: "https://api.dicebear.com/7.x/initials/svg?seed=CUN" },
    { id: "t12", name: "Showmaker park (SHP)", seed: 12, logo: "https://api.dicebear.com/7.x/initials/svg?seed=SHP" },
    { id: "t13", name: "Twin shadows (TWS)", seed: 13, logo: "https://api.dicebear.com/7.x/initials/svg?seed=TWS" },
    { id: "t14", name: "Raccoon Reapers (RRE)", seed: 14, logo: "https://api.dicebear.com/7.x/initials/svg?seed=RRE" },
    { id: "t15", name: "Inka (INK)", seed: 15, logo: "https://api.dicebear.com/7.x/initials/svg?seed=INK" },
    { id: "t16", name: "Phantom Edge (PE)", seed: 16, logo: "https://api.dicebear.com/7.x/initials/svg?seed=PE" },
  ],
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
        { id: "r1m4", team1Id: "t4", team2Id: "t13", score1: 0, score2: 1, winnerId: "t13", status: 'completed', details: { team1Players: generateMockPlayers("AFG"), team2Players: generateMockPlayers("TWS") } },
        { id: "r1m5", team1Id: "t5", team2Id: "t12", score1: 1, score2: 0, winnerId: "t5", status: 'completed' },
        { id: "r1m6", team1Id: "t6", team2Id: "t11", score1: 1, score2: 0, winnerId: "t6", status: 'completed' },
        { id: "r1m7", team1Id: "t7", team2Id: "t10", score1: 1, score2: 0, winnerId: "t7", status: 'completed' },
        { id: "r1m8", team1Id: "t8", team2Id: "t9", score1: 1, score2: 0, winnerId: "t8", status: 'completed' },
      ]
    },
    {
      number: 2,
      matches: [
        { id: "r2m1", team1Id: "t1", team2Id: "t13", score1: 1, score2: 0, winnerId: "t1", status: 'completed' },
        { id: "r2m2", team1Id: "t2", team2Id: "t8", score1: 1, score2: 0, winnerId: "t2", status: 'completed' },
        { id: "r2m3", team1Id: "t3", team2Id: "t7", score1: 1, score2: 0, winnerId: "t3", status: 'completed' },
        { id: "r2m4", team1Id: "t5", team2Id: "t6", score1: 0, score2: 1, winnerId: "t6", status: 'completed' },
        { id: "r2m5", team1Id: "t16", team2Id: "t4", score1: 0, score2: 1, winnerId: "t4", status: 'completed' },
        { id: "r2m6", team1Id: "t15", team2Id: "t9", score1: 1, score2: 0, winnerId: "t15", status: 'completed' },
        { id: "r2m7", team1Id: "t14", team2Id: "t10", score1: 1, score2: 0, winnerId: "t14", status: 'completed' },
        { id: "r2m8", team1Id: "t12", team2Id: "t11", score1: 0, score2: 1, winnerId: "t11", status: 'completed' },
      ]
    },
    {
      number: 3,
      matches: [
        { id: "r3m1", team1Id: "t1", team2Id: "t6", score1: 1, score2: 0, winnerId: "t1", status: 'completed' },
        { id: "r3m2", team1Id: "t2", team2Id: "t3", score1: 1, score2: 0, winnerId: "t2", status: 'completed' },
        { id: "r3m3", team1Id: "t13", team2Id: "t15", score1: 1, score2: 0, winnerId: "t13", status: 'completed' },
        { id: "r3m4", team1Id: "t8", team2Id: "t14", score1: 1, score2: 0, winnerId: "t8", status: 'completed' },
        { id: "r3m5", team1Id: "t7", team2Id: "t11", score1: 1, score2: 0, winnerId: "t7", status: 'completed' },
        { id: "r3m6", team1Id: "t5", team2Id: "t4", score1: 0, score2: 1, winnerId: "t4", status: 'completed' },
        { id: "r3m7", team1Id: "t16", team2Id: "t9", score1: 0, score2: 1, winnerId: "t9", status: 'completed' },
        { id: "r3m8", team1Id: "t10", team2Id: "t12", score1: 1, score2: 0, winnerId: "t10", status: 'completed' },
      ]
    },
    {
      number: 4,
      matches: [
        { id: "r4m1", team1Id: "t6", team2Id: "t13", score1: 1, score2: 0, winnerId: "t6", status: 'completed' },
        { id: "r4m2", team1Id: "t3", team2Id: "t8", score1: 1, score2: 0, winnerId: "t3", status: 'completed' },
        { id: "r4m3", team1Id: "t7", team2Id: "t4", score1: 0, score2: 1, winnerId: "t4", status: 'completed' },
        { id: "r4m4", team1Id: "t15", team2Id: "t9", score1: 1, score2: 0, winnerId: "t15", status: 'completed' },
        { id: "r4m5", team1Id: "t14", team2Id: "t10", score1: 1, score2: 0, winnerId: "t14", status: 'completed' },
        { id: "r4m6", team1Id: "t11", team2Id: "t5", score1: 1, score2: 0, winnerId: "t11", status: 'completed' },
      ]
    },
    {
      number: 5,
      matches: [
        { id: "r5m1", team1Id: "t13", team2Id: "t15", score1: 1, score2: 0, winnerId: "t13", status: 'completed' },
        { id: "r5m2", team1Id: "t8", team2Id: "t14", score1: 1, score2: 0, winnerId: "t8", status: 'completed' },
        { id: "r5m3", team1Id: "t7", team2Id: "t11", score1: 1, score2: 0, winnerId: "t7", status: 'completed' },
      ]
    }
  ]
};
