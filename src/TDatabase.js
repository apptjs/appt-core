export default class TDatabase {
   constructor(){}

   exec(extend, Target, injectables) {
        if(extend.use instanceof Array){
            extend.use = extend.use[0]
        }

        const driver = new extend.use();      
        
        return driver
            .exec(extend.config)
                .then(config => {
                    return new Target(config);

                    // if(injectables && injectables.lenght > 0)
                    //     return new Target(config, ...injectables)
                    // else 
                    //     return new Target(config)
                })
                .catch(ex => {
                    console.log(ex)
                });
   }
}