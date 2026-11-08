const test = require("node:test");
const assert = require("node:assert");
const app = require("../app");

async function startServer() {
    const server = app.listen(0);
    await new Promise(resolve => server.once("listening", resolve));
    const port = server.address().port;
    return {server, baseUrl: `http://localhost:${port}`};
}

test("Health returns healthy", async () => {const { server, baseUrl } = await startServer();

    try {
        const response = await fetch(`${baseUrl}/health`);
        const data = await response.json();
        assert.strictEqual(response.status, 200);
        assert.strictEqual(data.status, "healthy");
    } finally {
        await new Promise(resolve => server.close(resolve));
    }
});

test("API welcome", async () => {
    const { server, baseUrl } = await startServer();
    try {
        const response = await fetch(`${baseUrl}/api`);
        const data = await response.json();
        assert.strictEqual(response.status, 200);
        assert.strictEqual(data.message, "Cat API");
        assert.deepStrictEqual(data.endpoints, [
            "/api/cat",
            "/health"
        ]);
    } finally {
        await new Promise(resolve => server.close(resolve));
    }
});

test("Website loads", async () => {
    const { server, baseUrl } = await startServer();
    try {
        const response = await fetch(`${baseUrl}/`);
        const html = await response.text();
        assert.strictEqual(response.status, 200);
        assert.ok(html.includes("Purrfect Picture"));
        assert.ok(html.includes("generateCat"));
    } finally {
        await new Promise(resolve => server.close(resolve));
    }
});
