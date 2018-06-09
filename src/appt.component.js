import apptEcosystem from './appt.ecosystem'

export class ApptComponentEntity {
  constructor(targetName, args){
    this.validArgs = ['inject', 'extend'];
    this.extendValidArgs = ['type', 'config', 'use'];
    this.targetName = targetName;

    this.validateDecoratorArgs(args, () => {
      this.args = args;
    });
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
      cb(`The attribute '${invalidArgs}' in ${this.targetName} class is not valid for @Component decorator.`);
    else if(invalidArgs.length === 2)
      cb(`The attributes '${invalidArgs[0]} and ${invalidArgs[1]}' in ${this.targetName} class are not valid for @Component decorator.`);
    else if(invalidArgs.length > 2)
      cb(`The attributes '${invalidArgs.join(', ')}' in ${this.targetName} class are not valid for @Component decorator.`);
    else 
      cb();
  }

  validateDecoratorArgs(args, cb){
    try {
          return this.areValidArgs(args, this.validArgs, err => {
                if(err)
                      throw new Error(err);                        

                if(args.extend)
                      this.validateExtendArgs(args.extend);

                cb()
          })
    } catch(ex) {
          console.log(ex);
          process.exit(0);
    }
  }

  validateExtendArgs(extendArgs){    
    this.areValidArgs(extendArgs, this.extendValidArgs, err => {
      if(err)
        throw new Error(err);
    })
  }

  injectComponents(){
    return new Promise(resolve => {
      let injectables;
      
      if(this.args && this.args.inject){
        if(!(this.args.inject instanceof Array)){
          this.args.inject = [this.args.inject]
        }

        injectables = this.args.inject.map(injectable => {
          const ApptInjectable = typeof injectable === 'string'
                ? apptEcosystem.getEntity(injectable, this.targetName) 
                : injectable;

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
        const apptComponent = new ApptComponentEntity(Target.name, decoratorArgs);

        return apptComponent.injectComponents()          
            .then(injectables => {
              if(decoratorArgs && decoratorArgs.extend){
                return new decoratorArgs.extend.type()
                  .exec(decoratorArgs.extend, Target, injectables)
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