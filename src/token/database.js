const production = typeof process.env.KUBERNETES_SERVICE_HOST !== "undefined";


if (production) {} else {}