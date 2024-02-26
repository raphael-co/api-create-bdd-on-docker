import generateUsername from '../../../src/middlewares/bdd/generateUsername'; // Mettez à jour avec le chemin correct

describe('generateUsername', () => {
    const name = 'John';
    const type = 'Doe';
    const database = 'DB';
    const validCharacters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  
    it('should start with the name, type, and database concatenated', () => {
      const username = generateUsername(name, type, database);
      expect(username.startsWith(name + type + database)).toBe(true);
    });
  
    it('should have a length equal to the sum of name, type, and database plus four', () => {
      const username = generateUsername(name, type, database);
      const expectedLength = name.length + type.length + database.length + 4;
      expect(username).toHaveLength(expectedLength);
    });
  
    it('should end with four valid characters', () => {
      const username = generateUsername(name, type, database);
      const lastFourChars = username.slice(-4);
      const matchesOnlyValidCharacters = [...lastFourChars].every(char => validCharacters.includes(char));
      expect(matchesOnlyValidCharacters).toBe(true);
    });
  
    it('should generate different usernames on subsequent calls', () => {
      const usernames = new Set();
      const attempts = 5;
      for (let i = 0; i < attempts; i++) {
        usernames.add(generateUsername(name, type, database));
      }
      expect(usernames.size).toBe(attempts);
    });
  
    // Vous pouvez ajouter des tests supplémentaires pour couvrir d'autres cas d'utilisation
  });