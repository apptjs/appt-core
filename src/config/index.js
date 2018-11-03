import apptConfig from '../appt.config';

apptConfig.set(process.cwd(), process.env.NODE_ENV);

module.exports = apptConfig.getConfig().default;
