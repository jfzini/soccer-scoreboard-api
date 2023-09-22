import * as sinon from 'sinon';
import * as chai from 'chai';
// @ts-ignore
import chaiHttp = require('chai-http');
import { app } from '../app';
import MatchModel from '../database/models/MatchModel';
import { matchesMock } from './mocks/matches.mocks';
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
  });

  describe('PATCH /matches', function () {
    it('should return "Finished" when updating a match to finished', async function () {
      sinon.stub(MatchModel, 'update').resolves([1]);

      const token = new Token().generateToken(mockValidUser);
      const response = await chai
        .request(app)
        .patch('/matches/1/finish')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).to.be.equal(200);
      expect(response.body).to.deep.equal({ message: 'Finished' });
    });

    it('should return "No matches found" when failing to update a match', async function () {
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
});
