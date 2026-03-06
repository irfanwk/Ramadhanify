import './instrument'; // Must be imported first
import { app } from './app';
import { config } from './config/unifiedConfig';

const PORT = config.app.port || 4000;

const startServer = async () => {
    app.listen(PORT, () => {
        console.log(`🚀 Server running on port ${PORT} in ${config.app.env} mode.`);
    });
};

startServer().catch((error) => {
    console.error('Failed to start server:', error);
    process.exit(1);
});
