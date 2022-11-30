import { createCipheriv, createDecipheriv, scryptSync } from 'crypto';

const algorithm = 'aes-192-cbc';
const password = 'bncaskdbvasbvlaslslasfhj';
const key = scryptSync(password, 'GfG', 24);
const iv = Buffer.alloc(16, 0);

const encrypt = (value) => {
  const cipher = createCipheriv(algorithm, key, iv);
  var crypted = cipher.update(value, 'utf8','hex');
  crypted += cipher.final('hex');
  return crypted;
};

const decrypt = (value) => {
  const decipher = createDecipheriv(algorithm, key, iv);
  let crypted = decipher.update(value, "hex", "utf-8");
  crypted += decipher.final("utf8");
  return crypted;
};

export { encrypt, decrypt };