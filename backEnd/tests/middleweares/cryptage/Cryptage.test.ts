// Cryptage.test.ts
import { randomBytes } from 'crypto';
import Cryptage from '../../../src/middlewares/cryptage/Cryptage'; // Mettez à jour avec le chemin correct

describe('Cryptage', () => {
  const secretKey: Buffer = randomBytes(32);
  const iv: Buffer = randomBytes(16);
  const text = 'Text to encrypt and decrypt';

  it('should encrypt a text and result should not be the original text', () => {
    const encryptedData = Cryptage.encrypt(text, secretKey, iv);
    expect(encryptedData.encrypted).not.toBe(text);
  });

  it('should decrypt the text to the original value', () => {
    const encryptedData = Cryptage.encrypt(text, secretKey, iv);
    const decryptedText = Cryptage.decrypt(encryptedData, secretKey);
    expect(decryptedText).toBe(text);
  });

  it('should throw an error when decrypting with wrong key', () => {
    const wrongSecretKey = Buffer.from('wrong-secret-key-that-is-also-32b', 'utf-8');
    const encryptedData = Cryptage.encrypt(text, secretKey, iv);
    
    expect(() => {
      Cryptage.decrypt(encryptedData, wrongSecretKey);
    }).toThrowError();
  });
});
