import apptEcosystem from './appt.ecosystem';
import apptConfig from './appt.config';

var booted = false;

class Bootstrap {
   constructor(){}

   module(mainModule) {
      /** fix multi-bootable applications */
      if(!booted){
         booted = true
         
         apptConfig.set(process.cwd(), process.env.NODE_ENV);

         const glob = apptConfig.getGlob();

         apptEcosystem.bootFiles(glob.include, glob.exclude);
         
         const ApptModule = typeof mainModule === 'string' 
            ? apptEcosystem.getEntity(mainModule, 'your application\'s entrypoint')
            : mainModule;
         
         new ApptModule();      
      }
   }
}

export default new Bootstrap();