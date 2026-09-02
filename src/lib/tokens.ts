import { randomBytes } from "crypto";

export function genererToken(tailleOctets = 24): string {
  return randomBytes(tailleOctets).toString("hex");
}
