import apptEcosystem from './appt.ecosystem'

export class ApptComponentEntity {
  constructor(args){
      this.args = args;
  }

  injectComponents(){
    return new Promise(resolve => {
      let injectables;
      
      if(this.args && this.args.inject){
        injectables = this.args.inject.map(injectable => {
          
          const ApptInjectable = apptEcosystem.getEntity(injectable);
          
          return new ApptInjectable();
        });        
      }

      if(injectables)
        resolve(Promise.all(injectables))
      else
        resolve()
      
    });
  }  
}

export default function ApptComponent(decoratorArgs)  {
  return function decorator(Target) {    
     return function(args){
        const apptComponent = new ApptComponentEntity(decoratorArgs);

        return apptComponent.injectComponents()          
            .then(injectables => {              
              if(decoratorArgs && decoratorArgs.extend){
                return new decoratorArgs.extend.type()
                  .exec(decoratorArgs.extend.config, decoratorArgs.extend.use, Target, injectables)
              } else {
                return new Target(...injectables)
              }
            })
            .catch(res => {
              return new Target()
            })
     };
  }
}