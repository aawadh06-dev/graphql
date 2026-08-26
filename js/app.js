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

        xpInfo.textContent = `Total XP: ${totalXp}`;

    } catch (error) {
        xpInfo.textContent = "Could not load XP.";
    }
}


// Display grade information
async function displayGrades() {
    const progressInfo = document.getElementById("progress-info");

    try {
        const grades = await getGrades();

        progressInfo.innerHTML = "";

        grades.forEach((item) => {
            const gradeItem = document.createElement("p");

            gradeItem.textContent =
                `Grade: ${item.grade} | Path: ${item.path}`;

            progressInfo.appendChild(gradeItem);
        });

    } catch (error) {
        progressInfo.textContent =
            "Could not load grade information.";
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