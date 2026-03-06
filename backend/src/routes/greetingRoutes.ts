import { Router } from 'express';
import { asyncErrorWrapper } from '../utils/asyncErrorWrapper';
import { greetingController } from '../controllers/GreetingController';
import { generateGreetingSchema } from '../validators/greeting.schema';

const router = Router();

router.post(
    '/generate-greeting',
    asyncErrorWrapper(async (req, res, next) => {
        // Validate request body
        const validatedData = generateGreetingSchema.parse(req.body);
        req.body = validatedData;

        // Execute controller
        await greetingController.generate(req, res);
    })
);

export default router;
