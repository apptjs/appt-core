import apptEcosystem from './appt.ecosystem'

class ApptBootstrap {
   constructor(){}

   module(mainModule) {  
      const config = require(process.cwd() + '/appt.json');
        
      apptEcosystem.bootFiles(config.include, config.exclude);
      
      const ApptModule = apptEcosystem.getEntity(mainModule);
      
      new ApptModule();
   }
}

export default new ApptBootstrap();