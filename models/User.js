const crypto = require('crypto');

const ALLOWED_ROLES = ['user', 'admin', 'manager'];

class User {
  /**
   * @param {Object} params
   * @param {string} params.name - Full name (mandatory)
   * @param {string|Date} params.birthday - Birth date (mandatory, cannot be future date)
   * @param {string} params.email - Email address (mandatory)
   * @param {string} params.password - Password (mandatory, min 6 chars)
   * @param {string[]} [params.role=['user']] - Array of user roles (optional)
   */
  constructor({ name, birthday, email, password, role = ['user'] }) {
    this._validateConstructorArgs({ name, birthday, email, password, role });

    this.id = crypto.randomUUID();
    this.name = name.trim();
    this.birthday = new Date(birthday);
    this.email = email.toLowerCase().trim();
    this.password = password;
    this.role = Array.isArray(role) ? role : [role];
    this.isActive = true;
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }

  _validateConstructorArgs({ name, birthday, email, password, role }) {
    this._validateName(name);
    this._validateBirthday(birthday);
    this._validateEmail(email);
    this._validatePassword(password);
    if (role) this._validateRole(role);
  }

  _validateName(name) {
    if (!name || typeof name !== 'string' || name.trim().length < 2) {
      const msg = 'Validation error: name must be a string with at least 2 characters.';
      console.warn(`[VALIDATION FAILED] ${msg} (Received: "${name}")`);
      throw new Error(msg);
    }
  }

  _validateBirthday(birthday) {
    if (!birthday) {
      const msg = 'Validation error: birthday is mandatory.';
      console.warn(`[VALIDATION FAILED] ${msg}`);
      throw new Error(msg);
    }

    const birthDate = new Date(birthday);
    if (isNaN(birthDate.getTime())) {
      const msg = 'Validation error: birthday must be a valid date format (e.g. YYYY-MM-DD).';
      console.warn(`[VALIDATION FAILED] ${msg} (Received: "${birthday}")`);
      throw new Error(msg);
    }

    const now = new Date();
    if (birthDate > now) {
      const msg = 'Validation error: birthday cannot be a future date.';
      console.warn(`[VALIDATION FAILED] ${msg} (Received: "${birthday}")`);
      throw new Error(msg);
    }

    const minDate = new Date('1900-01-01');
    if (birthDate < minDate) {
      const msg = 'Validation error: birthday cannot be before year 1900.';
      console.warn(`[VALIDATION FAILED] ${msg} (Received: "${birthday}")`);
      throw new Error(msg);
    }
  }

  _validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || typeof email !== 'string' || !emailRegex.test(email.trim())) {
      const msg = 'Validation error: invalid email format.';
      console.warn(`[VALIDATION FAILED] ${msg} (Received: "${email}")`);
      throw new Error(msg);
    }
  }

  _validatePassword(password) {
    if (!password || typeof password !== 'string' || password.length < 6) {
      const msg = 'Validation error: password must be at least 6 characters long.';
      console.warn(`[VALIDATION FAILED] ${msg}`);
      throw new Error(msg);
    }
  }

  _validateRole(role) {
    const rolesArray = Array.isArray(role) ? role : [role];
    const invalidRoles = rolesArray.filter(r => !ALLOWED_ROLES.includes(r));
    if (invalidRoles.length > 0) {
      const msg = `Validation error: invalid role(s) [${invalidRoles.join(', ')}]. Allowed roles: ${ALLOWED_ROLES.join(', ')}.`;
      console.warn(`[VALIDATION FAILED] ${msg}`);
      throw new Error(msg);
    }
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
    if (name !== undefined) {
      this._validateName(name);
      this.name = name.trim();
    }
    if (email !== undefined) {
      this._validateEmail(email);
      this.email = email.toLowerCase().trim();
    }
    if (birthday !== undefined) {
      this._validateBirthday(birthday);
      this.birthday = new Date(birthday);
    }
    this.updatedAt = new Date();
  }

  updatePassword(newPassword) {
    this._validatePassword(newPassword);
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
