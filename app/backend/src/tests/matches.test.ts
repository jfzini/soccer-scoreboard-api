import * as sinon from 'sinon';
import * as chai from 'chai';
// @ts-ignore
import chaiHttp = require('chai-http');
import { app } from '../app';
import MatchModel from '../database/models/MatchModel';
import { matchesMock } from './mocks/matches.mocks';

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
});
