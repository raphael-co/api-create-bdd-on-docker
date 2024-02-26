import { Request, Response, NextFunction } from 'express';
import { enumTypeBdd } from '../../../src/models/enumTypeBdd';
import validateBddInput from '../../../src/middlewares/bdd/validateBddInput';
import { ParamsDictionary } from 'express-serve-static-core';
import { ParsedQs } from 'qs';

describe('validateBddInput Middleware', () => {

  let mockReq: Partial<Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>>;
  let mockRes: Partial<Response>;
  let nextFunction: NextFunction = jest.fn();

  beforeEach(() => {
    mockReq = { body: {} };
    mockRes = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn().mockReturnThis(),
    };
    nextFunction = jest.fn();
  });

  it('should require all fields', () => {
    validateBddInput(mockReq as Request, mockRes as Response, nextFunction);
    expect(mockRes.status).toHaveBeenCalledWith(400);
    expect(mockRes.send).toHaveBeenCalledWith({ message: "All fields including dbVersion are required" });
  });

  it('should call next for a valid type', () => {
    mockReq.body = { name: 'ValidName', type: 'postgres', databaseName: 'ValidDB', versionBdd: '12' };
    validateBddInput(mockReq as Request, mockRes as Response, nextFunction);
    expect(nextFunction).toHaveBeenCalled();
  });

  it('should return a 400 status for an invalid type', () => {
    mockReq.body = { name: 'ValidName', type: 'invalidType', databaseName: 'ValidDB', versionBdd: '12' };
    validateBddInput(mockReq as Request, mockRes as Response, nextFunction);
    expect(mockRes.status).toHaveBeenCalledWith(400);
    expect(mockRes.send).toHaveBeenCalledWith({ message: `Le type invalidType de bdd n'est pas valide.` });
  });

  it('should validate minimum databaseName length', () => {
    mockReq.body = { name: 'ValidName', type: 'postgres', databaseName: 'short', versionBdd: '12' };
    validateBddInput(mockReq as Request, mockRes as Response, nextFunction);
    expect(mockRes.status).toHaveBeenCalledWith(400);
    expect(mockRes.send).toHaveBeenCalledWith({ message: "databaseName must be at least 6 characters long" });
  });

  it('should allow alphanumeric and underscore characters in databaseName', () => {
    mockReq.body = { name: 'ValidName', type: 'postgres', databaseName: 'Valid_DB1', versionBdd: '12' };
    validateBddInput(mockReq as Request, mockRes as Response, nextFunction);
    expect(nextFunction).toHaveBeenCalled();
  });

  it('should reject invalid characters in databaseName', () => {
    mockReq.body = { name: 'ValidName', type: 'postgres', databaseName: 'Invalid-DB!', versionBdd: '12' };
    validateBddInput(mockReq as Request, mockRes as Response, nextFunction);
    expect(mockRes.status).toHaveBeenCalledWith(400);
    expect(mockRes.send).toHaveBeenCalledWith({ message: "le nom de la base de donnée doit contenir uniquement des caractères alphanumériques et des _" });
  });

  it('should validate minimum name length', () => {
    mockReq.body = { name: 'short', type: 'postgres', databaseName: 'ValidDBName', versionBdd: '12' };
    validateBddInput(mockReq as Request, mockRes as Response, nextFunction);
    expect(mockRes.status).toHaveBeenCalledWith(400);
    expect(mockRes.send).toHaveBeenCalledWith({ message: "name must be at least 6 characters long" });
  });

  it('should call next for a valid versionBdd', () => {
    mockReq.body = { name: 'ValidName', type: 'postgres', databaseName: 'ValidDB', versionBdd: '12' };
    validateBddInput(mockReq as Request, mockRes as Response, nextFunction);
    expect(nextFunction).toHaveBeenCalled();
  });

  it('should return a 400 status for an invalid versionBdd', () => {
    mockReq.body = { name: 'ValidName', type: 'postgres', databaseName: 'ValidDB', versionBdd: 'invalidVersion' };
    validateBddInput(mockReq as Request, mockRes as Response, nextFunction);
    expect(mockRes.status).toHaveBeenCalledWith(400);
    expect(mockRes.send).toHaveBeenCalledWith({ message: `La version invalidVersion n'est pas valide pour le type postgres` });
  });

  it('should proceed to next middleware when all validations pass', () => {
    mockReq.body = { name: 'ValidName', type: 'postgres', databaseName: 'ValidDB', versionBdd: '12' };
    validateBddInput(mockReq as Request, mockRes as Response, nextFunction);
    expect(nextFunction).toHaveBeenCalled();
  });
});

export default validateBddInput;  