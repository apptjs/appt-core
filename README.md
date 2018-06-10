# Appt
A lightweight *exo-framework* for *ready-to-go* **NodeJs** applications.


## What?!
It's interesting how the idea of framework remains the same since 90's. Even with all the *packages manager running*, essentially most of them still use cannonballs to kill flies, bringing a lot of stuff we don't need, putting all together, demanding a big learning curve and re-inventing the wheel. Once said that...

> "how do we create a framework unnecessarily heavy, semantically intuitive, which can overcome recurrent steps on building process applications, without being too imperative, focusing on fast and scalable development?"

**We made Appt!**

*This document will introduce the main concepts used by Appt while the examples (yes, you'll see some code, but **not here**) will be separated according to their respective contexts with links to them at the **Packages** session below.*

## Why?
Imagine yourself starting a new project, which you don't really sure about the architecture. You'll write some code, import packages and classes by their paths when suddenly *BOOM*: you decide to reorganize everything. You're gonna rewrite every *../../../../path* of every single file into your project. 

...Or maybe, you're on a complex project, which becomes bigger and bigger fast, and the more it grows, the more impossible becomes to read and find yourself on it.

If some of those scenarios looks familiar and bother you, **you should definitely use Appt**!


## Main Concepts
Thanks to ES6 features, Appt's core works like an **exo-framework**. Which means we can help your development process, being less intrusive. 
> Even removing **@appt/core** *out of the way*, your implementation's logic still makes sense and gonna work.

### Dependecy Injection
The whole *Appt's ecosystem* is based on *dependecy injection pattern*, using the power of **decorators** over the **annotation** sintaxe style (*AtScript*). This allows Appt's core to be more *flexible* and *scale* your application easier *without being a lot imperative.* 

### Modules && Components
**EVERYTHING** on Appt's concept is about to build applications over the perception of **Modules** and **Components**. Inside `@appt/core`, these concepts are implemented as `@Module` and `@Component` decorators, which have the purpose to *assemble* the whole application and *handle the implementation's logic*, respectively. That means, you can naturally build your application as you always do (*building your custom middlewares, server, database connections and so on...*) and let Appt to wrap it all with simplicity on a *non-intrusive* style.

### Special-Type Extenders
Even the main core decorators `@Module` and `@Component` have particular and simple roles, Appt also provides a way to add some powers and behaviours to them, making use of *Special-Type Extenders*. That means, even you do not need them, they can give an elegant, semantic and straightforward approach to your server implementation, database connection, routes etc. 

### Default Configurations
Because we are also talking about to create *ready-to-go NodeJs applications*, every Special-Type Extender has its default configuration. That means Appt can overcome some trivial steps on development process, such as writing `CORS`, defining `Body Parsers`, making `JWT middlewares`, configuring `Routers` etc, by simply providing built-in default configuration and, of course, letting you overwrite them.


# @appt/core
This package is the main dependency of the framework. With it, you can start your NodeJs application and scale it on a *non-intrusive/non-imperative* way by maintaining everything over a **Dependency Injection Pattern** working together with a **Module/Component** abstraction provided by Appt.

## Install
    $ npm install @appt/core --save
 
## Resources
The `@appt/core` export some resources which can be imported as seen below:
```javascript
import {
	Module,
	Component,
	ApptBootstrap,
	TDatabase
} from '@appt/core';
```
### ApptBootstrap
This is a class which can be used to things related to the application bootstrap. For now, the only method exported is `module()`, which of course, is responsible only for import the application's main module.
```javascript
import { Module, ApptBootstrap } from '@appt/core';

@Module()
export class AppMain {}

ApptBootstrap.module('AppMain');
```

### @Module
It is a class decorator responsible for *call other modules and glue components together*, creating the whole application's tree. 

Every NodeJs application has one starter point. Using Appt, every starter point is an @Module and every group of components can be part of it.

An `@Module` has the following syntax and options:
```javascript
import { Module } from '@appt/core';

@Module({
	import: ['RoutersModule', 'ControllersModule'],
	declare: ['DatabaseComponent', 'HelpersComponent']
})
export class AppMain {}
```
The example above, shows the class (`AppMain`) handled by our module decorator, which **imports** others modules and **declares** your components. It is important to notice that: 
 - The `import` option is only used to call other **modules**;
 - The `declare` option is designed to assemble (and call) only **components**;

### @Component
It is a class decorator responsible for the *application's logic programming*. There is where you are going to put your code. For Appt, it does not really matters what your components are. Unless you modify a behaviour using a *Special-Type Extender*, it only cares if it's a piece of implementation which you want inject or use on/by somewhere else.

An `@Component` has the following syntax and options:
```javascript
import { Component, TDatabase } from '@appt/core';
import { Mongoose } from '@appt/mongoose';

@Component({
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
export class AppDatabase {
	constructor(helpers){
		helpers.showDatabaseLog();
	}
}
```
There are few thing here: 
 - `@Component` is also a class decorator.
 - For a didactic explanation, the example above expose all the options an `@Component` can have. Which means, to put a class into Appt's ecosystem, a simple `@Component()` is needed;
 - We're using the `@appt/mongoose` plugin. It is a driver of MongoDB using Mongoose ODM ([docs here](https://github.com/brab0/appt/tree/master/plugins/mongoose)). 
 - These type of decorator can only **inject** other components and these injection are passed through the class constructor, such as seen above with the `HelpersComponent` class which will print a log of our database connection (at this example);
 - An `@Component` can get a meaning, a special behaviour passed through a Special-Type Extender (*TDatabase, in this case*).

### TDatabase
It is the only Special-Type Extender of the package. It is only an implementation of a generic database connector that is ready/needs to couple (*use*) a 'driver' to execute what kind of database we are going to work with.


## Packages
To guarantee you're gonna use (*and load*) only what you want/need, Appt is fully modularized and uncoupled by scoped packages. These are the other packages you might wanna use:

### @appt/cli
A simple cli for Appt projects seed generation (until now)

#### Install
    $ npm install -g @appt/cli

**Read the docs:** https://github.com/brab0/appt/tree/master/cli

    
### @appt/api
A ready-to-go wrapper to build amazing API's that gathers essential tools, such as [express](https://www.npmjs.com/package/express), [`body-parser`](https://www.npmjs.com/package/body-parser) and [express-jwt](https://www.npmjs.com/package/express-jwt), putting them all into Appt's ecosystem.

#### Install
    $ npm install @appt/api --save

**Read the docs:** https://github.com/brab0/appt/tree/master/api


### @appt/mongoose
A wrapper to put [mongoose](https://www.npmjs.com/package/mongoose) inside the Appt's ecosystem and make it works on crack!

#### Install
    $ npm install @appt/mongoose --save

**Read the docs:** https://github.com/brab0/appt/tree/master/plugins/mongoose


### @appt/legacy
There was a first implementation of Appt concept. It's not maintained anymore, but it's stable and has this value on a non-class-orientation approach. If you feel curious about it, maybe it's worth to check it out. 

#### Install
    $ npm install @appt/legacy --save

**Read the docs:** https://github.com/brab0/appt/tree/master/legacy


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
