console.log("Admin JS Loaded");

async function loadRegistrations() {
    try {
        const response = await fetch("/registrations");
        console.log("Status:", response.status);

        const data = await response.json();
        console.log("Data:", data);

        const tbody = document.querySelector("#studentTable tbody");
        const total = document.querySelector(".dashboard-card p");

        tbody.innerHTML = "";
        total.textContent = data.length;

        data.forEach(student => {
            tbody.innerHTML += `
                <tr>
                    <td>${student.fullName}</td>
                    <td>${student.email}</td>
                    <td>${student.event}</td>
                </tr>
            `;
        });

    } catch (error) {
        console.error("Error:", error);
    }
}

loadRegistrations();