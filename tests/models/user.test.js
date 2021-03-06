import TestHelpers from '../tests-helpers';
import models from '../../src/models';

describe('User', () => {
  beforeAll(async () => {
    await TestHelpers.startDb();
  });

  afterAll(async () => {
    await TestHelpers.stopDb();
  });

  // drop the table before each test and use the model definition
  beforeEach(async () => {
    await TestHelpers.syncDb();
  });

  describe('start methods', () => {
    describe('hashPassword', () => {
      it('should hash the password passed in the arguments', async () => {
        const { User } = models;
        const password = 'Test123#';
        const hashedPassword = await User.hashPassword(password);
        expect(password).not.toEqual(hashedPassword);
      });
    });

    describe('createNewUser', () => {
      it('should create a new user successfully', async () => {
        const { User } = models;
        const data = {
          email: 'test@example.com',
          password: 'password123#',
          roles: ['admin', 'customer'],
          username: 'test',
          firstName: 'First',
          lastName: 'Last',
          refreshToken: 'test-refresh-token',
        };
        const newUser = await User.createNewUser(data);
        const usersCount = await User.count();
        expect(usersCount).toEqual(1);
        expect(newUser.email).toEqual(data.email);
        expect(newUser.username).toEqual(data.username);
        expect(newUser.firstName).toEqual(data.firstName);
        expect(newUser.lastName).toEqual(data.lastName);
        expect(newUser.RefreshToken.token).toEqual(data.refreshToken);
        expect(newUser.Roles.length).toEqual(2);
        expect(newUser.password).toBeUndefined();
        const savedRoles = newUser.Roles.map(
          (savedRole) => savedRole.role
        ).sort();
        expect(savedRoles).toEqual(data.roles.sort());
      });

      it('should error if we create a new user with an invalid email', async () => {
        const { User } = models;
        const data = {
          email: 'invalid',
          password: 'Test123#',
        };
        let error;
        try {
          await User.createNewUser(data);
        } catch (err) {
          error = err;
        }

        expect(error).toBeDefined();
        expect(error.errors.length).toEqual(1);

        const errorObj = error.errors[0];
        expect(errorObj.message).toEqual('Not a valid email address');
        expect(errorObj.path).toEqual('email');
      });

      it('should error if we did not pass an email', async () => {
        const { User } = models;
        const data = {
          password: 'Test123#',
        };
        let error;
        try {
          await User.createNewUser(data);
        } catch (err) {
          error = err;
        }

        expect(error).toBeDefined();
        expect(error.errors.length).toEqual(1);

        const errorObj = error.errors[0];
        expect(errorObj.message).toEqual('Email is required');
        expect(errorObj.path).toEqual('email');
      });

      it('should error if we create a new user with an invalid username', async () => {
        const { User } = models;
        const data = {
          email: 'test@example.com',
          password: 'Test123#',
          username: 'u',
        };
        let error;
        try {
          await User.createNewUser(data);
        } catch (err) {
          error = err;
        }

        expect(error).toBeDefined();
        expect(error.errors.length).toEqual(1);

        const errorObj = error.errors[0];
        expect(errorObj.path).toEqual('username');
        expect(errorObj.message).toEqual(
          'Username must contain between 2 and 50 characters'
        );
      });
    });
  });

  describe('scopes', () => {
    let user;
    beforeEach(async () => {
      user = await TestHelpers.createNewUser();
    });

    describe('defaultScope', () => {
      it('should return a user without a password', async () => {
        const { User } = models;
        const userFound = await User.findByPk(user.id);
        expect(userFound.password).toBeUndefined();
      });
    });

    describe('withPassword', () => {
      it('should return a user with the password', async () => {
        const { User } = models;
        const userFound = await User.scope('withPassword').findByPk(user.id);
        expect(userFound.password).toEqual(expect.any(String));
      });
    });
  });

  describe('instance methods', () => {
    describe('comparePassword', () => {
      let password = 'Test123#';
      let user;
      beforeEach(async () => {
        user = await TestHelpers.createNewUser({ password });
      });

      it('should return true if the password is correct', async () => {
        const { User } = models;
        const userFound = await User.scope('withPassword').findByPk(user.id);
        const isPasswordCorrect = await userFound.comparePasswords(password);
        expect(isPasswordCorrect).toEqual(true);
      });
    });
  });

  describe('hooks', () => {
    it('should not attempt to hash the password if it is not given', async () => {
      const user = await TestHelpers.createNewUser();
      user.email = 'test2@example.com'
      await user.save();
    })
  })
});
