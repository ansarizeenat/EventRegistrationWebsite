const form = document.getElementById("registrationForm");
const message = document.getElementById("message");

console.log("Script loaded");

async function loadStats() {
    try {
        const response = await fetch("/stats");
        const stats = await response.json();

        const registrationCount = document.getElementById("registrationCount");
        const collegeCount = document.getElementById("collegeCount");

        if (registrationCount) {
            registrationCount.textContent = stats.registrations;
        }

        if (collegeCount) {
            collegeCount.textContent = 10 + stats.colleges;
        }

    } catch (error) {
        console.log("Stats Error:", error);
    }
}

loadStats();

if (form) {

    form.addEventListener("submit", async function (event) {
        event.preventDefault();

        const data = {
            fullName: document.getElementById("fullName").value,
            email: document.getElementById("email").value,
            phone: document.getElementById("phone").value,
            college: document.getElementById("college").value,
            course: document.getElementById("course").value,
            event: document.getElementById("event").value
        };

        try {
            const response = await fetch("/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(data)
            });

            const result = await response.json();

            if (message) {
                message.style.color = "green";
                message.textContent = result.message;
            }
            setTimeout(() => {
    window.location.href = "index.html";
}, 2000);

            loadStats();


        } catch (error) {
            console.log("Fetch Error:", error);
        }

    });

}