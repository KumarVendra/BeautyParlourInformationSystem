document.getElementById('deleteForm').addEventListener('submit', async function (e) {
  e.preventDefault();

  const email = document.getElementById('email').value.trim().toLowerCase();
  if (!email) {
    alert("Please enter an email");
    return;
  }

  if (!confirm("Are you sure you want to delete this appointment?")) return;

  try {
    const res = await fetch(`http://localhost:3000/api/appointments/${email}`, {
      method: 'DELETE'
    });

    const data = await res.json();

    if (res.ok) {
      alert("Appointment deleted successfully.");
      document.getElementById('deleteForm').reset();
    } else {
      alert(data.message || "Failed to delete.");
    }
  } catch (err) {
    alert("Error while deleting appointment.");
    console.error(err);
  }
});
