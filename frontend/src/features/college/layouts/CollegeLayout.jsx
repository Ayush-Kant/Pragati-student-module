export const CollegeLayout = ({ children }) => {
  return (
    <div>
        <h1>College Dashboard</h1>
        <div style={{ display: "flex" }}>
            <div style={{ width: "200px", background: "#e2e8f0", padding: "20px" }}>
                <ul style={{ listStyle: "none", padding: 0 }}>
                    <li style={{ marginBottom: "10px" }}>
                        <a href="/college/dashboard">Dashboard</a>
                    </li>
                    <li style={{ marginBottom: "10px" }}>
                        <a href="/college/students">Students</a>
                    </li>
                    <li style={{ marginBottom: "10px" }}>
                        <a href="/college/certificates">Certificates</a>
                    </li>
                </ul>
            </div>
            <main style={{ padding: "20px", width: "100%", background: "#f1f5f9", minHeight: "100vh" }}>
                {children}
            </main>
        </div>
    </div>
  );
}