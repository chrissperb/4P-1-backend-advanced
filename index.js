const User = require('./User');
const express = require('express');

const app = express();

const PORT = 3000;

app.use(express.json());

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
})

console.log('=== DEMONSTRATING ALL USER METHODS ===\n');

try {
  // 1. Instantiation (Constructor)
  console.log('1. Instantiating new User...');
  const user = new User({
    name: 'Alice Silva',
    birthday: '1995-05-15',
    email: 'alice@example.com',
    password: 'secretPassword123',
    role: ['user', 'admin']
  });
  console.log('User created successfully!');

  // 2. toJSON()
  console.log('\n2. toJSON() - Public Object Representation:');
  console.log(user.toJSON());

  // 3. getAge()
  console.log('\n3. getAge():');
  console.log(`Age: ${user.getAge()} years old`);

  // 4. authenticate()
  console.log('\n4. authenticate():');
  console.log('Testing correct password:', user.authenticate('secretPassword123')); // true
  console.log('Testing wrong password:', user.authenticate('wrongPassword'));     // false

  // 5. updateProfile()
  console.log('\n5. updateProfile():');
  user.updateProfile({
    name: 'Alice Silva Ramos',
    email: 'alice.ramos@example.com',
    birthday: '1995-05-20'
  });
  console.log('Profile updated. Updated user data:');
  console.log(user.toJSON());

  // 6. updatePassword()
  console.log('\n6. updatePassword():');
  user.updatePassword('newSecurePassword2026');
  console.log('Password updated.');
  console.log('Testing old password:', user.authenticate('secretPassword123')); // false
  console.log('Testing new password:', user.authenticate('newSecurePassword2026')); // true

  // 7. deactivate()
  console.log('\n7. deactivate():');
  user.deactivate();
  console.log(`isActive status: ${user.isActive}`);
  console.log('User JSON after deactivation:', user.toJSON());

  // 8. activate()
  console.log('\n8. activate():');
  user.activate();
  console.log(`isActive status: ${user.isActive}`);
  console.log('User JSON after reactivation:', user.toJSON());

  // 9. Validation Error Handling
  console.log('\n9. Validation Error handling demonstration:');
  try {
    new User({
      name: '',
      birthday: 'invalid-date',
      email: 'invalid-email',
      password: '123'
    });
  } catch (validationErr) {
    console.log('Caught expected validation error:', validationErr.message);
  }

  console.log('\n=== ALL METHOD DEMONSTRATIONS COMPLETED ===');

} catch (err) {
  console.error('Unexpected error:', err.message);
}
