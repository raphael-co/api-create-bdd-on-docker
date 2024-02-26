import { Request, Response, NextFunction } from 'express';
import validateUserInput from '../../../src/middlewares/user/validateUserInput';

describe('validateUserInput', () => {
    let mockRequest: Partial<Request>;
    let mockResponse: Partial<Response>;
    let mockNext: NextFunction;

    beforeEach(() => {
        mockRequest = {};
        mockResponse = {
            status: jest.fn().mockReturnThis(),
            send: jest.fn(),
        };
        mockNext = jest.fn();
    });

    it('should pass with valid input', () => {
        mockRequest.body = { mail: 'test@example.com', password: 'Test123!@' };
        validateUserInput(mockRequest as Request, mockResponse as Response, mockNext);
        expect(mockNext).toHaveBeenCalled();
    });

    it('should return error for missing email', () => {
        mockRequest.body = { password: 'Test123!@' };
        validateUserInput(mockRequest as Request, mockResponse as Response, mockNext);
        expect(mockResponse.status).toHaveBeenCalledWith(400);
        expect(mockResponse.send).toHaveBeenCalledWith({ message: "All fields are required" });
    });

    it('should return error for missing password', () => {
        mockRequest.body = { mail: 'test@example.com' };
        validateUserInput(mockRequest as Request, mockResponse as Response, mockNext);
        expect(mockResponse.status).toHaveBeenCalledWith(400);
        expect(mockResponse.send).toHaveBeenCalledWith({ message: "All fields are required" });
    });

    it('should return error for invalid email format', () => {
        mockRequest.body = { mail: 'invalidemail', password: 'Test123!@' };
        validateUserInput(mockRequest as Request, mockResponse as Response, mockNext);
        expect(mockResponse.status).toHaveBeenCalledWith(400);
        expect(mockResponse.send).toHaveBeenCalledWith({ message: "Invalid email format" });
    });

    it('should return error for invalid password format', () => {
        mockRequest.body = { mail: 'test@example.com', password: 'invalidpassword' };
        validateUserInput(mockRequest as Request, mockResponse as Response, mockNext);
        expect(mockResponse.status).toHaveBeenCalledWith(400);
        expect(mockResponse.send).toHaveBeenCalledWith({ message: "Minimum eight characters, at least one uppercase letter, one lowercase letter, one number and one special character" });
    });
});