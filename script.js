const form = document.getElementById("registrationForm");
const message = document.getElementById("message");

console.log("Script loaded");async function loadStats() {
    try {
        const response = await fetch("/stats");
        const stats = await response.json();

        document.getElementById("registrationCount").textContent = stats.registrations;
        document.getElementById("collegeCount").textContent = 10 + stats.colleges;

    } catch (error) {
        console.log("Stats Error:", error);
    }
}

// Page load hote hi stats dikhao
loadStats();


form.addEventListener("submit", async function (event) {
    event.preventDefault();

    console.log("Submit clicked");

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

        console.log("Status:", response.status);

        const result = await response.json();

        console.log(result);

        message.style.color = "green";
        message.textContent = result.message;
        loadStats();

    } catch (error) {
        console.log("Fetch Error:", error);
    }
});