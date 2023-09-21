import * as sinon from 'sinon';
import * as chai from 'chai';
// @ts-ignore
import chaiHttp = require('chai-http');
import { app } from '../app';
import UserModel from '../database/models/UserModel';
import { invalidErrorMsg, missingErrorMsg, mockValidUser } from './mocks/user.mocks';
import * as bcrypt from 'bcryptjs';

const { expect } = chai;

chai.use(chaiHttp);

describe('Route /login', function () {
  afterEach(function () {
    sinon.restore();
  });

  it('should return a token', async function () {
    sinon.stub(UserModel, 'findOne').resolves(UserModel.build(mockValidUser));
    sinon.stub(bcrypt, 'compareSync').returns(true);

    const response = await chai.request(app).post('/login').send({
      email: 'user@user.com',
      password: '12345678',
    });

    expect(response).to.have.status(200);
    expect(response.body).to.have.property('token');
  });

  it('should return status 401 if user is not found in db', async function () {
    sinon.stub(UserModel, 'findOne').resolves(null);
    sinon.stub(bcrypt, 'compareSync').returns(true);

    const response = await chai.request(app).post('/login').send({
      email: 'user@user.com',
      password: '12345678',
    });

    expect(response).to.have.status(401);
    expect(response.body).to.deep.equal(invalidErrorMsg);
  });

  it("should return status 401 if password doesn't match", async function () {
    sinon.stub(UserModel, 'findOne').resolves(UserModel.build(mockValidUser));
    sinon.stub(bcrypt, 'compareSync').returns(false);

    const response = await chai.request(app).post('/login').send({
      email: 'user@user.com',
      password: '12345678',
    });

    expect(response).to.have.status(401);
    expect(response.body).to.deep.equal(invalidErrorMsg);
  });

  it('should return status 401 if password has less than 6 characters', async function () {
    sinon.stub(UserModel, 'findOne').resolves(UserModel.build(mockValidUser));
    sinon.stub(bcrypt, 'compareSync').returns(true);

    const response = await chai.request(app).post('/login').send({
      email: 'user@user.com',
      password: '12345',
    });

    expect(response).to.have.status(401);
    expect(response.body).to.deep.equal(invalidErrorMsg);
  });

  it("should return status 401 if email doesn't match the regex", async function () {
    sinon.stub(UserModel, 'findOne').resolves(UserModel.build(mockValidUser));
    sinon.stub(bcrypt, 'compareSync').returns(true);

    const invalidEmails = [
      'user.com',
      'user@user',
      'user@user.',
      'user@.com',
      'user@.',
      '@user.com',
    ];

    const testsPromises = invalidEmails.map(async (email) => {
      const response = await chai.request(app).post('/login').send({
        email,
        password: '12345678',
      });

      expect(response).to.have.status(401);
      expect(response.body).to.deep.equal(invalidErrorMsg);
    });

    await Promise.all(testsPromises);
  });

  it("should return status 400 if password wasn't sent", async function () {
    sinon.stub(UserModel, 'findOne').resolves(UserModel.build(mockValidUser));
    sinon.stub(bcrypt, 'compareSync').returns(true);

    const response = await chai.request(app).post('/login').send({
      email: 'user@user.com',
    });

    expect(response).to.have.status(400);
    expect(response.body).to.deep.equal(missingErrorMsg);
  });

  it("should return status 400 if email wasn't sent", async function () {
    sinon.stub(UserModel, 'findOne').resolves(UserModel.build(mockValidUser));
    sinon.stub(bcrypt, 'compareSync').returns(true);

    const response = await chai.request(app).post('/login').send({
      password: '12345678',
    });

    expect(response).to.have.status(400);
    expect(response.body).to.deep.equal(missingErrorMsg);
  });
});
