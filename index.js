const User = require('./User');

try {
  const user = new User({
    name: 'Alice Silva',
    birthday: '1995-05-15',
    email: 'alice@example.com',
    password: 'secretPassword123'
  });

  console.log('User created:', user.toJSON());
  console.log('Age:', user.getAge());
  console.log('Auth check (correct):', user.authenticate('secretPassword123'));
  console.log('Auth check (wrong):', user.authenticate('wrongPass'));

  user.updateProfile({ name: 'Alice S. Ramos' });
  console.log('Updated user:', user.toJSON());

} catch (err) {
  console.error('User creation failed:', err.message);
}
