const loggingMiddleware = (db) =>
    async (req, res, next) => {
        const ip = (req.headers['x-forwarded-for'] || req.connection.remoteAddress || '').split(',')[0].trim();
        const headers = JSON.stringify(req.headers);
        const originalUrl = req.originalUrl;

        await db.logging.create(
            {
                action: originalUrl,
                header: headers,
                ip: ip
            }
        );

        next();
    }

module.exports = loggingMiddleware;