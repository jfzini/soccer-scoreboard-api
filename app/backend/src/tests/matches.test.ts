import * as sinon from 'sinon';
import * as chai from 'chai';
// @ts-ignore
import chaiHttp = require('chai-http');
import { app } from '../app';
import MatchModel from '../database/models/MatchModel';
import TeamModel from '../database/models/TeamModel';
import {
  NaNGoalsFields,
  inProgressMatchesMock,
  matchesMock,
  missingCreateMatchFields,
  negativeGoalsFields,
} from './mocks/matches.mocks';
import Token from '../auth/Token';
import { mockValidUser } from './mocks/user.mocks';

const { expect } = chai;

chai.use(chaiHttp);

describe('Route /matches', function () {
  afterEach(function () {
    sinon.restore();
  });

  describe('GET /matches', function () {
    it('should return a list of matches', async function () {
      sinon.stub(MatchModel, 'findAll').resolves(MatchModel.bulkBuild(matchesMock));
      const response = await chai.request(app).get('/matches');

      expect(response.status).to.be.equal(200);
      expect(response.body).to.deep.equal(matchesMock);
    });

    it('should return an empty array if no mathes were found', async function () {
      sinon.stub(MatchModel, 'findAll').resolves([]);
      const response = await chai.request(app).get('/matches');

      expect(response.status).to.be.equal(200);
      expect(response.body).to.deep.equal([]);
    });

    it('should return a list of matches in progress', async function () {
      sinon.stub(MatchModel, 'findAll').resolves(MatchModel.bulkBuild(inProgressMatchesMock));
      const response = await chai.request(app).get('/matches?inProgress=true');

      expect(response.status).to.be.equal(200);
      expect(response.body).to.deep.equal(inProgressMatchesMock);
    });

    it('should return status 400 if query parameter is invalid', async function () {
      sinon.stub(MatchModel, 'findAll').resolves(MatchModel.bulkBuild(inProgressMatchesMock));
      const response = await chai.request(app).get('/matches?inProgress=invalidparameter');

      expect(response.status).to.be.equal(400);
      expect(response.body).to.deep.equal({ message: 'Invalid query parameter' });
    });
  });

  describe('PATCH /matches/:matchId/finish', function () {
    it('should return status 200 when updating a match to finished', async function () {
      sinon.stub(MatchModel, 'update').resolves([1]);

      const token = new Token().generateToken(mockValidUser);
      const response = await chai
        .request(app)
        .patch('/matches/1/finish')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).to.be.equal(200);
      expect(response.body).to.deep.equal({ message: 'Finished' });
    });

    it('should return status 400 when failing to update a match', async function () {
      sinon.stub(MatchModel, 'update').resolves([0]);

      const token = new Token().generateToken(mockValidUser);
      const response = await chai
        .request(app)
        .patch('/matches/1/finish')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).to.be.equal(400);
      expect(response.body).to.deep.equal({ message: 'No matches found' });
    });

    it("should return status 401 when token isn't sent", async function () {
      sinon.stub(MatchModel, 'update').resolves([1]);

      const token = new Token().generateToken(mockValidUser);
      const response = await chai.request(app).patch('/matches/1/finish');

      expect(response.status).to.be.equal(401);
      expect(response.body).to.deep.equal({ message: 'Token not found' });
    });

    it("should return status 401 when token isn't valid", async function () {
      sinon.stub(MatchModel, 'update').resolves([1]);

      const token = new Token().generateToken(mockValidUser);
      const response = await chai
        .request(app)
        .patch('/matches/1/finish')
        .set('Authorization', `Bearer thisisaninvalidtoken`);

      expect(response.status).to.be.equal(401);
      expect(response.body).to.deep.equal({ message: 'Token must be a valid token' });
    });
  });

  describe('PATCH /matches/:matchId', function () {
    it('should return status 200 when updating goals of a match in progress', async function () {
      sinon.stub(MatchModel, 'update').resolves([1]);

      const token = new Token().generateToken(mockValidUser);
      const response = await chai
        .request(app)
        .patch('/matches/1')
        .set('Authorization', `Bearer ${token}`)
        .send({ homeTeamGoals: 1, awayTeamGoals: 0 });

      expect(response.status).to.be.equal(200);
      expect(response.body).to.deep.equal({ message: 'Match goals were updated!' });
    });

    it('should return status 400 when failing to update goals of a match', async function () {
      sinon.stub(MatchModel, 'update').resolves([0]);

      const token = new Token().generateToken(mockValidUser);
      const response = await chai
        .request(app)
        .patch('/matches/1')
        .set('Authorization', `Bearer ${token}`)
        .send({ homeTeamGoals: 1, awayTeamGoals: 0 });

      expect(response.status).to.be.equal(400);
      expect(response.body).to.deep.equal({
        message: 'No matches found, it is already finished or the results are the same',
      });
    });

    it('should return status 400 when failing to update goals of a match', async function () {
      sinon.stub(MatchModel, 'update').resolves([0]);

      const token = new Token().generateToken(mockValidUser);
      const response = await chai
        .request(app)
        .patch('/matches/1')
        .set('Authorization', `Bearer ${token}`)
        .send({ homeTeamGoals: 1, awayTeamGoals: 0 });

      expect(response.status).to.be.equal(400);
      expect(response.body).to.deep.equal({
        message: 'No matches found, it is already finished or the results are the same',
      });
    });

    it('should return status 400 when missing fields on req.body', async function () {
      sinon.stub(MatchModel, 'update').resolves([1]);

      const missingFields = [{ homeTeamGoals: 1 }, { awayTeamGoals: 1 }];
      const promises = missingFields.map(async (field) => {
        const token = new Token().generateToken(mockValidUser);
        const response = await chai
          .request(app)
          .patch('/matches/1')
          .set('Authorization', `Bearer ${token}`)
          .send(field);

        expect(response.status).to.be.equal(400);
        expect(response.body).to.deep.equal({
          message: 'Missing fields',
        });
      });

      await Promise.all(promises);
    });

    it('should return status 400 when at least one of the fields is NaN', async function () {
      sinon.stub(MatchModel, 'update').resolves([1]);

      const promises = NaNGoalsFields.map(async (field) => {
        const token = new Token().generateToken(mockValidUser);
        const response = await chai
          .request(app)
          .patch('/matches/1')
          .set('Authorization', `Bearer ${token}`)
          .send(field);

        expect(response.status).to.be.equal(400);
        expect(response.body).to.deep.equal({
          message: 'Goals must be numbers',
        });
      });

      await Promise.all(promises);
    });

    it('should return status 400 when at least one of the fields are negative', async function () {
      sinon.stub(MatchModel, 'update').resolves([1]);

      const promises = negativeGoalsFields.map(async (field) => {
        const token = new Token().generateToken(mockValidUser);
        const response = await chai
          .request(app)
          .patch('/matches/1')
          .set('Authorization', `Bearer ${token}`)
          .send(field);

        expect(response.status).to.be.equal(400);
        expect(response.body).to.deep.equal({
          message: 'Goals cannot be negative',
        });
      });

      await Promise.all(promises);
    });
  });

  describe('POST /matches', function () {
    afterEach(function () {
      sinon.restore();
    });

    it('should return status 201 when creating a match', async function () {
      sinon.stub(MatchModel, 'create').resolves(MatchModel.build(matchesMock[1]));

      const token = new Token().generateToken(mockValidUser);
      const response = await chai
        .request(app)
        .post('/matches')
        .set('Authorization', `Bearer ${token}`)
        .send({ homeTeamId: 9, homeTeamGoals: 1, awayTeamId: 14, awayTeamGoals: 1 });

      expect(response.status).to.be.equal(201);
      expect(response.body).to.deep.equal(matchesMock[1]);
    });

    it('should return status 201 when creating a match', async function () {
      sinon.stub(MatchModel, 'create').resolves(MatchModel.build(matchesMock[1]));
      sinon.stub(TeamModel, 'findByPk').resolves(TeamModel.build({ id: 9, teamName: 'Team A' }));

      const token = new Token().generateToken(mockValidUser);
      const response = await chai
        .request(app)
        .post('/matches')
        .set('Authorization', `Bearer ${token}`)
        .send({ homeTeamId: 9, homeTeamGoals: 1, awayTeamId: 14, awayTeamGoals: 1 });

      expect(response.status).to.be.equal(201);
      expect(response.body).to.deep.equal(matchesMock[1]);
    });

    it("should return status 404 when there isn't a team with the given id", async function () {
      sinon.stub(MatchModel, 'create').resolves(MatchModel.build(matchesMock[1]));
      sinon.stub(TeamModel, 'findByPk').resolves(null);

      const token = new Token().generateToken(mockValidUser);
      const response = await chai
        .request(app)
        .post('/matches')
        .set('Authorization', `Bearer ${token}`)
        .send({ homeTeamId: 9, homeTeamGoals: 1, awayTeamId: 14, awayTeamGoals: 1 });

      expect(response.status).to.be.equal(404);
      expect(response.body).to.deep.equal({ message: 'There is no team with such id!' });
    });

    it('should return status 400 when missing a field', async function () {
      sinon.stub(MatchModel, 'create').resolves(MatchModel.build(matchesMock[1]));
      sinon.stub(TeamModel, 'findByPk').resolves(TeamModel.build({ id: 9, teamName: 'Team A' }));

      const promises = missingCreateMatchFields.map(async (body) => {
        const token = new Token().generateToken(mockValidUser);
        const response = await chai
          .request(app)
          .post('/matches')
          .set('Authorization', `Bearer ${token}`)
          .send(body);

        expect(response.status).to.be.equal(400);
        expect(response.body).to.deep.equal({ message: 'Missing fields' });
      });

      await Promise.all(promises);
    });

    it('should return status 400 when team ids are not numbers', async function () {
      sinon.stub(MatchModel, 'create').resolves(MatchModel.build(matchesMock[1]));
      sinon.stub(TeamModel, 'findByPk').resolves(TeamModel.build({ id: 9, teamName: 'Team A' }));

      const token = new Token().generateToken(mockValidUser);
      const response = await chai
        .request(app)
        .post('/matches')
        .set('Authorization', `Bearer ${token}`)
        .send({ homeTeamId: 'a', homeTeamGoals: 1, awayTeamId: 14, awayTeamGoals: 1 });

      expect(response.status).to.be.equal(400);
      expect(response.body).to.deep.equal({ message: 'Team ids must be numbers' });
    });

    it('should return status 422 when team ids are equal', async function () {
      sinon.stub(MatchModel, 'create').resolves(MatchModel.build(matchesMock[1]));
      sinon.stub(TeamModel, 'findByPk').resolves(TeamModel.build({ id: 9, teamName: 'Team A' }));

      const token = new Token().generateToken(mockValidUser);
      const response = await chai
        .request(app)
        .post('/matches')
        .set('Authorization', `Bearer ${token}`)
        .send({ homeTeamId: 14, homeTeamGoals: 1, awayTeamId: 14, awayTeamGoals: 1 });

      expect(response.status).to.be.equal(422);
      expect(response.body).to.deep.equal({ message: 'It is not possible to create a match with two equal teams' });
    });

    it('should return status 400 when team ids are negative', async function () {
      sinon.stub(MatchModel, 'create').resolves(MatchModel.build(matchesMock[1]));
      sinon.stub(TeamModel, 'findByPk').resolves(TeamModel.build({ id: 9, teamName: 'Team A' }));

      const token = new Token().generateToken(mockValidUser);
      const response = await chai
        .request(app)
        .post('/matches')
        .set('Authorization', `Bearer ${token}`)
        .send({ homeTeamId: -14, homeTeamGoals: 1, awayTeamId: 14, awayTeamGoals: 1 });

      expect(response.status).to.be.equal(400);
      expect(response.body).to.deep.equal({ message: 'Team ids cannot be negative' });
    });
  });
});
