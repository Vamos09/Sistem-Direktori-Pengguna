const API_USERS_URL = 'https://jsonplaceholder.typicode.com/users';
const LOCAL_KEY = 'registeredUsers';

export function normalizeUsername(username) {
  return String(username || '').trim();
}

export function normalizeEmail(email) {
  return String(email || '').trim().toLowerCase();
}

export function findUserByCredentials(users, username, email) {
  const normalizedUsername = normalizeUsername(username);
  const normalizedEmail = normalizeEmail(email);

  return users.find(user => {
    const localUsername = normalizeUsername(user.username);
    const localEmail = normalizeEmail(user.email);
    return localUsername === normalizedUsername && localEmail === normalizedEmail;
  });
}

if (typeof document !== 'undefined') {
  document.getElementById('loginForm')?.addEventListener('submit', async function (e) {
    e.preventDefault();

    const username = normalizeUsername(document.getElementById('username').value);
    const email = normalizeEmail(document.getElementById('email').value);
    const status = document.getElementById('loginStatus');

    if (!username || !email) {
      status.innerHTML = '<span class="error">Sila isikan nama pengguna dan e-mel.</span>';
      return;
    }

    status.innerHTML = '<span class="muted">Memeriksa data...</span>';

    let users = [];
    let apiFailed = false;

    try {
      const response = await fetch(API_USERS_URL);
      if (response.ok) {
        const apiUsers = await response.json();
        users = apiUsers;
      } else {
        apiFailed = true;
      }
    } catch (err) {
      apiFailed = true;
    }

    const localUsers = JSON.parse(localStorage.getItem(LOCAL_KEY) || '[]').map(user => ({
      ...user,
      username: user.username || ''
    }));

    users = [...localUsers, ...users];

    const found = findUserByCredentials(users, username, email);

    if (found) {
      status.innerHTML = '<span class="success">Log masuk berjaya. Username dan e-mel sepadan.</span>';
    } else if (apiFailed && localUsers.length > 0) {
      status.innerHTML = '<span class="error">Log masuk gagal. Data tidak sepadan.</span>';
    } else if (apiFailed) {
      status.innerHTML = '<span class="error">Ralat sambungan API. Sila cuba lagi atau daftar terlebih dahulu.</span>';
    } else {
      status.innerHTML = '<span class="error">Log masuk gagal. Username atau e-mel tidak sepadan.</span>';
    }
  });
}