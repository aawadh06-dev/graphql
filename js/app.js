async function updateView() {
    const loginView = document.getElementById("login-view");
    const profileView = document.getElementById("profile-view");

    if (isAuthenticated()) {
        loginView.style.display = "none";
        profileView.style.display = "block";

        await displayFilteredUser();
        await displayNestedSummary();
        await displayXp();
        await displayGrades();

        // XP graphs
        const xpTransactions = await getXpTransactions();

        renderXpOverTimeChart(xpTransactions);
        renderTopXpSourcesChart(xpTransactions);

        // PASS / FAIL graph
        const progressGrades = await getProgressGrades();

        renderPassFailChart(progressGrades);
    } else {
        loginView.style.display = "block";
        profileView.style.display = "none";
    }
}


// Display user information
async function displayFilteredUser() {
    const userInfo = document.getElementById("user-info");

    try {
        const userId = getAuthenticatedUserId();

        if (!userId) {
            throw new Error("Could not find authenticated user ID.");
        }

        const user = await getUserById(userId);

        if (!user) {
            throw new Error("User information not found.");
        }

        const firstName = user.attrs?.firstName || "Not available";
        const lastName = user.attrs?.lastName || "Not available";
        const country = user.attrs?.country || "Not available";

        userInfo.innerHTML = `
            <div>User ID: ${user.id}</div>
            <div>Login: ${user.login}</div>
            <div>First Name: ${firstName}</div>
            <div>Last Name: ${lastName}</div>
            <div>Country: ${country}</div>
            <div id="nested-summary">Loading nested query...</div>
        `;
    } catch (error) {
        userInfo.textContent = error.message;
    }
}


// Display result from nested GraphQL query
async function displayNestedSummary() {
    const nestedSummary =
        document.getElementById("nested-summary");

    if (!nestedSummary) {
        return;
    }

    try {
        const results = await getNestedResults();

        const validResult = results.find(
            (result) => result.user !== null
        );

        if (!validResult) {
            nestedSummary.textContent =
                "Nested Result: No user result available.";
            return;
        }

        nestedSummary.textContent =
            `Nested Result: ${validResult.id} → ` +
            `${validResult.user.login} (${validResult.user.id})`;
    } catch (error) {
        nestedSummary.textContent =
            `Nested query error: ${error.message}`;
    }
}


// Display total XP in kB
async function displayXp() {
    const xpInfo = document.getElementById("xp-info");

    try {
        const transactions = await getXpTransactions();

        const totalXp = transactions.reduce(
            (total, transaction) =>
                total + (Number(transaction.amount) || 0),
            0
        );

        const totalKb = totalXp / 1000;

        xpInfo.textContent =
            `Total XP: ${totalKb.toFixed(2)} kB`;
    } catch (error) {
        xpInfo.textContent = error.message;
    }
}


// Display only completed module projects
async function displayGrades() {
    const progressInfo =
        document.getElementById("progress-info");

    try {
        const grades = await getGrades();

        progressInfo.innerHTML = "";

        const projectGrades = grades.filter((item) => {
            if (!item.path) {
                return false;
            }

            const parts =
                item.path.split("/").filter(Boolean);

          return (
    parts.length === 3 &&
    item.grade !== null &&
    item.path !== "/bahrain/bh-module/piscine-js" &&
    item.path !== "/bahrain/bh-module/checkpoint"
);
        });

        if (projectGrades.length === 0) {
            progressInfo.textContent =
                "No completed projects found.";
            return;
        }

        projectGrades.forEach((item) => {
            const row = document.createElement("div");

            let result;

            if (item.grade >= 1) {
                result = "PASS";
                row.classList.add("grade-pass");
            } else {
                result = "FAIL";
                row.classList.add("grade-fail");
            }

            const projectName =
                item.path
                    .split("/")
                    .filter(Boolean)
                    .pop();

            row.textContent =
                `${result} | Project: ${projectName}`;

            progressInfo.appendChild(row);
        });
    } catch (error) {
        progressInfo.textContent = error.message;
    }
}


// Run when page loads
document.addEventListener("DOMContentLoaded", () => {
    updateView();

    const logoutButton =
        document.getElementById("logout-button");

    if (logoutButton) {
        logoutButton.addEventListener("click", () => {
            removeToken();
            updateView();
        });
    }
});