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

    if (total === 0) {
        container.textContent = "No graded progress data available.";
        return;
    }

    const passPercentage = ((passCount / total) * 100).toFixed(1);
    const failPercentage = ((failCount / total) * 100).toFixed(1);

    const radius = 90;
    const circumference = 2 * Math.PI * radius;

    const passLength = (passCount / total) * circumference;
    const failLength = (failCount / total) * circumference;

    container.innerHTML = `
        <svg viewBox="0 0 420 420" width="100%" height="420">
            <text x="210" y="40" text-anchor="middle" font-size="20" fill="white">
                PASS vs FAIL
            </text>

            <circle
                cx="160"
                cy="190"
                r="${radius}"
                fill="none"
                stroke="#1f2a44"
                stroke-width="36"
            ></circle>

            <circle
                cx="160"
                cy="190"
                r="${radius}"
                fill="none"
                stroke="#2e7d32"
                stroke-width="36"
                stroke-dasharray="${passLength} ${circumference - passLength}"
                stroke-dashoffset="0"
                transform="rotate(-90 160 190)"
            ></circle>

            <circle
                cx="160"
                cy="190"
                r="${radius}"
                fill="none"
                stroke="#c62828"
                stroke-width="36"
                stroke-dasharray="${failLength} ${circumference - failLength}"
                stroke-dashoffset="${-passLength}"
                transform="rotate(-90 160 190)"
            ></circle>

            <text x="160" y="183" text-anchor="middle" font-size="20" fill="white">
                ${total}
            </text>

            <text x="160" y="208" text-anchor="middle" font-size="14" fill="#cbd5e1">
                Graded
            </text>

            <rect x="285" y="140" width="18" height="18" rx="3" fill="#2e7d32"></rect>
            <text x="312" y="154" font-size="15" fill="white">
                PASS: ${passCount} (${passPercentage}%)
            </text>

            <rect x="285" y="180" width="18" height="18" rx="3" fill="#c62828"></rect>
            <text x="312" y="194" font-size="15" fill="white">
                FAIL: ${failCount} (${failPercentage}%)
            </text>

            <text x="210" y="330" text-anchor="middle" font-size="14" fill="#cbd5e1">
                Ungraded records: ${ungradedCount}
            </text>
        </svg>
    `;
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