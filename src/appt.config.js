const path = require('path');

class ApptConfig {
   constructor(){      
      this.config = {};
      this.glob = {};      
   }

   set(cwd, nodeEnv){
      try {
         const apptJson = require(path.resolve(cwd, 'appt.json'));         
         
         if(!apptJson)
            throw Error('Appt.json file is empty.');

         const environments = apptJson.environments || apptJson.environment;

         if(!environments || Object.keys(environments).length === 0)
            throw Error('There are no environments into your Appt.json file.');

         const customEnv = environments[nodeEnv] || {};
         const defaultEnv = environments["default"] || {};

         this.setGlob(defaultEnv, customEnv);
         this.setConfig(cwd, defaultEnv, customEnv);
         this.setAliases(cwd, apptJson.paths);

      } catch(ex) {
         throw Error(ex);
      }
   }

   getGlob(){      
      return this.glob;
   }

   getConfig(){
      return this.config;
   }

   setAliases(cwd, aliases){
      if(!aliases)
            return;

      const moduleAlias = require('module-alias')
      
      const normalizedAliases = Object.keys(aliases)
            .reduce((obj, key) => 
                  Object.assign(obj, { 
                        [key]: path.resolve(cwd, aliases[key])
                  })
            , {})

      moduleAlias.addAliases(normalizedAliases);      
   }

   setGlob(defaultEnv, customEnv){
      if(Object.keys(defaultEnv).length === 0 && Object.keys(customEnv).length === 0)
         throw Error('There is no environment exported nor a default env in your appt.json file.')

      if(!defaultEnv.include && !customEnv.include)
         throw Error('There is no glob include paths. Please provide it into your appt.json file.')
            
      this.glob = {
         include: customEnv.include || defaultEnv.include,
         exclude: customEnv.exclude || defaultEnv.exclude
      }

      if(typeof this.glob.include === 'string')
         this.glob.include = [this.glob.include];
      
      if(typeof this.glob.exclude === 'string')
         this.glob.exclude = [this.glob.exclude];
   }

   setConfig(cwd, defaultEnv, customEnv){
      let config = {
         default: {},
         custom: {}
      }

      if(defaultEnv.config && typeof defaultEnv.config === 'string')
         config.default = require(path.resolve(cwd, defaultEnv.config));
      else
         config.default = defaultEnv.config;

      if(customEnv.config && typeof customEnv.config === 'string')
         config.custom = require(path.resolve(cwd, customEnv.config));
      else
         config.custom = customEnv.config;

      this.config = Object.assign({}, config.default, config.custom);
   }
}

export default new ApptConfig();