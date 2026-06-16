export function semakEmail(email) {
  return String(email || '').includes('@') && String(email || '').includes('.');
}

export function initValidation() {
  if (typeof document === 'undefined') return;

  const form = document.getElementById('daftarForm');
  if (!form) return;

  form.addEventListener('submit', async function (e) {
    e.preventDefault();

    const nama = document.getElementById('nama').value.trim();
    const username = document.getElementById('username').value.trim();
    const email = document.getElementById('email').value.trim();
    const mesej = document.getElementById('mesej');

    if (nama === '' || username === '' || email === '') {
      if (mesej) mesej.innerHTML = "<span class='error'>Sila lengkapkan semua maklumat.</span>";
      return;
    }

    if (!semakEmail(email)) {
      if (mesej) mesej.innerHTML = "<span class='error'>Format e-mel tidak sah.</span>";
      return;
    }

    const newUser = { name: nama, username: username, email: email };

    try {
      const response = await fetch('https://jsonplaceholder.typicode.com/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newUser)
      });

      if (!response.ok) throw new Error('Gagal hantar data ke API');

      const responseData = await response.json();
      const key = 'registeredUsers';
      const stored = JSON.parse(localStorage.getItem(key) || '[]');
      const storedUser = {
        id: responseData.id ? responseData.id : 'local-' + Date.now(),
        name: nama,
        username: username,
        email: email,
        company: { name: 'Peribadi' }
      };
      stored.unshift(storedUser);
      localStorage.setItem(key, JSON.stringify(stored));

      if (mesej) mesej.innerHTML = "<span class='success'>Pendaftaran berjaya. Menghala ke Carian...</span>";
      setTimeout(() => { window.location.href = 'carian.html'; }, 700);
    } catch (err) {
      console.error('Gagal simpan pendaftaran:', err);
      if (mesej) mesej.innerHTML = "<span class='error'>Ralat menyimpan data. Sila cuba lagi.</span>";
    }
  });
}