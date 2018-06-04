
# @appt/core
This package is the main dependency of the framework. With it, you can start your NodeJs application and scale it on a *non-intrusive/non-imperative* way by maintaining everything over a **Dependency Injection Pattern** working together with a **Module/Component** abstraction provided by Appt.
 > **EVERYTHING** on Appt's concept is about to build applications over the perception of **Modules** and **Components**
 
We assume you got here after seeing the [Appt's Main Page](https://github.com/brab0/appt). If you don't, **we strongly recommend** you to step back an take a 5 minutes reading to get used with some key concepts we're going to apply here.


## Install
    $ npm install @appt/core --save

 
## Resources
The `@appt/core` export some resources which can be imported as seen below:
```javascript
import {
	ApptModule,
	ApptComponent,
	ApptBootstrap,
	TDatabase
} from '@appt/core';
```
### ApptBootstrap
This is a class which can be used to things related to the application bootstrap. For now, the only method exported is `module()`, which of course, is responsible only for import the application's main module.
```javascript
import { ApptModule, ApptBootstrap } from '@appt/core';

@ApptModule()
export class AppMain(){}

ApptBootstrap.module('AppMain');
```

### @ApptModule
It is a class decorator responsible for *call other modules and glue components together*, creating the whole application's tree. 

Every NodeJs application has one starter point. Using Appt, every starter point is an @ApptModule and every group of components can be part of it.

An `@ApptModule` has the following syntax and options:
```javascript
import { ApptModule } from '@appt/core';

@ApptModule({
	import: ['RoutersModule', 'ControllersModule'],
	declare: ['DatabaseComponent', 'HelpersComponent']
})
export class AppMain(){}
```
The example above, shows the class (`AppMain`) handled by our module decorator, which **imports** others modules and **declares** your components. It is important to notice that: 
 - The `import` option is only used to call other **modules**;
 - The `declare` option is designed to assemble (and call) only **components**;

### @ApptComponent
It is a class decorator responsible for the *application's logic programming*. There is where you are going to put your code. For Appt, it does not really matters what your components are. Unless you modify a behaviour using a *Special-Type Extender*, it only cares if it's a piece of implementation which you want inject or use on/by somewhere else.

An `@ApptComponent` has the following syntax and options:
```javascript
import { ApptComponent, TDatabase } from '@appt/core';
import { Mongoose } from '@appt/mongoose';

@ApptComponent({
	extend: {
		type: TDatabase,
		use: [Mongoose],
		config: {
			uri: 'mongodb://localhost:27017/appt-demo',
			options: {}
		}
	},
	inject: ['HelpersComponent']
})
export class AppDatabase(){
	constructor(helpers){
		helpers.showDatabaseLog();
	}
}
```
There are few thing here: 
 - `@ApptComponent` is also a class decorator.
 - For a didactic explanation, the example above expose all the options an `@ApptComponent` can have. Which means, to put a class into Appt's ecosystem, a simple `@ApptComponent()` is needed;
 - We're using the `@appt/mongoose` plugin. It is a driver of MongoDB using Mongoose ODM ([docs here](https://github.com/brab0/appt/tree/master/plugins/mongoose)). 
 - These type of decorator can only **inject** other components and these injection are passed through the class constructor, such as seen above with the `HelpersComponent` class which will print a log of our database connection (at this example);
 - An `@ApptComponent` can get a meaning, a special behaviour passed through a Special-Type Extender (*TDatabase, in this case*).

### TDatabase
It is the only Special-Type Extender of the package. It is only an implementation of a generic database connector that is ready/needs to couple (*use*) a 'driver' to execute what kind of database we are going to work with.


## Compatibility
**We're using ES6 features!** Which means you gonna need to compile your code to work with current versions of **NodeJs**. Thankfully, there's a lot of tools out there doing that, such as [babel](https://babeljs.io/).
You might also want to work with **TypeScript**. If you do, check the *experimental decorators support* option to start coding.


## That's all folks!
If you have any suggestion or want to contribute somehow, let me know!


## License
```

MIT License

  

Copyright (c) 2017 Rodrigo Brabo

  

Permission is hereby granted, free of charge, to any person obtaining a copy

of this software and associated documentation files (the "Software"), to deal

in the Software without restriction, including without limitation the rights

to use, copy, modify, merge, publish, distribute, sublicense, and/or sell

copies of the Software, and to permit persons to whom the Software is

furnished to do so, subject to the following conditions:

  

The above copyright notice and this permission notice shall be included in all

copies or substantial portions of the Software.

  

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR

IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,

FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE

AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER

LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,

OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE

SOFTWARE.

```
