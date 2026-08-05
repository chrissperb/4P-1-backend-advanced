const mongoose = require('mongoose');
const crypto = require('crypto');

const ALLOWED_ROLES = ['user', 'admin', 'manager'];

const userSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      default: () => crypto.randomUUID(),
      unique: true,
      index: true
    },
    name: {
      type: String,
      required: [true, 'Validation error: name is mandatory.'],
      trim: true,
      validate: {
        validator: function (v) {
          return typeof v === 'string' && v.trim().length >= 2;
        },
        message: 'Validation error: name must be a string with at least 2 characters.'
      }
    },
    birthday: {
      type: Date,
      required: [true, 'Validation error: birthday is mandatory.'],
      validate: [
        {
          validator: function (v) {
            return v instanceof Date && !isNaN(v.getTime());
          },
          message: 'Validation error: birthday must be a valid date format (e.g. YYYY-MM-DD).'
        },
        {
          validator: function (v) {
            return v <= new Date();
          },
          message: 'Validation error: birthday cannot be a future date.'
        },
        {
          validator: function (v) {
            return v >= new Date('1900-01-01');
          },
          message: 'Validation error: birthday cannot be before year 1900.'
        }
      ]
    },
    email: {
      type: String,
      required: [true, 'Validation error: invalid email format.'],
      lowercase: true,
      trim: true,
      unique: true,
      validate: {
        validator: function (v) {
          return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
        },
        message: 'Validation error: invalid email format.'
      }
    },
    password: {
      type: String,
      required: [true, 'Validation error: password must be at least 6 characters long.'],
      minlength: [6, 'Validation error: password must be at least 6 characters long.']
    },
    role: {
      type: [String],
      default: ['user'],
      validate: {
        validator: function (roles) {
          if (!Array.isArray(roles)) return false;
          return roles.every(r => ALLOWED_ROLES.includes(r));
        },
        message: props => `Validation error: invalid role(s). Allowed roles: ${ALLOWED_ROLES.join(', ')}.`
      }
    },
    isActive: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
);

// Virtual for calculating age dynamically
userSchema.methods.getAge = function () {
  const today = new Date();
  const birth = new Date(this.birthday);
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  return age;
};

// Instance method to authenticate user
userSchema.methods.authenticate = function (inputPassword) {
  return this.password === inputPassword;
};

// Method to update profile with validation
userSchema.methods.updateProfile = function ({ name, email, birthday }) {
  if (name !== undefined) {
    if (!name || typeof name !== 'string' || name.trim().length < 2) {
      throw new Error('Validation error: name must be a string with at least 2 characters.');
    }
    this.name = name.trim();
  }

  if (email !== undefined) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || typeof email !== 'string' || !emailRegex.test(email.trim())) {
      throw new Error('Validation error: invalid email format.');
    }
    this.email = email.toLowerCase().trim();
  }

  if (birthday !== undefined) {
    const birthDate = new Date(birthday);
    if (isNaN(birthDate.getTime())) {
      throw new Error('Validation error: birthday must be a valid date format (e.g. YYYY-MM-DD).');
    }
    if (birthDate > new Date()) {
      throw new Error('Validation error: birthday cannot be a future date.');
    }
    if (birthDate < new Date('1900-01-01')) {
      throw new Error('Validation error: birthday cannot be before year 1900.');
    }
    this.birthday = birthDate;
  }
};

// Configure JSON output representation
userSchema.set('toJSON', {
  transform: (doc, ret) => {
    return {
      id: ret.id,
      name: ret.name,
      birthday: ret.birthday ? new Date(ret.birthday).toISOString().split('T')[0] : null,
      age: doc.getAge(),
      email: ret.email,
      role: ret.role,
      isActive: ret.isActive,
      createdAt: ret.createdAt,
      updatedAt: ret.updatedAt
    };
  }
});

const User = mongoose.model('User', userSchema);

module.exports = User;
