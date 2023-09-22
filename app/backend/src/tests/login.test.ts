import * as sinon from 'sinon';
import * as chai from 'chai';
// @ts-ignore
import chaiHttp = require('chai-http');
import { app } from '../app';
import UserModel from '../database/models/UserModel';
import { invalidErrorMsg, missingErrorMsg, mockValidUser } from './mocks/user.mocks';
import * as bcrypt from 'bcryptjs';
import Token from '../auth/Token';

const { expect } = chai;

chai.use(chaiHttp);

describe('Route /login', function () {
  afterEach(function () {
    sinon.restore();
  });

  describe('POST /login', function () {
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
        'user@user.commm'
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

  describe('GET /login/role', function () {
    it('should return the user role', async function () {
      const token = new Token().generateToken(mockValidUser);
      const response = await chai
        .request(app)
        .get('/login/role')
        .set('Authorization', `Bearer ${token}`);

      expect(response).to.have.status(200);
      expect(response.body).to.deep.equal({ role: 'admin' });
    });

    it("should return status 401 if token wasn't sent", async function () {
      const response = await chai.request(app).get('/login/role');

      expect(response).to.have.status(401);
      expect(response.body).to.deep.equal({ message: 'Token not found' });
    });

    it('should return status 401 is token is invalid', async function () {
      const response = await chai
        .request(app)
        .get('/login/role')
        .set('Authorization', `Bearer thisisaninvalidtoken`);

      expect(response).to.have.status(401);
      expect(response.body).to.deep.equal({ message: 'Token must be a valid token' });
    });
  });
});
