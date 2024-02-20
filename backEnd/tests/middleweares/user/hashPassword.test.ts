import HashPassword from "../../../src/middlewares/user/HashPassword";

describe('HashPassword', () => {
  test('hashPassword should return a hash different from the password', async () => {
    const password = 'testPassword123';
    const hash = await HashPassword.hashPassword(password);
    expect(hash).not.toBe(password);
    expect(hash.length).toBeGreaterThan(0);
  });

  test('comparePassword should return true for a matching password and hash', async () => {
    const password = 'testPassword123';
    const hash = await HashPassword.hashPassword(password);
    const result = await HashPassword.comparePassword(password, hash);
    expect(result).toBe(true);
  });

  test('comparePassword should return false for a non-matching password and hash', async () => {
    const password = 'testPassword123';
    const wrongPassword = 'wrongPassword123';
    const hash = await HashPassword.hashPassword(password);
    const result = await HashPassword.comparePassword(wrongPassword, hash);
    expect(result).toBe(false);
  });
});
