import { createLogger, type PluginOption, type ViteDevServer } from "vite";
import type { IncomingMessage } from "node:http";

const originPlaceholder = "__VITE_AUTO_ORIGIN__";
let requestOrigin = "";

function detectProtocol(req: IncomingMessage, server: ViteDevServer): string {
    if (req.headers["x-forwarded-proto"]) {
        const proto =
            typeof req.headers["x-forwarded-proto"] === "string"
                ? req.headers["x-forwarded-proto"]
                      .split(",")
                      .map((item) => item.trim())
                : req.headers["x-forwarded-proto"];
        return proto[0] ?? "";
    }
    if (req.headers["x-forwarded-ssl"]) {
        return req.headers["x-forwarded-ssl"] === "on" ? "https" : "http";
    }
    return server.config.server.https ? "https" : "http";
}

function detectHost(req: IncomingMessage): string {
    if (req.headers["x-forwarded-host"]) {
        const host =
            typeof req.headers["x-forwarded-host"] === "string"
                ? req.headers["x-forwarded-host"]
                      .split(",")
                      .map((item) => item.trim())
                : req.headers["x-forwarded-host"];
        return host[0] ?? "";
    }
    return req.headers.host || "localhost";
}

function replaceAll(find: string, replace: string, subject: string): string {
    return subject.split(find).join(replace);
}

function configureServer(server: ViteDevServer): void {
    const logger = createLogger("info", { prefix: "[plugin-auto-origin]" });

    server.middlewares.use((req, _res, next) => {
        const prevRequestOrigin = requestOrigin;
        requestOrigin = detectProtocol(req, server) + "://" + detectHost(req);

        if (prevRequestOrigin !== requestOrigin) {
            logger.info(`Origin auto-detected: ${requestOrigin}`, {
                timestamp: true,
            });
        }

        next();
    });
}

function transform(code: string): string {
    return replaceAll(originPlaceholder, requestOrigin, code);
}

export default function autoOrigin(): PluginOption {
    return {
        name: "vite-plugin-auto-origin",
        apply: "serve",
        config: () => ({
            server: {
                origin: originPlaceholder,
            },
        }),
        configureServer,
        transform,
    };
}
