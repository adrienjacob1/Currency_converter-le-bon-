const http = require("http");   // Ici on importe en faisant const 
const app = require("./app");

// Configurer un port valide pour le serveur

const normalizePort = val => {
    const port = parseInt(val, 10);

    if (isNaN(port)) {
        return val;
    }
    if (port >= 0) {
        return port;
    }
    return false;
}

const port = normalizePort(process.env.PORT || "8081");
app.set("port", port);


// Gérer les erreurs
const errorHandler = error => {
    if (error.syscall !== "listen") {
        throw error;
    }

    const address = server.address(); 
    const bind = typeof address === "string" ? "pipe" + address : "port" + port;

    switch (error.code) {
        case "EACCES":
            console.error(bind + "requires elevate privileges.");
            process.exit(1);
            break;
        case "EADDRINUSE":
            console.error(bind + "is already in use.");
            process.exit(1);
            break;
            

        default:
            throw error;
    }
};


// Ecouter les events

const server = http.createServer(app);
server.on ("error", errorHandler);
server.on("listening", () => {
    const address = server.address();
    const bind = typeof address === "string" ? "pipe" + address : "port" + port;
    console.log("Listening on " + bind);
});


server.listen(port);