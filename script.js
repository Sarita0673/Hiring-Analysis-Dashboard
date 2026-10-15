
/*
  Illustrative sample data for the dashboard.
  Replace this array with verified records from your CSV.
*/

const jobs = [
    {id:"J001",role:"Data Analyst Intern",company:"Demo Company A",skills:["Python","SQL","Excel"],stipend:10000,mode:"Remote",location:"Pune",technology:["Python","Power BI"]},
    {id:"J002",role:"Python Intern",company:"Demo Company B",skills:["Python","SQL","Pandas"],stipend:8000,mode:"Hybrid",location:"Mumbai",technology:["Python"]},
    {id:"J003",role:"Java Developer Intern",company:"Demo Company C",skills:["Java","SQL","Git"],stipend:12000,mode:"On-site",location:"Pune",technology:["Java","MySQL"]},
    {id:"J004",role:"Web Developer Intern",company:"Demo Company D",skills:["HTML","CSS","JavaScript"],stipend:null,mode:"Remote",location:"Bengaluru",technology:["HTML","CSS","JavaScript"]},
    {id:"J005",role:"ML Intern",company:"Demo Company E",skills:["Python","Machine Learning","Pandas"],stipend:15000,mode:"Hybrid",location:"Bengaluru",technology:["Python","Machine Learning"]},
    {id:"J006",role:"Data Analyst Intern",company:"Demo Company F",skills:["Python","SQL","Power BI"],stipend:10000,mode:"On-site",location:"Mumbai",technology:["SQL","Power BI"]},
    {id:"J007",role:"Python Intern",company:"Demo Company G",skills:["Python","Pandas","NumPy"],stipend:9000,mode:"Remote",location:"Pune",technology:["Python","NumPy"]},
    {id:"J008",role:"Java Developer Intern",company:"Demo Company H",skills:["Java","SQL","Git"],stipend:null,mode:"Hybrid",location:"Hyderabad",technology:["Java","MySQL"]},
    {id:"J009",role:"Web Developer Intern",company:"Demo Company I",skills:["HTML","CSS","JavaScript"],stipend:7000,mode:"On-site",location:"Mumbai",technology:["HTML","JavaScript"]},
    {id:"J010",role:"Data Analyst Intern",company:"Demo Company J",skills:["SQL","Excel","Power BI"],stipend:11000,mode:"Remote",location:"Hyderabad",technology:["SQL","Power BI"]},
    {id:"J011",role:"Python Intern",company:"Demo Company A",skills:["Python","SQL","NumPy"],stipend:8500,mode:"Hybrid",location:"Bengaluru",technology:["Python","NumPy"]},
    {id:"J012",role:"ML Intern",company:"Demo Company B",skills:["Python","Machine Learning","SQL"],stipend:16000,mode:"On-site",location:"Pune",technology:["Python","Machine Learning"]}
];

const chartInstances = {};

function uniqueSorted(values) {
    return [...new Set(values)].sort();
}

function fillFilter(id, values) {
    const select = document.getElementById(id);

    uniqueSorted(values).forEach(value => {
        const option = document.createElement("option");
        option.value = value;
        option.textContent = value;
        select.appendChild(option);
    });
}

fillFilter("roleFilter", jobs.map(j => j.role));
fillFilter("locationFilter", jobs.map(j => j.location));

function filteredJobs() {
    const mode = document.getElementById("modeFilter").value;
    const role = document.getElementById("roleFilter").value;
    const location = document.getElementById("locationFilter").value;
    const search = document.getElementById("searchInput")
        .value.trim().toLowerCase();

    return jobs.filter(job =>
        (mode === "All" || job.mode === mode) &&
        (role === "All" || job.role === role) &&
        (location === "All" || job.location === location) &&
        (
            job.company.toLowerCase().includes(search) ||
            job.role.toLowerCase().includes(search) ||
            job.skills.join(" ").toLowerCase().includes(search)
        )
    );
}

function countBy(items, keyFunction) {
    const counts = {};

    items.forEach(item => {
        const key = keyFunction(item);
        counts[key] = (counts[key] || 0) + 1;
    });

    return Object.entries(counts).sort((a, b) => b[1] - a[1]);
}

