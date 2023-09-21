import sinon from 'sinon';
import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import { app } from '../../app';
import TeamModel from '../../database/models/TeamModel';
import { allTeamsMock } from '../mocks/teams.mocks';

chai.use(chaiHttp);

describe('Route /teams', function () {
  it('should return a list of teams', async function () {
    sinon.stub(TeamModel, 'findAll').resolves(TeamModel.bulkBuild(allTeamsMock));
    const response = await chai.request(app).get('/teams');
    expect(response.status).to.be.equal(200);
    expect(response.body).to.be.an('array');
  });
})