import genereatePassword from '../../../src/middlewares/bdd/genereatePassword'; // Mettez à jour avec le chemin correct

describe('genereatePassword', () => {
  it('should generate a password of default length', () => {
    const password = genereatePassword();
    expect(password).toHaveLength(16);
  });

  it('should generate a password of specified length', () => {
    const length = 10;
    const password = genereatePassword(length);
    expect(password).toHaveLength(length);
  });

  it('should generate a password with only valid characters', () => {
    const password = genereatePassword();
    const validCharacters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const matchesOnlyValidCharacters = [...password].every(char => validCharacters.includes(char));
    expect(matchesOnlyValidCharacters).toBe(true);
  });

  it('should generate different passwords on subsequent calls', () => {
    const passwords = new Set();
    const attempts = 5;
    for (let i = 0; i < attempts; i++) {
      passwords.add(genereatePassword());
    }
    expect(passwords.size).toBe(attempts);
  });
  
  // Vous pouvez ajouter des tests supplémentaires pour couvrir d'autres cas d'utilisation
});

