import { Request, Response } from 'express';
import { BaseController } from './BaseController';
import { GenerateMemeRequest } from '../validators/meme.schema';
import { qwenService } from '../services/qwenService';

export class MemeController extends BaseController {
    async generate(req: Request, res: Response): Promise<void> {
        try {
            const data: GenerateMemeRequest = req.body;

            // Step 1: LLM builds joke text + image prompt
            const { displayText, imagePrompt } = await qwenService.generateMemeText(
                data.genre,
                data.userJoke
            );

            // Step 2: Wanx generates the image (async polling, ~15-30s)
            const imageUrl = await qwenService.generateMemeImage(imagePrompt, data.style);

            this.handleSuccess(res, {
                imageUrl,
                contentText: displayText,
                imagePrompt, // useful for debugging
                metadata: { style: data.style, genre: data.genre },
            });
        } catch (error) {
            this.handleError(error, res, 'MemeController.generate');
        }
    }
}

export const memeController = new MemeController();
