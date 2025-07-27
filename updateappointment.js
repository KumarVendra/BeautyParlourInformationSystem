let currentUserId = null;

document.getElementById('searchForm').addEventListener('submit', async function (e) {
  e.preventDefault();
  const email = document.getElementById('searchEmail').value.trim().toLowerCase();

  try {
    const res = await fetch(`http://localhost:3000/api/appointments/${email}`);
    const data = await res.json();

    if (!res.ok) {
      alert(data.message || 'Appointment not found');
      return;
    }

    currentUserId = data._id;

    document.getElementById('customerName').value = data.customerName;
    document.getElementById('phoneNumber').value = data.phoneNumber;
    document.getElementById('gender').value = data.gender;
    document.getElementById('service').value = data.service;
    document.getElementById('date').value = data.date;
    document.getElementById('time').value = data.time;

    document.getElementById('updateForm').style.display = 'block';
  } catch (err) {
    alert('Error fetching appointment');
    console.error(err);
  }
});

document.getElementById('updateForm').addEventListener('submit', async function (e) {
  e.preventDefault();

  const updatedData = {
    customerName: document.getElementById('customerName').value.trim(),
    phoneNumber: document.getElementById('phoneNumber').value.trim(),
    gender: document.getElementById('gender').value,
    service: document.getElementById('service').value,
    date: document.getElementById('date').value,
    time: document.getElementById('time').value
  };

  try {
    const res = await fetch(`http://localhost:3000/api/appointments/${currentUserId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedData)
    });

    const data = await res.json();
    if (res.ok) {
      alert('Appointment updated successfully!');
      document.getElementById('updateForm').style.display = 'none';
      document.getElementById('searchForm').reset();
    } else {
      alert(data.message);
    }
  } catch (err) {
    alert('Update failed');
    console.error(err);
  }
});
