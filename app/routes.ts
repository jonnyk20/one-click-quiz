import { Express, Response, Request } from 'express';

import Quiz from './db/models/Quiz';
import TaxaChallengeScore from './db/models/TaxaChallengeScore';
import * as TranslationService from './services/TranslationService';

const routes = (app: Express) => {
  app.get('/api/quiz/:slug', async (req: Request, res: Response) => {
    const { slug } = req.params;
    const quiz = await Quiz.findOne({ where: { url: slug } });

    return res.json({ quiz });
  });

  app.get('/api/taxa-challenge-scores', async (req: Request, res: Response) => {
    const scores = await TaxaChallengeScore.findAll();

    return res.json(scores);
  });

  // app.get('/translate', async (req: Request, res: Response) => {
  //   const translation = await TranslationService.translate({});

  //   return res.json({ translation });
  // });

  app.post(
    '/api/taxa-challenge-scores',
    async (req: Request, res: Response) => {
      const data = req.body;

      try {
        const record = TaxaChallengeScore.create({ data });
        return res.json({ record, error: false });
      } catch (error) {
        return res.json({
          record: null,
          error,
        });
      }
    }
  );
};

module.exports = routes;
