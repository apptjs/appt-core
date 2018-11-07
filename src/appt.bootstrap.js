import apptEcosystem from './appt.ecosystem';
import apptConfig from './appt.config';

var booted = false;

class Bootstrap {
   constructor(){
      this.target = {}
   }

   run() {
      /** only boot the first module called */
      if(!booted){
         booted = true
         
         apptConfig.set(process.cwd(), process.env.NODE_ENV);

         const glob = apptConfig.getGlob();
         
         apptEcosystem.bootFiles(glob.include, glob.exclude);
      }
   }

   initApp(){
      const main = apptEcosystem.getEntity(Object.keys(require.main.exports)[0])
      new main();
   }
}

export default new Bootstrap();