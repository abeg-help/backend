import {
  randomBytes,
} from 'crypto';


export function generateRandomString(length: number) {
  return randomBytes(length).toString('hex');
}
