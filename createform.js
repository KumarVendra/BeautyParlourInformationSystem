document.getElementById('createForm').addEventListener('submit', async function (e) {
  e.preventDefault();

  const appointment = {
    customerName: document.getElementById('customerName').value.trim(),
    email: document.getElementById('email').value.trim(),
    phoneNumber: document.getElementById('phoneNumber').value.trim(),
    gender: document.getElementById('gender').value,
    service: document.getElementById('service').value,
    date: document.getElementById('date').value,
    time: document.getElementById('time').value,
  };

  try {
    const res = await fetch('http://localhost:3000/api/appointments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(appointment),
    });

    const data = await res.json();
    if (res.ok) {
      alert(data.message);
      document.getElementById('createForm').reset();
    } else {
      alert(`Error: ${data.message}`);
    }
  } catch (err) {
    alert('Something went wrong.');
    console.error(err);
  }
});
