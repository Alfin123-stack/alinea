import "server-only";
import { ObjectId, type WithId } from "mongodb";
import { getDb } from "@/lib/mongodb";

export interface UserDocument {
  name: string;
  email: string; // always stored lowercase
  passwordHash: string;
  createdAt: Date;
}

export type UserRecord = WithId<UserDocument>;

let indexesEnsured = false;

async function getUsersCollection() {
  const db = await getDb();
  const collection = db.collection<UserDocument>("users");
  if (!indexesEnsured) {
    // Enforces uniqueness at the DB level too — the app-level "email sudah
    // terdaftar" check is a nicer UX, but this is the real guarantee against
    // races (two registrations for the same email landing at once).
    await collection.createIndex({ email: 1 }, { unique: true });
    indexesEnsured = true;
  }
  return collection;
}

export async function findUserByEmail(email: string): Promise<UserRecord | null> {
  const users = await getUsersCollection();
  return users.findOne({ email: email.toLowerCase() });
}

export async function findUserById(id: string): Promise<UserRecord | null> {
  if (!ObjectId.isValid(id)) return null;
  const users = await getUsersCollection();
  return users.findOne({ _id: new ObjectId(id) });
}

export async function createUser(data: {
  name: string;
  email: string;
  passwordHash: string;
}): Promise<ObjectId> {
  const users = await getUsersCollection();
  const result = await users.insertOne({
    name: data.name,
    email: data.email.toLowerCase(),
    passwordHash: data.passwordHash,
    createdAt: new Date(),
  });
  return result.insertedId;
}
