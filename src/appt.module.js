import apptEcosystem from './appt.ecosystem'
import Bootstrap from './appt.bootstrap';

export class ApptModuleEntity {      
   constructor(targetName, args){
      this.validArgs = ['import', 'declare', 'extend', 'timeout'];
      
      this.targetName = targetName;
      
      if(args){
            this.validateDecoratorArgs(args, () => {
                  this.args = args;
            });
      }
   }

   areValidArgs(args, validArgs, cb){            
      if(!args || Object.keys(args).length === 0)
         cb();
         
      const invalidArgs = Object.keys(args)
         .filter((arg, index) => {                              
               if(validArgs.indexOf(arg) === -1)
                     return arg;
         });
      
      if(invalidArgs.length === 1)
         cb(`The attribute '${invalidArgs}' in ${this.targetName} class is not valid for @Module decorator.`);
      else if(invalidArgs.length === 2)
         cb(`The attributes '${invalidArgs[0]} and ${invalidArgs[1]}' in ${this.targetName} class are not valid for @Module decorator.`);
      else if(invalidArgs.length > 2)
         cb(`The attributes '${invalidArgs.join(', ')}' in ${this.targetName} class are not valid for @Module decorator.`);
      else 
         cb();
   }
      
   validateDecoratorArgs(args, cb){
      try {
         return this.areValidArgs(args, this.validArgs, err => {
            if(err)
               throw new Error(err);                        

            cb()
         })
      } catch(ex) {
         console.log(ex);
         process.exit(0);
      }
   }

   resolveSync(argType, cb, index = 0){
      if(!(argType instanceof Array)){
         argType = [argType]
      }

      if(index < argType.length){
         const entity = argType[index];
         const ApptEntity = typeof entity === 'string'
            ? apptEcosystem.getEntity(entity, this.targetName) 
            : entity;

         const argPromise = new ApptEntity();
         
         return argPromise.then(() => this.resolveSync(argType, cb, ++index))
      } else {
            cb()
      }
   }

   importModules() {
      return new Promise(resolve => {                  
         if(this.args && this.args.import){
            return this.resolveSync(this.args.import, () => {            
               resolve()
            })
         } else {
            resolve()
         }
      })
      .catch(ex => console.log(ex));
   }   

   declareComponents() {
      return new Promise(resolve => {
         if(this.args && this.args.declare){
            return this.resolveSync(this.args.declare, () => {            
                  resolve()
            })
         } else {
            resolve()
         }
      })
      .catch(ex => console.log(ex));
   }
}

export default function ApptModule(decoratorArgs)  {      
   return function decorator(Target) {
      let preFn = decoratorArgs.pre || (cb => cb());

      preFn(() => {
         // only in first decorators called
         Bootstrap.run();

         return function(args){
               const apptModuleEntity = new ApptModuleEntity(Target.name, decoratorArgs);
               
               return apptModuleEntity
                  .importModules()
                     .then(() => apptModuleEntity.declareComponents())
                     .then(() => {               
                           if(decoratorArgs && decoratorArgs.extend){
                                 if(decoratorArgs.extend.target){
                                       return new decoratorArgs.extend.target(decoratorArgs.extend.args, Target)
                                 } else {
                                       const extender = decoratorArgs.extend();
                                       return new extender.target(null, Target)
                                 }
                           } else {
                                 return new Target();
                           } 
                     })
                     .catch(ex => console.log(ex))
               };
      });
   }
}

apptEcosystem.isReady().then(() => Bootstrap.initApp())