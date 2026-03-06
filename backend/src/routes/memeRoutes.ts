import { Router } from 'express';
import { asyncErrorWrapper } from '../utils/asyncErrorWrapper';
import { memeController } from '../controllers/MemeController';
import { generateMemeSchema } from '../validators/meme.schema';

const router = Router();

router.post(
    '/generate-meme',
    asyncErrorWrapper(async (req, res, next) => {
        // Validate request body
        const validatedData = generateMemeSchema.parse(req.body);
        req.body = validatedData;

        // Execute controller
        await memeController.generate(req, res);
    })
);

export default router;
