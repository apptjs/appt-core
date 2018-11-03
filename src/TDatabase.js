export default function TDatabase(driver, main = null, options = null) {
      return {
            target: ApptDatabase,
            args: {
                  driver: driver,
                  main: main,
                  options: options
            }
      };
}

class ApptDatabase {
   constructor(extenderParams, Target, injectables){
      return this.exec(extenderParams, Target, injectables)
   }

   exec(extenderParams, Target, injectables){
      const driver = new extenderParams.driver(extenderParams.main, extenderParams.options);
      
      return driver
         .exec()
            .then(config => {
               if(injectables && injectables.lenght > 0)
                  return new Target(...injectables, config)
               else 
                  return new Target(config)
            })
            .catch(ex => {
               console.log(ex)
            });
   }
}