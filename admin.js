let allRegistrations = [];

console.log("Admin JS 2027 Initialized");

// Check Authentication
function checkAdminAuth() {
    const adminToken = localStorage.getItem("campusconnect_admin_token");
    if (!adminToken) {
        // Redirect to login tab for admin
        window.location.href = "login.html?auth=admin";
        return false;
    }
    return true;
}

function adminLogout() {
    localStorage.removeItem("campusconnect_admin_token");
    window.location.href = "login.html";
}

async function loadAdminRegistrations() {
    try {
        const response = await fetch("/registrations");
        if (!response.ok) {
            throw new Error(`HTTP Error: ${response.status}`);
        }

        allRegistrations = await response.json();
        console.log("Loaded registrations:", allRegistrations.length);

        renderAdminDashboard();
        populateEventFilterDropdown();
    } catch (error) {
        console.error("Failed to load registrations:", error);
        const tbody = document.getElementById("adminTableBody");
        if (tbody) {
            tbody.innerHTML = `<tr><td colspan="8" style="text-align: center; color: #ef4444; padding: 25px;">Failed to load data. Please make sure the server is running.</td></tr>`;
        }
    }
}

function renderAdminDashboard() {
    const tbody = document.getElementById("adminTableBody");
    const dashStudents = document.getElementById("dashTotalStudents");
    const dashPasses = document.getElementById("dashTotalPasses");
    const dashRevenue = document.getElementById("dashTotalRevenue");
    const dashColleges = document.getElementById("dashTotalColleges");

    let totalRevenue = 0;
    let totalPasses = 0;
    const uniqueColleges = new Set();

    if (!tbody) return;

    if (!allRegistrations || allRegistrations.length === 0) {
        tbody.innerHTML = `<tr><td colspan="8" style="text-align:center; padding: 30px; color: #64748b;">No registrations found yet.</td></tr>`;
        if (dashStudents) dashStudents.textContent = "0";
        if (dashPasses) dashPasses.textContent = "0";
        if (dashRevenue) dashRevenue.textContent = "₹0";
        if (dashColleges) dashColleges.textContent = "0";
        return;
    }

    let rowsHtml = "";

    allRegistrations.forEach((reg, index) => {
        const regId = reg.registrationId || `CC-2027-${1000 + index}`;
        const total = Number(reg.totalAmount) || 0;
        totalRevenue += total;

        if (reg.college) uniqueColleges.add(reg.college.trim().toLowerCase());

        let eventsListHtml = "";
        let eventCount = 0;

        if (Array.isArray(reg.events) && reg.events.length > 0) {
            eventCount = reg.events.length;
            totalPasses += eventCount;
            eventsListHtml = reg.events.map(e => {
                const name = e.name || e;
                const price = e.price ? ` (₹${e.price})` : "";
                return `<span class="event-badge-tag">${name}${price}</span>`;
            }).join(" ");
        } else if (reg.event) {
            eventCount = 1;
            totalPasses += 1;
            eventsListHtml = `<span class="event-badge-tag">${reg.event}</span>`;
        } else {
            eventsListHtml = `<span style="color:#94a3b8; font-style: italic;">None</span>`;
        }

        const dateStr = reg.createdAt ? new Date(reg.createdAt).toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric"
        }) : "2027";

        rowsHtml += `
            <tr data-index="${index}">
                <td><strong style="color: #0f4c81;">${regId}</strong></td>
                <td><strong>${escapeHtml(reg.fullName || "-")}</strong></td>
                <td>
                    <div>📧 ${escapeHtml(reg.email || "-")}</div>
                    <div style="color: #64748b; font-size: 12.5px;">📞 ${escapeHtml(reg.phone || "-")}</div>
                </td>
                <td>
                    <div>${escapeHtml(reg.college || "-")}</div>
                    <div style="color: #64748b; font-size: 12px;">${escapeHtml(reg.course || "-")}</div>
                </td>
                <td style="max-width: 280px;">${eventsListHtml}</td>
                <td><span class="badge-amount">₹${total}</span></td>
                <td>${dateStr}</td>
                <td>
                    <div style="display: flex; gap: 6px;">
                        <button onclick="viewInvoiceFromAdmin(${index})" title="View Invoice Pass" style="background:#0ea5e9; padding: 6px 10px; font-size: 12px; border-radius: 6px;">
                            🧾 View
                        </button>
                        <button onclick="deleteRegistration('${regId}')" title="Delete Record" style="background:#ef4444; padding: 6px 10px; font-size: 12px; border-radius: 6px;">
                            🗑️
                        </button>
                    </div>
                </td>
            </tr>
        `;
    });

    tbody.innerHTML = rowsHtml;

    if (dashStudents) dashStudents.textContent = allRegistrations.length;
    if (dashPasses) dashPasses.textContent = totalPasses;
    if (dashRevenue) dashRevenue.textContent = `₹${totalRevenue.toLocaleString("en-IN")}`;
    if (dashColleges) dashColleges.textContent = Math.max(1, uniqueColleges.size);
}

