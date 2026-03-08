import { Request, Response } from 'express';
import { BaseController } from './BaseController';
import { GenerateGreetingRequest } from '../validators/greeting.schema';
import { qwenService } from '../services/qwenService';

export class GreetingController extends BaseController {
    async generate(req: Request, res: Response): Promise<void> {
        try {
            const data: GenerateGreetingRequest = req.body;

            const greetingText = await qwenService.generateGreeting(
                data.recipientName,
                data.relationship,
                data.tone,
                data.customMessage,
            );

            this.handleSuccess(res, {
                greetingText,
                theme: data.visualTheme,
            });
        } catch (error) {
            this.handleError(error, res, 'GreetingController.generate');
        }
    }
}

export const greetingController = new GreetingController();
