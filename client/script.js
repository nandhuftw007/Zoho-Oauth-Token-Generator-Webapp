document.addEventListener("DOMContentLoaded", function () {
    const tokenForm = document.getElementById("tokenForm");
    const resetButton = document.getElementById("reset_button");
    const tokenResult = document.getElementById("tokenResult");
    const errorMessage = document.getElementById("errorMessage");
    const clientIdInput = document.getElementById("client_id");
    const clientSecretInput = document.getElementById("client_secret");
    const datacenterInput = document.getElementById("datacenter"); // Added this line

    const storedClientId = localStorage.getItem("client_id");
    const storedClientSecret = localStorage.getItem("client_secret");

    if (storedClientId && storedClientSecret) {
        clientIdInput.value = storedClientId;
        clientSecretInput.value = storedClientSecret;
    }

    tokenForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const client_id = clientIdInput.value;
        const client_secret = clientSecretInput.value;
        const code = document.getElementById("code").value;
        const datacenter = datacenterInput.value; // Updated this line

        console.log("Selected Datacenter:", datacenter); // Add this line for debugging

        fetch("/server/oauthgenerator2_function/execute", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                client_id: client_id,
                client_secret: client_secret,
                code: code,
                datacenter: datacenter // Added this line
            }),
        })
        .then(response => response.json())
        .then(data => {
            console.log("Token Data:", data); // Add this line for debugging

            const tokenData = JSON.parse(data.output);
            displayTokenResult(tokenData);

            localStorage.setItem("client_id", client_id);
            localStorage.setItem("client_secret", client_secret);
        })
        .catch(error => {
            console.error("Fetch Error:", error); // Add this line for debugging
            errorMessage.innerText = "Error: Unable to connect to the server.";
        });
    });

    resetButton.addEventListener("click", function () {
        localStorage.removeItem("client_id");
        localStorage.removeItem("client_secret");
        clientIdInput.value = "";
        clientSecretInput.value = "";
        tokenResult.innerHTML = "";
        errorMessage.innerText = "";
    });

    function displayTokenResult(tokenData) {
        const htmlResult = `
            <div class="token-container">
                <label for="access_token">Access Token:</label>
                <textarea id="access_token" class="token-text" readonly>${tokenData.access_token}</textarea><br>
                <label for="refresh_token">Refresh Token:</label>
                <textarea id="refresh_token" class="token-text" readonly>${tokenData.refresh_token}</textarea><br>
                <label for="api_domain">API Domain:</label>
                <input type="text" id="api_domain" class="token-text" value="${tokenData.api_domain}" readonly><br>
                <label for="token_type">Token Type:</label>
                <input type="text" id="token_type" class="token-text" value="${tokenData.token_type}" readonly><br>
                <label for="expires_in">Expires In:</label>
                <input type="text" id="expires_in" class="token-text" value="${tokenData.expires_in}" readonly><br>
            </div>
        `;
        tokenResult.innerHTML = htmlResult;
    }
});
