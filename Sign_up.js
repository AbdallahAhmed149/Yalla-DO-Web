let selectedRole = '';

/* ── Open Modal ── */
function openModal(role) {
  selectedRole = role;
  const badge = document.getElementById('modalBadge');
  const title = document.getElementById('modalTitle');
  const sub   = document.getElementById('modalSub');

  if (role === 'teacher') {
    badge.textContent = '👩‍🏫 Teacher';
    badge.style.background = '#eff6ff'; badge.style.color = '#3b82f6';
    title.textContent = 'Sign Up as Teacher';
    sub.textContent   = 'Create your YallaDo teacher account';
  } else if (role === 'admin') {
    badge.textContent = '🛠️ Admin';
    badge.style.background = '#fef3c7'; badge.style.color = '#92400e';
    title.textContent = 'Sign Up as Admin';
    sub.textContent   = 'Create your YallaDo admin account';
  }

  document.getElementById('modalOverlay').classList.add('open');
}

/* ── Close Modal ── */
function closeModal() {
  document.getElementById('modalOverlay').classList.remove('open');
}

function closeModalOutside(e) {
  if (e.target === document.getElementById('modalOverlay')) closeModal();
}

/* ── Handle Signup ── */
function handleSignup() {
  if (!selectedRole) {
    alert('Please choose: Are you a Teacher or an Admin?');
    return;
  }

  const name     = document.getElementById('inputName').value.trim();
  const email    = document.getElementById('inputEmail').value.trim();
  const password = document.getElementById('inputPassword').value.trim();

  if (!name || !email || !password) {
    alert('Please fill in all fields.');
    return;
  }

  // Save user to localStorage
  const users = JSON.parse(localStorage.getItem('yallado_users') || '[]');
  users.push({ name, email, password, role: selectedRole });
  localStorage.setItem('yallado_users', JSON.stringify(users));

  localStorage.setItem('yallado_role',  selectedRole);
  localStorage.setItem('yallado_email', email);

  // Redirect based on role
  if (selectedRole === 'admin') {
    window.location.href = 'Admin_Dashboard.html';
  } else {
    window.location.href = 'Teacher_Dashboard.html';
  }
}
