import apptEcosystem from './appt.ecosystem'

class Bootstrap {
   constructor(){}

   module(mainModule) {
      
      const config = require(process.cwd() + '/appt.json');
        
      apptEcosystem.bootFiles(config.include, config.exclude);
      
      const ApptModule = typeof mainModule === 'string' 
         ? apptEcosystem.getEntity(mainModule, 'your application\'s entrypoint')
         : mainModule;
      
      new ApptModule();
   }
}

export default new Bootstrap();