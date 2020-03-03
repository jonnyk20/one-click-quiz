import Quiz from "./db/models/Quiz";
import { Express, Response, Request } from "express";

const routes = (app: Express) => {
  app.get("/api/quiz/:slug", async (req: Request, res: Response) => {
    const { slug } = req.params;
    const quiz = await Quiz.findOne({ where: { url: slug } });

    return res.json({ quiz });
  });
};

module.exports = routes;
