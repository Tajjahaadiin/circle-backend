import { Request } from 'express';
let loginIdentifierData: string;
export function getLoginIdentifier(req: Request): string | null {
  const { email, username } = req.body;
  console.log('body', req.body);
  if (email) {
    return email;
  } else if (username) {
    console.log(username);
    return username;
  } else {
    return null;
  }
}
