const crypto = require('crypto');

class User {
  /**
   * @param {Object} params
   * @param {string} params.name - Full name (mandatory)
   * @param {string|Date} params.birthday - Birth date (mandatory)
   * @param {string} params.email - Email address (mandatory)
   * @param {string} params.password - Password (mandatory)
   * @param {string[]} [params.role=['user']] - Array of user roles (optional), default is ['user']
   */
  constructor({ name, birthday, email, password, role = ['user'] }) {
    this._validateConstructorArgs({ name, birthday, email, password });

    this.id = crypto.randomUUID();
    this.name = name;
    this.birthday = new Date(birthday);
    this.email = email.toLowerCase().trim();
    this.password = password;
    this.role = role;
    this.isActive = true;
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }

  _validateConstructorArgs({ name, birthday, email, password }) {
    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      throw new Error('Mandatory field missing or invalid: name');
    }
    if (!birthday || isNaN(new Date(birthday).getTime())) {
      throw new Error('Mandatory field missing or invalid: birthday');
    }
    if (!email || !this._isValidEmail(email)) {
      throw new Error('Mandatory field missing or invalid: email');
    }
    if (!password || typeof password !== 'string' || password.length < 6) {
      throw new Error('Mandatory field missing or invalid: password (min 6 chars)');
    }
  }

  _isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  getAge() {
    const today = new Date();
    const birth = new Date(this.birthday);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  }

  updateProfile({ name, email, birthday }) {
    if (name) {
      if (typeof name !== 'string' || name.trim().length === 0) {
        throw new Error('Invalid name');
      }
      this.name = name;
    }
    if (email) {
      if (!this._isValidEmail(email)) {
        throw new Error('Invalid email');
      }
      this.email = email.toLowerCase().trim();
    }
    if (birthday) {
      if (isNaN(new Date(birthday).getTime())) {
        throw new Error('Invalid birthday');
      }
      this.birthday = new Date(birthday);
    }
    this.updatedAt = new Date();
  }

  updatePassword(newPassword) {
    if (!newPassword || typeof newPassword !== 'string' || newPassword.length < 6) {
      throw new Error('Invalid new password (min 6 chars)');
    }
    this.password = newPassword;
    this.updatedAt = new Date();
  }

  authenticate(inputPassword) {
    return this.password === inputPassword;
  }

  deactivate() {
    this.isActive = false;
    this.updatedAt = new Date();
  }

  activate() {
    this.isActive = true;
    this.updatedAt = new Date();
  }

  toJSON() {
    return {
      id: this.id,
      name: this.name,
      birthday: this.birthday.toISOString().split('T')[0],
      age: this.getAge(),
      email: this.email,
      role: this.role,
      isActive: this.isActive,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }
}

module.exports = User;
