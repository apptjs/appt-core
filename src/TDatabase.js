export default class TDatabase {
   constructor(){}

   exec(args, usable, Target, injectables) {     
      const driver = new usable[0]();      
      
      return driver
         .exec(args)
            .then(config => {
               return new Target(config)
            })
            .catch(ex => {
                console.log(ex)
            });
   }
}