function populateEventFilterDropdown() {
    const select = document.getElementById("eventFilterSelect");
    if (!select) return;

    const eventNames = new Set();
    allRegistrations.forEach(r => {
        if (Array.isArray(r.events)) {
            r.events.forEach(e => eventNames.add(e.name || e));
        } else if (r.event) {
            eventNames.add(r.event);
        }
    });

    select.innerHTML = `<option value="">All Events (Filter)</option>`;
    eventNames.forEach(name => {
        select.innerHTML += `<option value="${escapeHtml(name)}">${escapeHtml(name)}</option>`;
    });
}

function filterAdminTable() {
    const search = (document.getElementById("adminSearchInput")?.value || "").toLowerCase();
    const eventFilter = (document.getElementById("eventFilterSelect")?.value || "").toLowerCase();
    const table = document.getElementById("adminStudentsTable");
    if (!table) return;

    const rows = table.getElementsByTagName("tbody")[0].getElementsByTagName("tr");

    for (let i = 0; i < rows.length; i++) {
        const text = rows[i].innerText.toLowerCase();
        const matchesSearch = !search || text.includes(search);
        const matchesEvent = !eventFilter || text.includes(eventFilter);

        if (matchesSearch && matchesEvent) {
            rows[i].style.display = "";
        } else {
            rows[i].style.display = "none";
        }
    }
}

function viewInvoiceFromAdmin(index) {
    const reg = allRegistrations[index];
    if (!reg) return;

    const modal = document.getElementById("invoiceModal");
    if (!modal) return;

    document.getElementById("modalRegId").textContent = reg.registrationId || "CC-2027-1001";
    document.getElementById("modalFullName").textContent = reg.fullName || "-";
    document.getElementById("modalEmail").textContent = reg.email || "-";
    document.getElementById("modalPhone").textContent = reg.phone || "-";
    document.getElementById("modalCollege").textContent = reg.college || "-";
    document.getElementById("modalCourse").textContent = reg.course || "-";
    document.getElementById("modalDate").textContent = reg.createdAt ? new Date(reg.createdAt).toLocaleString("en-IN") : "2027";
    document.getElementById("modalTotalPaid").textContent = `₹${reg.totalAmount || 0}`;

    const tbody = document.getElementById("modalEventsTableBody");
    tbody.innerHTML = "";

    const events = Array.isArray(reg.events) && reg.events.length > 0 ? reg.events : [{ name: reg.event || "Event", price: reg.totalAmount || 0, date: "2027" }];

    events.forEach(ev => {
        tbody.innerHTML += `
            <tr>
                <td><strong>${escapeHtml(ev.name || ev)}</strong></td>
                <td>${escapeHtml(ev.date || "2027")}</td>
                <td style="text-align: right; font-weight: 600;">₹${ev.price || 0}</td>
            </tr>
        `;
    });

    modal.classList.add("active");
}

function closeInvoiceModal() {
    const modal = document.getElementById("invoiceModal");
    if (modal) modal.classList.remove("active");
}

async function deleteRegistration(id) {
    if (!confirm(`Are you sure you want to delete registration record ${id}?`)) return;

    try {
        const response = await fetch(`/registrations/${id}`, { method: "DELETE" });
        const result = await response.json();
        if (result.success) {
            allRegistrations = allRegistrations.filter(r => r.registrationId !== id && r._id !== id);
            renderAdminDashboard();
        } else {
            alert("Failed to delete record.");
        }
    } catch (err) {
        console.error("Delete error:", err);
        alert("Error connecting to server to delete.");
    }
}

function exportToCSV() {
    if (!allRegistrations || allRegistrations.length === 0) {
        alert("No registrations available to export.");
        return;
    }

    let csv = "Registration ID,Full Name,Email,Phone,College,Course,Registered Events,Total Amount (INR),Payment Status,Date\n";

    allRegistrations.forEach(r => {
        const regId = `"${r.registrationId || ''}"`;
        const name = `"${(r.fullName || '').replace(/"/g, '""')}"`;
        const email = `"${(r.email || '').replace(/"/g, '""')}"`;
        const phone = `"${(r.phone || '').replace(/"/g, '""')}"`;
        const college = `"${(r.college || '').replace(/"/g, '""')}"`;
        const course = `"${(r.course || '').replace(/"/g, '""')}"`;

        let evs = "";
        if (Array.isArray(r.events)) {
            evs = r.events.map(e => e.name || e).join(" | ");
        } else if (r.event) {
            evs = r.event;
        }
        const eventsField = `"${evs.replace(/"/g, '""')}"`;
        const total = r.totalAmount || 0;
        const status = `"${r.paymentStatus || 'Confirmed'}"`;
        const date = `"${r.createdAt ? new Date(r.createdAt).toISOString() : '2027'}"`;

        csv += `${regId},${name},${email},${phone},${college},${course},${eventsField},${total},${status},${date}\n`;
    });

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `CampusConnect_2027_Registrations_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

function escapeHtml(str) {
    if (!str) return "";
    return String(str)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

// Initialize on page load
document.addEventListener("DOMContentLoaded", () => {
    if (checkAdminAuth()) {
        loadAdminRegistrations();
    }
});