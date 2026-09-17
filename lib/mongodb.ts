import "server-only";
import { MongoClient, type Db } from "mongodb";

const uri = process.env.DB_URL;

if (!uri) {
  throw new Error(
    "DB_URL belum diisi. Buat .env.local dari .env.example dan isi connection string MongoDB kamu."
  );
}

const DB_NAME = "alinea";

// The connection string has no database path segment (`/?ssl=true&...`), so
// the driver has no default db to fall back to — name it explicitly instead
// of letting `client.db()` throw.
declare global {
  // eslint-disable-next-line no-var
  var _alineaMongoClientPromise: Promise<MongoClient> | undefined;
}

let clientPromise: Promise<MongoClient>;

if (process.env.NODE_ENV === "development") {
  // Reuse the client across Next.js dev-mode HMR reloads — a fresh module
  // instance is created on every file save, but the global survives it, so
  // this avoids opening a new connection pool each time.
  if (!global._alineaMongoClientPromise) {
    global._alineaMongoClientPromise = new MongoClient(uri).connect();
  }
  clientPromise = global._alineaMongoClientPromise;
} else {
  // Production: one client per server instance is fine, no HMR to survive.
  clientPromise = new MongoClient(uri).connect();
}

export default clientPromise;

export async function getDb(): Promise<Db> {
  const client = await clientPromise;
  return client.db(DB_NAME);
}
