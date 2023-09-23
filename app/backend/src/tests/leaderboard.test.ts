import * as sinon from 'sinon';
import * as chai from 'chai';
// @ts-ignore
import chaiHttp = require('chai-http');
import { app } from '../app';
import TeamModel from '../database/models/TeamModel';
import { allAwayParsedMatches, allAwayRawMatches, allHomeParsedMatches, allHomeRawMatches } from './mocks/leaderboard.mocks';


const { expect } = chai;

chai.use(chaiHttp);

describe('Route /leaderboard', function () {
  afterEach(function () {
    sinon.restore();
  });

  describe('GET /leaderboard/home', function () {
    it('should return status 200', async function () {
      sinon.stub(TeamModel, 'findAll').resolves(TeamModel.bulkBuild(allHomeRawMatches, {
        include: [{ association: `homeMatch`, where: { inProgress: false } }],
      }));
      const response = await chai.request(app).get('/leaderboard/home');

      expect(response).to.have.status(200);
      expect(response.body).to.deep.equal(allHomeParsedMatches);
    });
  });

  describe('GET /leaderboard/away', function () {
    it('should return status 200', async function () {
      sinon.stub(TeamModel, 'findAll').resolves(TeamModel.bulkBuild(allAwayRawMatches, {
        include: [{ association: `awayMatch`, where: { inProgress: false } }],
      }));
      const response = await chai.request(app).get('/leaderboard/away');

      expect(response).to.have.status(200);
      expect(response.body).to.deep.equal(allAwayParsedMatches);
    });
  });
});
