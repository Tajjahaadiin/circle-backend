import { Request } from 'express';
let loginIdentifierData: string;
export function getLoginIdentifier(req: Request): string | null {
  const { email, userName } = req.body;
  console.log('body', req.body);
  if (email) {
    return email;
  } else if (userName) {
    console.log(userName);
    return userName;
  } else {
    return null;
  }
}
