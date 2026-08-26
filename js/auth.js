const JWT_STORAGE_KEY = "jwt";

const SIGNIN_ENDPOINT =
    "https://learn.reboot01.com/api/auth/signin";


// Save JWT in the browser
function saveToken(token) {
    localStorage.setItem(JWT_STORAGE_KEY, token);
}


// Get saved JWT
function getToken() {
    return localStorage.getItem(JWT_STORAGE_KEY);
}


// Remove JWT
function removeToken() {
    localStorage.removeItem(JWT_STORAGE_KEY);
}


// Check if the user has a JWT
function isAuthenticated() {
    return Boolean(getToken());
}


// Decode the payload section of a JWT
function decodeJwtPayload(token) {
    const parts = token.split(".");

    if (parts.length !== 3) {
        throw new Error("Invalid JWT.");
    }

    const base64Url = parts[1];

    const base64 = base64Url
        .replace(/-/g, "+")
        .replace(/_/g, "/");

    const paddedBase64 = base64.padEnd(
        base64.length + (4 - (base64.length % 4)) % 4,
        "="
    );

    const decoded = atob(paddedBase64);

    const bytes = Uint8Array.from(
        decoded,
        (char) => char.charCodeAt(0)
    );

    return JSON.parse(
        new TextDecoder().decode(bytes)
    );
}


// Get authenticated user's ID from JWT
function getAuthenticatedUserId() {
    const token = getToken();

    if (!token) {
        return null;
    }

    const payload = decodeJwtPayload(token);

    const hasuraClaims =
        payload["https://hasura.io/jwt/claims"];

    return (
        hasuraClaims?.["x-hasura-user-id"] ??
        payload.userId ??
        payload.id ??
        payload.sub ??
        null
    );
}


// Send username/email + password to Reboot
async function signin(identifier, password) {
    const credentials =
        btoa(`${identifier}:${password}`);

    const response = await fetch(
        SIGNIN_ENDPOINT,
        {
            method: "POST",
            headers: {
                Authorization:
                    `Basic ${credentials}`
            }
        }
    );

    if (!response.ok) {
        throw new Error(
            "Invalid username/email or password."
        );
    }

    return await response.json();
}


// Handle login form
document.addEventListener(
    "DOMContentLoaded",
    () => {
        const loginForm =
            document.getElementById("login-form");

        const loginError =
            document.getElementById("login-error");

        const loginButton =
            loginForm.querySelector(
                'button[type="submit"]'
            );

        loginForm.addEventListener(
            "submit",
            async (event) => {
                event.preventDefault();

                loginError.textContent = "";

                const identifier =
                    document
                        .getElementById("identifier")
                        .value
                        .trim();

                const password =
                    document
                        .getElementById("password")
                        .value;

                // Show loading feedback
                loginButton.disabled = true;
                loginButton.textContent =
                    "Signing in...";

                try {
                    const token =
                        await signin(
                            identifier,
                            password
                        );

                    saveToken(token);

                    loginForm.reset();

                    updateView();

                } catch (error) {
                    loginError.textContent =
                        error.message;

                } finally {
                    loginButton.disabled = false;
                    loginButton.textContent =
                        "Login";
                }
            }
        );
    }
);