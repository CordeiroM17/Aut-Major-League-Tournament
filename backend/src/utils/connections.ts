import { connect } from 'mongoose';

export async function connectMongo(): Promise<void> {
  try {
    const mongoUrl = process.env.MONGO_URL;
    if (!mongoUrl) {
      throw new Error('MONGO_URL environment variable is not defined');
    }
    await connect(mongoUrl);
    console.log('Plug to mongo!');
  } catch (e) {
    console.log(`${e}`);
    throw new Error('Can not connect to the db');
  }
}
