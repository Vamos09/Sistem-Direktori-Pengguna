import { describe, it, expect } from 'vitest';
import { findUserByCredentials } from '../assets/js/login.js';

describe('Ujian Login', () => {
  it('mencari pengguna apabila username dan email sepadan', () => {
    const users = [
      { username: 'admin', email: 'admin@example.com' },
      { username: 'user1', email: 'user1@example.com' }
    ];

    const result = findUserByCredentials(users, 'admin', 'admin@example.com');
    expect(result).toEqual({ username: 'admin', email: 'admin@example.com' });
  });

  it('tidak menemui pengguna jika email tidak sepadan', () => {
    const users = [
      { username: 'admin', email: 'admin@example.com' }
    ];

    const result = findUserByCredentials(users, 'admin', 'wrong@example.com');
    expect(result).toBeUndefined();
  });
});