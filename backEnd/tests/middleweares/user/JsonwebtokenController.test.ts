import JsonwebtokenController from "../../../src/middlewares/user/JsonwebtokenController";

describe('JsonwebtokenController', () => {
  let userId: number;
  let token: string;

  beforeAll(() => {
    process.env.JWT_SECRET_KEY = 'your_secret_key_for_testing';
    userId = 70; 
  });

  test('generateJwtToken should generate a valid JWT token', () => {
    token = JsonwebtokenController.generateJwtToken(userId);
    expect(token).toBeDefined();
    expect(typeof token).toBe('string');
  });

  test('verifyJwtToken should verify a valid token successfully', () => {
    const verificationResult = JsonwebtokenController.verifyJwtToken(token);
    expect(verificationResult.valid).toBeTruthy();
    expect(verificationResult.decoded).toBeDefined();
    expect(verificationResult.decoded.id).toBe(userId);
  });

  test('verifyJwtToken should fail for an invalid token', () => {
    const invalidToken = 'invalid.token.here';
    const verificationResult = JsonwebtokenController.verifyJwtToken(invalidToken);
    expect(verificationResult.valid).toBeFalsy();
    expect(verificationResult.error).toBeDefined();
  });
});
