import apptEcosystem from './appt.ecosystem'

// var booted = false;

class Bootstrap {
   constructor(){}

   module(mainModule) {
      /** fix multibootable applications */
      // if(!booted){
      //    booted = true
         
         const config = require(process.cwd() + '/appt.json');
         
         apptEcosystem.bootFiles(config.include, config.exclude);
         
         const ApptModule = typeof mainModule === 'string' 
            ? apptEcosystem.getEntity(mainModule, 'your application\'s entrypoint')
            : mainModule;
         
         new ApptModule();      
      // }
   }
}

export default new Bootstrap();