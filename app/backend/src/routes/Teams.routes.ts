import * as express from 'express';
import TeamsController from '../controllers/Teams.controllers';

const TeamsRouter = express.Router();

const teamsController: TeamsController = new TeamsController();

TeamsRouter.get('/', (req, res) => teamsController.getTeams(req, res));

export default TeamsRouter;
