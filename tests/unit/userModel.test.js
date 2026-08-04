const User = require('../../models/User');

describe('User Model Unit Tests', () => {
  it('should create a valid user instance', () => {
    const validData = {
      name: 'John Doe',
      birthday: '1995-05-15',
      email: 'john@example.com',
      password: 'password123',
      role: ['user', 'admin']
    };

    const user = new User(validData);

    expect(user.name).toBe('John Doe');
    expect(user.email).toBe('john@example.com');
    expect(user.role).toEqual(['user', 'admin']);
    expect(user.isActive).toBe(true);
    expect(user.id).toBeDefined();
  });

  it('should calculate age correctly', () => {
    const user = new User({
      name: 'Alice',
      birthday: '2000-01-01',
      email: 'alice@example.com',
      password: 'password123'
    });

    expect(typeof user.getAge()).toBe('number');
    expect(user.getAge()).toBeGreaterThan(0);
  });

  it('should authenticate correct password and reject wrong password', () => {
    const user = new User({
      name: 'Bob',
      birthday: '1990-03-20',
      email: 'bob@example.com',
      password: 'secretPassword'
    });

    expect(user.authenticate('secretPassword')).toBe(true);
    expect(user.authenticate('wrongPassword')).toBe(false);
  });

  it('should fail validation if name is too short', async () => {
    const user = new User({
      name: 'A',
      birthday: '1990-01-01',
      email: 'a@example.com',
      password: 'password123'
    });

    try {
      await user.validate();
      fail('Should have failed validation');
    } catch (err) {
      expect(err.errors.name).toBeDefined();
    }
  });

  it('should fail validation if birthday is a future date', async () => {
    const user = new User({
      name: 'Future Person',
      birthday: '2099-01-01',
      email: 'future@example.com',
      password: 'password123'
    });

    try {
      await user.validate();
      fail('Should have failed validation');
    } catch (err) {
      expect(err.errors.birthday).toBeDefined();
    }
  });

  it('should fail validation if birthday is before 1900', async () => {
    const user = new User({
      name: 'Old Person',
      birthday: '1850-01-01',
      email: 'old@example.com',
      password: 'password123'
    });

    try {
      await user.validate();
      fail('Should have failed validation');
    } catch (err) {
      expect(err.errors.birthday).toBeDefined();
    }
  });

  it('should fail validation for invalid email format', async () => {
    const user = new User({
      name: 'Invalid Email',
      birthday: '1995-01-01',
      email: 'invalid-email-str',
      password: 'password123'
    });

    try {
      await user.validate();
      fail('Should have failed validation');
    } catch (err) {
      expect(err.errors.email).toBeDefined();
    }
  });

  it('should fail validation for invalid role', async () => {
    const user = new User({
      name: 'Bad Role',
      birthday: '1995-01-01',
      email: 'role@example.com',
      password: 'password123',
      role: ['superhero']
    });

    try {
      await user.validate();
      fail('Should have failed validation');
    } catch (err) {
      expect(err.errors.role).toBeDefined();
    }
  });
});
