import { MongoClient } from "mongodb";

let url = process.env.DB_URL as string | "";
export const dbClient = new MongoClient(url);
