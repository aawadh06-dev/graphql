async function updateView() {
    const loginView = document.getElementById("login-view");
    const profileView = document.getElementById("profile-view");

    if (isAuthenticated()) {
        loginView.hidden = true;
        profileView.hidden = false;

      await displayFilteredUser();
await displayNestedSummary();
await displayXp();
await displayGrades();

const xpTransactions = await getXpTransactions();
renderXpOverTimeChart(xpTransactions);
renderTopXpSourcesChart(xpTransactions);

const progressGrades = await getProgressGrades();
renderPassFailChart(progressGrades);


    } else {
        loginView.hidden = false;
        profileView.hidden = true;
    }
}


// Display basic user information
async function displayFilteredUser() {
    const userInfo = document.getElementById("user-info");

    try {
        const userId = getAuthenticatedUserId();
        const user = await getUserById(userId);

        userInfo.innerHTML = "";

        const fields = [
            `User ID: ${user.id}`,
            `Login: ${user.login}`,
            `First Name: ${user.attrs.firstName}`,
            `Last Name: ${user.attrs.lastName}`,
            `Country: ${user.attrs.country}`
        ];

        fields.forEach((text) => {
            const item = document.createElement("p");
            item.textContent = text;
            userInfo.appendChild(item);
        });

    } catch (error) {
        userInfo.textContent = "Could not load user information.";
    }
}


// Display one visible nested-query result
async function displayNestedSummary() {
    const userInfo = document.getElementById("user-info");

    try {
        const results = await getNestedResults();

        const resultWithUser = results.find(
            (result) => result.user !== null
        );

        if (!resultWithUser) {
            return;
        }

        const item = document.createElement("p");

        item.textContent =
            `Nested Result: ${resultWithUser.id} → ` +
            `${resultWithUser.user.login} (${resultWithUser.user.id})`;

        userInfo.appendChild(item);

    } catch (error) {
        console.error("Could not display nested query data:", error);
    }
}


// Display total XP
async function displayXp() {
    const xpInfo = document.getElementById("xp-info");

    try {
        const transactions = await getXpTransactions();

        const totalXp = transactions.reduce(
            (total, transaction) => total + transaction.amount,
            0
        );

        const totalKb = totalXp / 1000;

        xpInfo.textContent = `Total XP: ${totalKb.toFixed(2)} kB`;
    } catch (error) {
        xpInfo.textContent = error.message;
    }
}


// Display grade information
async function displayGrades() {
    const progressInfo = document.getElementById("progress-info");

    try {
        const grades = await getGrades();

        progressInfo.innerHTML = "";

        grades.forEach((item) => {
            const row = document.createElement("div");

            let result;

            if (item.grade === null) {
                result = "UNGRADED";
                row.classList.add("grade-ungraded");
            } else if (item.grade >= 1) {
                result = "PASS";
                row.classList.add("grade-pass");
            } else {
                result = "FAIL";
                row.classList.add("grade-fail");
            }

           const projectName = item.path.split("/").filter(Boolean).pop();

row.textContent = `${result} | Project: ${projectName}`;

            progressInfo.appendChild(row);
        });
    } catch (error) {
        progressInfo.textContent = error.message;
    }
}


document.addEventListener("DOMContentLoaded", () => {
    const logoutButton = document.getElementById("logout-button");

    updateView();

    logoutButton.addEventListener("click", () => {
        removeToken();
        updateView();
    });
});