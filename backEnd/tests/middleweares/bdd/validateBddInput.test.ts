import { Request, Response, NextFunction } from 'express';
import { enumTypeBdd } from '../../../src/models/enumTypeBdd';
import validateBddInput from '../../../src/middlewares/bdd/validateBddInput'; // Mettez à jour avec le chemin correct

describe('validateBddInput', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let nextFunction: NextFunction = jest.fn();

  beforeEach(() => {
    mockRequest = {};
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn().mockReturnThis()
    };
  });

  it('should require all fields', () => {
    mockRequest = {
      body: {
        name: '',
        type: '',
        databaseName: ''
      }
    };
    
    validateBddInput(mockRequest as Request, mockResponse as Response, nextFunction);

    expect(mockResponse.status).toHaveBeenCalledWith(400);
    expect(mockResponse.send).toHaveBeenCalledWith({ message: "All fields are required" });
  });

  it('should validate the type of BDD', () => {
    mockRequest = {
      body: {
        name: 'ValidName',
        type: 'InvalidType',
        databaseName: 'ValidDB'
      }
    };
    
    validateBddInput(mockRequest as Request, mockResponse as Response, nextFunction);

    expect(mockResponse.status).toHaveBeenCalledWith(400);
    expect(mockResponse.send).toHaveBeenCalledWith({ message: "Le type InvalidType de bdd n'est pas valide." });
  });

  it('should enforce a minimum database name length', () => {
    mockRequest = {
      body: {
        name: 'ValidName',
        type: Object.values(enumTypeBdd)[0],
        databaseName: 'short'
      }
    };
    
    validateBddInput(mockRequest as Request, mockResponse as Response, nextFunction);

    expect(mockResponse.status).toHaveBeenCalledWith(400);
    expect(mockResponse.send).toHaveBeenCalledWith({ message: "databaseName must be at least 6 characters long" });
  });

  it('should only allow alphanumeric and underscore characters in database name', () => {
    mockRequest = {
      body: {
        name: 'ValidName',
        type: Object.values(enumTypeBdd)[0],
        databaseName: 'Invalid DB Name!'
      }
    };
    
    validateBddInput(mockRequest as Request, mockResponse as Response, nextFunction);

    expect(mockResponse.status).toHaveBeenCalledWith(400);
    expect(mockResponse.send).toHaveBeenCalledWith({ message: "le nom de la base de donnée doit contenir uniquement des caractères alphanumériques et des _" });
  });

  it('should enforce a minimum name length', () => {
    mockRequest = {
      body: {
        name: 'short',
        type: Object.values(enumTypeBdd)[0],
        databaseName: 'ValidDBName'
      }
    };
    
    validateBddInput(mockRequest as Request, mockResponse as Response, nextFunction);

    expect(mockResponse.status).toHaveBeenCalledWith(400);
    expect(mockResponse.send).toHaveBeenCalledWith({ message: "name must be at least 6 characters long" });
  });

  it('should call next if validation succeeds', () => {
    mockRequest = {
      body: {
        name: 'ValidName',
        type: Object.values(enumTypeBdd)[0],
        databaseName: 'ValidDBName'
      }
    };

    validateBddInput(mockRequest as Request, mockResponse as Response, nextFunction);

    expect(nextFunction).toHaveBeenCalled();
  });

  // Vous pouvez ajouter des tests supplémentaires pour couvrir d'autres cas d'utilisation
});

export default validateBddInput;  