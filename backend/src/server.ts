// Extender el tipo Request para incluir user
declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}
// Middleware para verificar el token
function authenticateToken(req: Request, res: Response, next: Function) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  const jwtSecret = process.env.JWT_SECRET;

  if (!token || !jwtSecret) {
    return res.status(401).json({ error: 'Token no proporcionado o secreto no configurado.' });
  }

  require('jsonwebtoken').verify(token, jwtSecret, (err: any, user: any) => {
    if (err) return res.status(403).json({ error: 'Token inválido.' });
    req.user = user;
    next();
  });
}
import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectMongo } from './utils/connections';
import teamRoutes from './routes/teamRoutes';
import matchRoutes from './routes/matchRoutes';
import tournamentRoutes from './routes/tournamentRoutes';
import playoffMatchRoutes from './playoffs/playoffMatchRoutes';

dotenv.config();
connectMongo(); 

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Middleware para GET públicos solo si el origen es permitido
function publicGetOnlyFromAllowedOrigin(req: Request, res: Response, next: Function) {
  const allowedOrigin = process.env.CORS_ORIGIN;
  if (req.method === 'GET') {
    const origin = req.headers.origin;
    if (!allowedOrigin || origin !== allowedOrigin) {
      console.log(`[CORS ERROR] Blocked access from origin: '${origin}'. Expected: '${allowedOrigin}'`);
      return res.status(403).json({ error: 'Origen no permitido para lectura pública.', origin, expected: allowedOrigin });
    }
    return next();
  }
  // Para métodos que modifican, requiere autenticación
  return authenticateToken(req, res, next);
}

app.use('/api/teams', publicGetOnlyFromAllowedOrigin, teamRoutes);
app.use('/api/matches', publicGetOnlyFromAllowedOrigin, matchRoutes);
app.use('/api/tournament', publicGetOnlyFromAllowedOrigin, tournamentRoutes);
app.use('/api/playoffs', publicGetOnlyFromAllowedOrigin, playoffMatchRoutes);

// Endpoint para generar el token
app.post('/api/generatetoken', (req: Request, res: Response) => {
  const { user, password } = req.body;
  const envUser = process.env.API_USER;
  const envPassword = process.env.API_PASSWORD;
  const jwtSecret = process.env.JWT_SECRET;

  if (!envUser || !envPassword || !jwtSecret) {
    return res.status(500).json({ error: 'Credenciales no configuradas en el servidor.' });
  }

  if (user === envUser && password === envPassword) {
    const token = require('jsonwebtoken').sign({ user }, jwtSecret, { expiresIn: '24h' });
    return res.json({ token });
  } else {
    return res.status(401).json({ error: 'Credenciales inválidas.' });
  }
});

app.get('/', (req: Request, res: Response) => {
  res.send('API is running...');
});

app.listen(PORT, () => {
  console.log(`Server is running`);
});
