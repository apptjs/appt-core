import apptEcosystem from './appt.ecosystem';
import apptConfig from './appt.config';

var booted = false;

class Bootstrap {
   constructor(){
      this.target = {}
   }

   module(Target) {
      /** only boot the first module called */
      if(!booted){
         booted = true
         
         apptConfig.set(process.cwd(), process.env.NODE_ENV);

         const glob = apptConfig.getGlob();
         
         apptEcosystem.bootFiles(glob.include, glob.exclude);

         this.target = Target;
      }
   }

   run(){
      const main = apptEcosystem.getEntity(this.target.name)
      new main();
   }
}

export default new Bootstrap();