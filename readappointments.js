async function fetchAppointments() {
  const res = await fetch('http://localhost:3000/api/appointments');
  const data = await res.json();
  return data;
}

function displayAppointments(appointments) {
  const tbody = document.getElementById('appointmentTableBody');
  tbody.innerHTML = '';
  appointments.forEach(app => {
    const row = `
      <tr>
        <td>${app.customerName}</td>
        <td>${app.email}</td>
        <td>${app.phoneNumber}</td>
        <td>${app.gender}</td>
        <td>${app.service}</td>
        <td>${app.date}</td>
        <td>${app.time}</td>
      </tr>
    `;
    tbody.innerHTML += row;
  });
}

function applySearchSort(data) {
  const searchTerm = document.getElementById('searchInput').value.toLowerCase();
  const sortValue = document.getElementById('sortSelect').value;

  let filtered = data.filter(app =>
    app.customerName.toLowerCase().includes(searchTerm) ||
    app.email.toLowerCase().includes(searchTerm)
  );

  if (sortValue === 'name') {
    filtered.sort((a, b) => a.customerName.localeCompare(b.customerName));
  } else if (sortValue === 'date') {
    filtered.sort((a, b) => new Date(a.date) - new Date(b.date));
  }

  displayAppointments(filtered);
}

window.addEventListener('DOMContentLoaded', async () => {
  const appointments = await fetchAppointments();
  displayAppointments(appointments);

  document.getElementById('searchInput').addEventListener('input', () => applySearchSort(appointments));
  document.getElementById('sortSelect').addEventListener('change', () => applySearchSort(appointments));
});

