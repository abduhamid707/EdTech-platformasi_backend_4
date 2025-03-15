const errorMiddleware = (err, req, res, next) => {
    console.error(err);

    if (err instanceof SyntaxError) {
        return res.status(400).json({ error: "Yaroqsiz so'rovnoma" });
    } else if (err.status) {
        return res.status(err.status).json({ error: err.message });
    } else {
        return res.status(500).json({ error: "Server xatosi" });
    }
};

export default errorMiddleware;
