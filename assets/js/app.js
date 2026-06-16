let semuaPengguna = [];
const LOCAL_KEY = 'registeredUsers';

function loadLocalUsers() {
  try {
    const raw = localStorage.getItem(LOCAL_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    // Ensure shape matches API users
    return parsed.map(u => ({
      id: u.id || ('local-' + Date.now()),
      name: u.name,
      email: u.email,
      phone: u.phone || '',
      company: { name: (u.company && u.company.name) || 'Peribadi' }
    }));
  } catch (err) {
    console.error('Gagal muat local users', err);
    return [];
  }
}

async function dapatkanData() {
  const senarai = document.getElementById("senaraiPengguna");
  const status = document.getElementById("status");

  senarai.innerHTML = "";
  status.innerHTML = "Sedang mendapatkan data...";

  try {
    const response = await fetch("https://jsonplaceholder.typicode.com/users");

    if (!response.ok) {
      throw new Error("Masalah sambungan API");
    }

    const data = await response.json();
    // Gabungkan local users di hadapan supaya mudah dilihat
    const local = loadLocalUsers();
    semuaPengguna = [...local, ...data];

    status.innerHTML = "<p class='success'>Data berjaya diperoleh daripada API.</p>";
    paparPengguna(semuaPengguna);

  } catch (error) {
    status.innerHTML = "<p class='error'>Ralat sambungan API. Memaparkan pengguna tempatan sahaja.</p>";
    console.error("Ralat:", error);
    semuaPengguna = loadLocalUsers();
    paparPengguna(semuaPengguna);
  }
}

function paparPengguna(data) {
  const senarai = document.getElementById("senaraiPengguna");
  senarai.innerHTML = "";

  if (!data || data.length === 0) {
    senarai.innerHTML = '<p class="muted">Tiada pengguna untuk dipaparkan.</p>';
    return;
  }

  data.forEach(user => {
    const companyName = (user.company && user.company.name) ? user.company.name : '';
    senarai.innerHTML += `
      <div class="user-card">
        <h3>${escapeHtml(user.name)}</h3>
        <p><strong>E-mel:</strong> ${escapeHtml(user.email || '')}</p>
        <p><strong>Telefon:</strong> ${escapeHtml(user.phone || '')}</p>
        <p><strong>Syarikat:</strong> ${escapeHtml(companyName)}</p>
      </div>
    `;
  });
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// Papar pengguna tempatan terlebih dahulu semasa muat
document.addEventListener('DOMContentLoaded', function () {
  semuaPengguna = loadLocalUsers();
  paparPengguna(semuaPengguna);
});

document.getElementById("searchInput")?.addEventListener("input", function () {
  const keyword = this.value.toLowerCase();

  const hasil = semuaPengguna.filter(user =>
    (user.name || '').toLowerCase().includes(keyword) ||
    (user.email || '').toLowerCase().includes(keyword)
  );

  paparPengguna(hasil);
});

// Expose functions to window when loaded as module so inline handlers work
if (typeof window !== 'undefined') {
  window.dapatkanData = dapatkanData;

  window.hapusPengguna = function (userId) {
    if (!confirm('Adakah anda pasti ingin menghapus pengguna ini?')) return;
    try {
      const key = LOCAL_KEY;
      const stored = JSON.parse(localStorage.getItem(key) || '[]');
      const filtered = stored.filter(u => u.id !== userId);
      localStorage.setItem(key, JSON.stringify(filtered));

      semuaPengguna = loadLocalUsers();
      const searchInput = document.getElementById("searchInput");
      if (searchInput && searchInput.value) {
        const keyword = searchInput.value.toLowerCase();
        const hasil = semuaPengguna.filter(user =>
          (user.name || '').toLowerCase().includes(keyword) ||
          (user.email || '').toLowerCase().includes(keyword)
        );
        paparPengguna(hasil);
      } else {
        paparPengguna(semuaPengguna);
      }

      const status = document.getElementById("status");
      if (status) {
        status.innerHTML = "<p class='success'>Pengguna berjaya dihapus.</p>";
        setTimeout(() => { status.innerHTML = ""; }, 3000);
      }
    } catch (err) {
      console.error('Gagal hapus pengguna:', err);
      alert('Ralat menghapus pengguna. Sila cuba lagi.');
    }
  };

  window.hapusSemuaData = function () {
    if (!confirm('⚠️  Adakah anda pasti ingin menghapus SEMUA data pengguna yang didaftar?')) return;
    try {
      localStorage.removeItem(LOCAL_KEY);
      semuaPengguna = loadLocalUsers();
      paparPengguna(semuaPengguna);
      const status = document.getElementById("status");
      if (status) {
        status.innerHTML = "<p class='success'>Semua data yang didaftar berjaya dihapus.</p>";
        setTimeout(() => { status.innerHTML = ""; }, 3000);
      }
    } catch (err) {
      console.error('Gagal hapus data:', err);
      alert('Ralat menghapus data. Sila cuba lagi.');
    }
  };
}