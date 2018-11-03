import { get } from "require-files";
import EventEmitter from "events";

class ApptEcosystem {
   constructor(){
      this.boot = new EventEmitter();
   }

   bootFiles(include, exclude){
      get(include, exclude)
        .forEach(path => {           
          require(path.replace('.ts', ''))
        });
      
      this.boot.emit('ready');
   }

   getEntity(entityName, targetName){
      try {        
         return module.children
          .find(entity => entity.exports[entityName] != null)
            .exports[entityName];
      } catch(ex) {
        console.log(`Entity ${entityName} in ${targetName} class was not found. Check if you has exported or typed it right.`)
        process.exit(0);
      }
   }

   isReady(){
      return new Promise(resolve => {
         this.boot.on('ready', () => {
            resolve()
         })
      })      
   }
}

export default new ApptEcosystem();