const GRAPHQL_ENDPOINT =
    "https://learn.reboot01.com/api/graphql-engine/v1/graphql";


// Send any GraphQL query using the logged-in user's JWT
async function graphqlRequest(query, variables = {}) {
    const token = getToken();

    if (!token) {
        throw new Error("You must be logged in.");
    }

    const response = await fetch(GRAPHQL_ENDPOINT, {
        method: "POST",

        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        },

        body: JSON.stringify({
            query,
            variables
        })
    });

    if (!response.ok) {
        throw new Error("GraphQL request failed.");
    }

    const result = await response.json();

    if (result.errors) {
        throw new Error(result.errors[0].message);
    }

    return result.data;
}


// Normal query
async function getBasicUser() {
    const query = `
        {
            user {
                id
                login
            }
        }
    `;

    const data = await graphqlRequest(query);

    return data.user[0];
}


// Nested query
async function getNestedResults() {
    const query = `
        {
            result(limit: 5) {
                id
                user {
                    id
                    login
                }
            }
        }
    `;

    const data = await graphqlRequest(query);

    return data.result;
}


// Query with arguments
async function getUserById(userId) {
    const query = `
        query GetUserById($userId: Int!) {
            user(where: { id: { _eq: $userId } }) {
                id
                login
                attrs
            }
        }
    `;

    const variables = {
        userId: Number(userId)
    };

    const data = await graphqlRequest(query, variables);

    return data.user[0];
}

// Get all XP transactions
async function getXpTransactions() {
    const query = `
        {
            transaction(
                where: { type: { _eq: "xp" } }
            ) {
                amount
                path
                createdAt
            }
        }
    `;

    const data = await graphqlRequest(query);

    return data.transaction;
}

// Get grade/progress data
async function getGrades() {
    const query = `
        {
            progress(limit: 10) {
                grade
                path
            }
        }
    `;

    const data = await graphqlRequest(query);

    return data.progress;
}
// Get all progress grades for the PASS/FAIL graph
async function getProgressGrades() {
    const query = `
        {
            progress {
                grade
            }
        }
    `;

    const data = await graphqlRequest(query);

    return data.progress;
}