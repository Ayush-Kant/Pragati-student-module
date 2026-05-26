async function req() {
  try {
    const res = await fetch("http://localhost:5000/api/student/profile", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "Test",
        phone: "123",
        city: "Test",
        department: "CS",
        cgpa: 9.0,
        skills: "JS"
      })
    });
    console.log(await res.text());
  } catch (err) {
    console.error(err);
  }
}
req();
