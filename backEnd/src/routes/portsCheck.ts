import { Router } from 'express';
import { PortsCheck } from '../services/PortsCheck/PortsCheck';
// import JsonWebToken from '../middlewares/JsonWebToken/JsonWebToken';
// import JsonwebtokenController from '../middlewares/user/JsonwebtokenController';
import { Request, Response } from 'express';
import JsonWebToken from '../middlewares/JsonWebToken/JsonWebToken';
import JsonwebtokenController from '../middlewares/user/JsonwebtokenController';

const portsCheck = Router();

portsCheck.post(
    '/test',
    PortsCheck.test,
);


portsCheck.get('/fetchApiVersion', JsonWebToken.ValidToken, async (req: Request, res: Response) => {
    try {
        const decoded = JsonwebtokenController.verifyJwtTokenAdmin(req.headers.authorization as string)

        if ((await decoded).valid === false) {
            res.status(401).send({ message: 'Unauthorized' });
            return;
        }
        const port = await PortsCheck.fetchApiVersion();

        if (port.success) {
            res.status(201).send({ port });
        } else {
            res.status(400).send({ port });
        }
    } catch (error: unknown) {
        if (error instanceof Error) {
            res.status(500).send({ message: error.message });
        } else {
            res.status(500).send({ message: 'An unknown error occurred' });
        }
    }
});

portsCheck.post('/registerFree', JsonWebToken.ValidToken, async (req: Request, res: Response) => {
    try {
        const decoded = JsonwebtokenController.verifyJwtTokenAdmin(req.headers.authorization as string)

        if ((await decoded).valid === false) {
            res.status(401).send({ message: 'Unauthorized' });
            return;
        }
        const port = await PortsCheck.registerBox();

        if (port.success) {
            res.status(201).send({ port });
        } else {
            res.status(400).send({ port });
        }
    } catch (error: unknown) {
        if (error instanceof Error) {
            res.status(500).send({ message: error.message });
        } else {
            res.status(500).send({ message: 'An unknown error occurred' });
        }
    }
});

portsCheck.get('/trackAuthorizationStatus', JsonWebToken.ValidToken, async (req: Request, res: Response) => {
    try {
        const decoded = JsonwebtokenController.verifyJwtTokenAdmin(req.headers.authorization as string)

        if ((await decoded).valid === false) {
            res.status(401).send({ message: 'Unauthorized' });
            return;
        }
        const port = await PortsCheck.trackAuthorizationStatus();

        if (port.success) {
            res.status(201).send({ port });
        } else {
            res.status(400).send({ port });
        }
    } catch (error: unknown) {
        if (error instanceof Error) {
            res.status(500).send({ message: error.message });
        } else {
            res.status(500).send({ message: 'An unknown error occurred' });
        }
    }
});

portsCheck.get('/checkSession', JsonWebToken.ValidToken, async (req: Request, res: Response) => {
    try {
        const decoded = JsonwebtokenController.verifyJwtTokenAdmin(req.headers.authorization as string)

        if ((await decoded).valid === false) {
            res.status(401).send({ message: 'Unauthorized' });
            return;
        }
        const port = await PortsCheck.checkSession();

        if (port.success) {
            res.status(201).send({ port });
        } else {
            res.status(400).send({ port });
        }
    } catch (error: unknown) {
        if (error instanceof Error) {
            res.status(500).send({ message: error.message });
        } else {
            res.status(500).send({ message: 'An unknown error occurred' });
        }
    }
});


portsCheck.post('/closePort', JsonWebToken.ValidToken, async (req: Request, res: Response) => {
    try {
        const decoded = JsonwebtokenController.verifyJwtTokenAdmin(req.headers.authorization as string)

        if ((await decoded).valid === false) {
            res.status(401).send({ message: 'Unauthorized' });
            return;
        }
        const port = await PortsCheck.closePort(req.body.port);

        if (port.success) {
            res.status(201).send({ port });
        } else {
            res.status(400).send({ port });
        }
    } catch (error: unknown) {
        if (error instanceof Error) {
            res.status(500).send({ message: error.message });
        } else {
            res.status(500).send({ message: 'An unknown error occurred' });
        }
    }
});




// "port": {
//     "success": true,
//     "message": {
//         "success": true,
//         "result": {
//             "app_token": "1qY63XGKaztD/CFlsbv2Ty8z5PK4ivEkqrq+V0wNWpRVAEJV7i4bcKaedbNWjizo",
//             "track_id": 12
//         }
//     },
//     "token": null
// }
// "port": {
//     "success": true,
//     "message": {
//         "success": true,
//         "result": {
//             "status": "pending",
//             "challenge": "O1WXWS0xZq0FUTwiSaAHdHylv1WC7TGK",
//             "password_salt": "SPD7BX7I5GJ1YBuVW5RXae1f0BHQdQxs"
//         }
//     }
// }
// portsCheck.get(
//     '/fetchApiVersion',
//     PortsCheck.fetchApiVersion,

// );

export default portsCheck;