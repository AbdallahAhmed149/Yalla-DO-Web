document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.querySelector('form');

  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const email    = document.getElementById('user_email').value;
    const password = document.getElementById('password').value;

    const users = JSON.parse(localStorage.getItem('yallado_users') || '[]');
    const user  = users.find(u => u.email === email && u.password === password);

    if (!user) {
      alert('Email or password is incorrect.');
      return;
    }

    localStorage.setItem('yallado_role',  user.role);
    localStorage.setItem('yallado_email', user.email);

    if (user.role === 'admin') {
      window.location.href = 'Admin_dashboard.html';
    } else {
      window.location.href = 'Teacher_dashboard.html';
    }
  });
});