function renderChart(id, type, labels, values, color, label) {
    if (chartInstances[id]) {
        chartInstances[id].destroy();
    }

    chartInstances[id] = new Chart(document.getElementById(id), {
        type,
        data: {
            labels,
            datasets: [{
                label,
                data: values,
                backgroundColor: color,
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: type === "doughnut" || type === "pie",
                    position: "bottom"
                }
            },
            scales: type === "doughnut" || type === "pie"
                ? {}
                : {
                    y: {
                        beginAtZero: true,
                        ticks: {precision: 0}
                    }
                }
        }
    });
}

function updateDashboard() {
    const data = filteredJobs();
    const total = data.length;

    const companies = new Set(data.map(j => j.company)).size;
    const roles = new Set(data.map(j => j.role)).size;
    const locations = new Set(data.map(j => j.location)).size;
    const withStipend = data.filter(j =>
        typeof j.stipend === "number" && Number.isFinite(j.stipend)
    ).length;
    const remote = data.filter(j => j.mode === "Remote").length;

    document.getElementById("totalJobs").textContent = total;
    document.getElementById("totalCompanies").textContent = companies;
    document.getElementById("totalRoles").textContent = roles;
    document.getElementById("totalLocations").textContent = locations;

    document.getElementById("stipendRate").textContent =
        total ? Math.round(withStipend / total * 100) + "%" : "0%";
    document.getElementById("stipendDetail").textContent =
        `${withStipend} of ${total} listings`;

    document.getElementById("remoteRate").textContent =
        total ? Math.round(remote / total * 100) + "%" : "0%";
    document.getElementById("remoteDetail").textContent =
        `${remote} of ${total} listings`;

    const roleCounts = countBy(data, j => j.role);
    renderChart(
        "roleChart", "bar",
        roleCounts.map(x => x[0]),
        roleCounts.map(x => x[1]),
        "#4776e6", "Listings"
    );

    const modeCounts = countBy(data, j => j.mode);
    renderChart(
        "modeChart", "doughnut",
        modeCounts.map(x => x[0]),
        modeCounts.map(x => x[1]),
        ["#4776e6", "#26a69a", "#f5a623"], "Listings"
    );

    const skills = countBy(
        data.flatMap(j => j.skills),
        skill => skill
    ).slice(0, 10);

    renderChart(
        "skillsChart", "bar",
        skills.map(x => x[0]),
        skills.map(x => x[1]),
        "#8b5cf6", "Skill mentions"
    );

    const locationCounts = countBy(data, j => j.location);
    renderChart(
        "locationChart", "bar",
        locationCounts.map(x => x[0]),
        locationCounts.map(x => x[1]),
        "#0d9488", "Listings"
    );

    const stipendCounts = [
        ["Stipend stated", withStipend],
        ["Not stated", total - withStipend]
    ];

    renderChart(
        "stipendChart", "doughnut",
        stipendCounts.map(x => x[0]),
        stipendCounts.map(x => x[1]),
        ["#16a34a", "#cbd5e1"], "Listings"
    );

    const technologyCounts = countBy(
        data.flatMap(j => j.technology),
        technology => technology
    ).slice(0, 10);

    renderChart(
        "technologyChart", "bar",
        technologyCounts.map(x => x[0]),
        technologyCounts.map(x => x[1]),
        "#f59e0b", "Technology mentions"
    );

    const table = document.getElementById("jobTable");
    table.replaceChildren();

    data.forEach(job => {
        const row = document.createElement("tr");
        const stipendText = job.stipend == null
            ? "Not mentioned"
            : "₹" + job.stipend.toLocaleString("en-IN");

        [
            job.id,
            job.role,
            job.company,
            job.skills.join(", "),
            stipendText,
            job.mode,
            job.location
        ].forEach(value => {
            const cell = document.createElement("td");
            cell.textContent = value;
            row.appendChild(cell);
        });

        table.appendChild(row);
    });

    document.getElementById("noResults").hidden = data.length !== 0;
}

function resetFilters() {
    document.getElementById("modeFilter").value = "All";
    document.getElementById("roleFilter").value = "All";
    document.getElementById("locationFilter").value = "All";
    document.getElementById("searchInput").value = "";
    updateDashboard();
}

["modeFilter", "roleFilter", "locationFilter"].forEach(id => {
    document.getElementById(id).addEventListener("change", updateDashboard);
});

document.getElementById("searchInput")
    .addEventListener("input", updateDashboard);

updateDashboard();
