import * as express from 'express';
import TeamsController from '../controllers/Teams.controllers';

const TeamsRouter = express.Router();

const teamsController = new TeamsController();

TeamsRouter.get('/', (req, res) => teamsController.getTeams(req, res));
TeamsRouter.get('/:id', (req, res) => teamsController.getTeamById(req, res));

export default TeamsRouter;
