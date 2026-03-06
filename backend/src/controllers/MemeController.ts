import { Request, Response } from 'express';
import { BaseController } from './BaseController';
import { GenerateMemeRequest } from '../validators/meme.schema';
import { qwenService } from '../services/qwenService';

export class MemeController extends BaseController {
    async generate(req: Request, res: Response): Promise<void> {
        try {
            const data: GenerateMemeRequest = req.body;

            const optimizedText = await qwenService.generateMemeText(data.category, data.userJoke);
            const imageUrl = await qwenService.generateMemeImage(optimizedText);

            this.handleSuccess(res, {
                imageUrl,
                contentText: optimizedText,
                metadata: { style: data.style }
            });
        } catch (error) {
            this.handleError(error, res, 'MemeController.generate');
        }
    }
}

export const memeController = new MemeController();
