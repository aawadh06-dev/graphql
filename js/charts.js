function renderXpOverTimeChart(transactions) {
    const container = document.getElementById("graph-one");

    container.innerHTML = "";

    if (!transactions || transactions.length === 0) {
        container.textContent = "No XP data available.";
        return;
    }

    // Sort XP transactions from oldest to newest
    const sortedTransactions = [...transactions].sort(
        (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
    );

    // Build cumulative XP values
    let totalXp = 0;

    const points = sortedTransactions.map((transaction) => {
        totalXp += transaction.amount;

        return {
            date: new Date(transaction.createdAt),
            xp: totalXp
        };
    });

    const width = 800;
    const height = 400;

    const padding = {
        top: 40,
        right: 30,
        bottom: 60,
        left: 80
    };

    const chartWidth =
        width - padding.left - padding.right;

    const chartHeight =
        height - padding.top - padding.bottom;

    const maxXp = Math.max(...points.map((point) => point.xp));

    const svgNamespace =
        "http://www.w3.org/2000/svg";

    const svg = document.createElementNS(
        svgNamespace,
        "svg"
    );

    svg.setAttribute("viewBox", `0 0 ${width} ${height}`);
    svg.setAttribute("width", "100%");
    svg.setAttribute("height", height);


    // Chart title
    const title = document.createElementNS(
        svgNamespace,
        "text"
    );

    title.setAttribute("x", width / 2);
    title.setAttribute("y", 25);
    title.setAttribute("text-anchor", "middle");
    title.setAttribute("font-size", "20");

    title.textContent = "XP Earned Over Time";

    svg.appendChild(title);


    // X axis
    const xAxis = document.createElementNS(
        svgNamespace,
        "line"
    );

    xAxis.setAttribute("x1", padding.left);
    xAxis.setAttribute("y1", height - padding.bottom);
    xAxis.setAttribute("x2", width - padding.right);
    xAxis.setAttribute("y2", height - padding.bottom);
    xAxis.setAttribute("stroke", "currentColor");

    svg.appendChild(xAxis);


    // Y axis
    const yAxis = document.createElementNS(
        svgNamespace,
        "line"
    );

    yAxis.setAttribute("x1", padding.left);
    yAxis.setAttribute("y1", padding.top);
    yAxis.setAttribute("x2", padding.left);
    yAxis.setAttribute("y2", height - padding.bottom);
    yAxis.setAttribute("stroke", "currentColor");

    svg.appendChild(yAxis);


    // Convert XP data into SVG coordinates
    const svgPoints = points.map((point, index) => {
        const x =
            padding.left +
            (index / Math.max(points.length - 1, 1)) *
                chartWidth;

        const y =
            padding.top +
            chartHeight -
            (point.xp / maxXp) * chartHeight;

        return {
            x,
            y,
            xp: point.xp,
            date: point.date
        };
    });


    // Draw XP line
    const polyline = document.createElementNS(
        svgNamespace,
        "polyline"
    );

    polyline.setAttribute(
        "points",
        svgPoints
            .map((point) => `${point.x},${point.y}`)
            .join(" ")
    );

    polyline.setAttribute("fill", "none");
    polyline.setAttribute("stroke", "currentColor");
    polyline.setAttribute("stroke-width", "2");

    svg.appendChild(polyline);


    // Start date label
    const startDate = document.createElementNS(
        svgNamespace,
        "text"
    );

    startDate.setAttribute("x", padding.left);
    startDate.setAttribute("y", height - 25);
    startDate.setAttribute("font-size", "12");

    startDate.textContent =
        points[0].date.toLocaleDateString();

    svg.appendChild(startDate);


    // End date label
    const endDate = document.createElementNS(
        svgNamespace,
        "text"
    );

    endDate.setAttribute("x", width - padding.right);
    endDate.setAttribute("y", height - 25);
    endDate.setAttribute("text-anchor", "end");
    endDate.setAttribute("font-size", "12");

    endDate.textContent =
        points[points.length - 1].date.toLocaleDateString();

    svg.appendChild(endDate);


    // Maximum XP label
    const maxXpLabel = document.createElementNS(
        svgNamespace,
        "text"
    );

    maxXpLabel.setAttribute("x", padding.left - 10);
    maxXpLabel.setAttribute("y", padding.top + 5);
    maxXpLabel.setAttribute("text-anchor", "end");
    maxXpLabel.setAttribute("font-size", "12");

    maxXpLabel.textContent =
        `${maxXp.toLocaleString()} XP`;

    svg.appendChild(maxXpLabel);


    // Zero XP label
    const zeroLabel = document.createElementNS(
        svgNamespace,
        "text"
    );

    zeroLabel.setAttribute("x", padding.left - 10);
    zeroLabel.setAttribute(
        "y",
        height - padding.bottom + 5
    );

    zeroLabel.setAttribute("text-anchor", "end");
    zeroLabel.setAttribute("font-size", "12");

    zeroLabel.textContent = "0 XP";

    svg.appendChild(zeroLabel);

    container.appendChild(svg);
}
function renderPassFailChart(grades) {
    const container = document.getElementById("graph-two");

    container.innerHTML = "";

    if (!grades || grades.length === 0) {
        container.textContent = "No grade data available.";
        return;
    }

   const passCount = grades.filter(
    (item) => item.grade !== null && item.grade >= 1
).length;

const failCount = grades.filter(
    (item) => item.grade !== null && item.grade < 1
).length;

const ungradedCount = grades.filter(
    (item) => item.grade === null
).length;

const total = passCount + failCount;

    const passPercentage =
        ((passCount / total) * 100).toFixed(1);

    const failPercentage =
        ((failCount / total) * 100).toFixed(1);

    const width = 700;
    const height = 320;

    const svgNamespace =
        "http://www.w3.org/2000/svg";

    const svg = document.createElementNS(
        svgNamespace,
        "svg"
    );

    svg.setAttribute("viewBox", `0 0 ${width} ${height}`);
    svg.setAttribute("width", "100%");
    svg.setAttribute("height", height);


    // Title
    const title = document.createElementNS(
        svgNamespace,
        "text"
    );

    title.setAttribute("x", width / 2);
    title.setAttribute("y", 35);
    title.setAttribute("text-anchor", "middle");
    title.setAttribute("font-size", "20");

    title.textContent = "PASS vs FAIL";

    svg.appendChild(title);


    const maxCount = Math.max(passCount, failCount);

    const barStartX = 130;
    const maxBarWidth = 450;
    const barHeight = 55;


    // PASS label
    const passLabel = document.createElementNS(
        svgNamespace,
        "text"
    );

    passLabel.setAttribute("x", 30);
    passLabel.setAttribute("y", 115);
    passLabel.setAttribute("font-size", "16");

    passLabel.textContent = "PASS";

    svg.appendChild(passLabel);


    // PASS bar
    const passBar = document.createElementNS(
        svgNamespace,
        "rect"
    );

    const passWidth =
        (passCount / maxCount) * maxBarWidth;

    passBar.setAttribute("x", barStartX);
    passBar.setAttribute("y", 75);
    passBar.setAttribute("width", passWidth);
    passBar.setAttribute("height", barHeight);
    passBar.setAttribute("fill", "#2e7d32");

    svg.appendChild(passBar);


    // PASS value
    const passValue = document.createElementNS(
        svgNamespace,
        "text"
    );

    passValue.setAttribute("x", barStartX + 10);
    passValue.setAttribute("y", 108);
    passValue.setAttribute("fill", "white");
    passValue.setAttribute("font-size", "16");

    passValue.textContent =
        `${passCount} (${passPercentage}%)`;

    svg.appendChild(passValue);


    // FAIL label
    const failLabel = document.createElementNS(
        svgNamespace,
        "text"
    );

    failLabel.setAttribute("x", 30);
    failLabel.setAttribute("y", 215);
    failLabel.setAttribute("font-size", "16");

    failLabel.textContent = "FAIL";

    svg.appendChild(failLabel);


    // FAIL bar
    const failBar = document.createElementNS(
        svgNamespace,
        "rect"
    );

    const failWidth =
        (failCount / maxCount) * maxBarWidth;

    failBar.setAttribute("x", barStartX);
    failBar.setAttribute("y", 175);
    failBar.setAttribute("width", failWidth);
    failBar.setAttribute("height", barHeight);
    failBar.setAttribute("fill", "#c62828");

    svg.appendChild(failBar);


    // FAIL value
    const failValue = document.createElementNS(
        svgNamespace,
        "text"
    );

    failValue.setAttribute("x", barStartX + 10);
    failValue.setAttribute("y", 208);
    failValue.setAttribute("fill", "white");
    failValue.setAttribute("font-size", "16");

    failValue.textContent =
        `${failCount} (${failPercentage}%)`;

    svg.appendChild(failValue);


    // Total label
    const totalLabel = document.createElementNS(
        svgNamespace,
        "text"
    );

    totalLabel.setAttribute("x", width / 2);
    totalLabel.setAttribute("y", 285);
    totalLabel.setAttribute("text-anchor", "middle");
    totalLabel.setAttribute("font-size", "14");

    totalLabel.textContent =
    `Graded records: ${total} | Ungraded: ${ungradedCount}`;

    svg.appendChild(totalLabel);

    container.appendChild(svg);
}

function renderTopXpSourcesChart(transactions) {
    const container = document.getElementById("graph-three");

    container.innerHTML = "";

    if (!transactions || transactions.length === 0) {
        container.textContent = "No XP data available.";
        return;
    }

    // Group XP by path
    const xpByPath = {};

    transactions.forEach((transaction) => {
        if (!transaction.path) {
            return;
        }

        if (!xpByPath[transaction.path]) {
            xpByPath[transaction.path] = 0;
        }

        xpByPath[transaction.path] += transaction.amount;
    });

    // Convert object into array, sort highest XP first,
    // and keep only the top 5
    const topSources = Object.entries(xpByPath)
        .map(([path, xp]) => ({
            path,
            xp
        }))
        .sort((a, b) => b.xp - a.xp)
        .slice(0, 5);

    const width = 800;
    const height = 420;

    const svgNamespace =
        "http://www.w3.org/2000/svg";

    const svg = document.createElementNS(
        svgNamespace,
        "svg"
    );

    svg.setAttribute("viewBox", `0 0 ${width} ${height}`);
    svg.setAttribute("width", "100%");
    svg.setAttribute("height", height);

    // Title
    const title = document.createElementNS(
        svgNamespace,
        "text"
    );

    title.setAttribute("x", width / 2);
    title.setAttribute("y", 35);
    title.setAttribute("text-anchor", "middle");
    title.setAttribute("font-size", "20");

    title.textContent = "Top 5 XP Sources";

    svg.appendChild(title);

    const maxXp = Math.max(
        ...topSources.map((source) => source.xp)
    );

    const startX = 240;
    const maxBarWidth = 470;
    const barHeight = 40;
    const gap = 65;

    topSources.forEach((source, index) => {
        const y = 75 + index * gap;

        const shortName =
            source.path.split("/").filter(Boolean).pop();

        // Project/exercise label
        const label = document.createElementNS(
            svgNamespace,
            "text"
        );

        label.setAttribute("x", 20);
        label.setAttribute("y", y + 26);
        label.setAttribute("font-size", "14");

        label.textContent = shortName;

        svg.appendChild(label);

        // XP bar
        const bar = document.createElementNS(
            svgNamespace,
            "rect"
        );

        const barWidth =
            (source.xp / maxXp) * maxBarWidth;

        bar.setAttribute("x", startX);
        bar.setAttribute("y", y);
        bar.setAttribute("width", barWidth);
        bar.setAttribute("height", barHeight);
        bar.setAttribute("fill", "#2563eb");

        svg.appendChild(bar);

        // XP value
        const value = document.createElementNS(
            svgNamespace,
            "text"
        );

        value.setAttribute("x", startX + 10);
        value.setAttribute("y", y + 26);
        value.setAttribute("fill", "white");
        value.setAttribute("font-size", "14");

        value.textContent =
            `${source.xp.toLocaleString()} XP`;

        svg.appendChild(value);
    });

    container.appendChild(svg);
}