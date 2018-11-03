import apptConfig from '../appt.config';

apptConfig.set(process.cwd(), process.env.NODE_ENV);

const config = apptConfig.getConfig();

module.exports = config.default || config;
