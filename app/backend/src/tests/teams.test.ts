import * as sinon from 'sinon';
import * as chai from 'chai';
// @ts-ignore
import chaiHttp  = require('chai-http');
import { app } from '../app';
import TeamModel from '../database/models/TeamModel';
import { allTeamsMock } from './mocks/teams.mocks';

const { expect } = chai;

chai.use(chaiHttp);

describe('Route /teams', function () {
  afterEach(function () {
    sinon.restore();
  });
  
  it('should return a list of teams', async function () {
    sinon.stub(TeamModel, 'findAll').resolves(TeamModel.bulkBuild(allTeamsMock));

    const response = await chai.request(app).get('/teams');

    expect(response.status).to.be.equal(200);
    expect(response.body).to.deep.equal(allTeamsMock);
  });

  it('should return a team by id', async function () {
    sinon.stub(TeamModel, 'findByPk').resolves(TeamModel.build(allTeamsMock[0]));

    const response = await chai.request(app).get('/teams/1');

    expect(response.status).to.be.equal(200);
    expect(response.body).to.deep.equal(allTeamsMock[0]);
  });

  it('should return status 404 if team doesn\'t exist in the database', async function () {
    sinon.stub(TeamModel, 'findByPk').resolves(null);

    const response = await chai.request(app).get('/teams/1');

    expect(response.status).to.be.equal(404);
    expect(response.body).to.deep.equal({ message: 'No team was found' });
  });
})