# README

## Appt

A lightweight _exo-framework_ for _ready-to-go_ **NodeJs** applications.

### What?!

It's interesting how the idea of framework remains the same since 90's. Even with all the _packages manager running_, essentially most of them still use cannonballs to kill flies, bringing a lot of stuff we don't need, putting all together, demanding a big learning curve and re-inventing the wheel. Once said that...

> "how do we create a framework unnecessarily heavy, semantically intuitive, which can overcome recurrent steps on building process applications, without being too imperative, focusing on fast and scalable development?"

**We made Appt!**

_The firsts sessions of this document will introduce the main concepts used by Appt, which is really important to know, but if you want to jump to @appt/core package specific content, just_ [_click here_](https://www.npmjs.com/package/@appt/core#apptcore)

### Why?

Imagine yourself starting a new project, which you don't really sure about the architecture. You'll write some code, import packages and classes by their paths when suddenly _BOOM_: you decide to reorganize everything. You're gonna rewrite every _../../../../path_ of every single file into your project.

...Or maybe, you're on a complex project, which becomes bigger and bigger fast, and the more it grows, the more impossible becomes to read and find yourself on it.

If some of those scenarios looks familiar and bother you, **you should definitely use Appt**!

### Main Concepts

Thanks to ES6 features, Appt's core works like an **exo-framework**. Which means we can help your development process, being less intrusive.

> Even removing **@appt/core** _out of the way_, your implementation's logic still makes sense and gonna work.

#### Dependecy Injection

The whole _Appt's ecosystem_ is based on _dependecy injection pattern_, using the power of **decorators** over the **annotation** sintaxe style \(_AtScript_\). This allows Appt's core to be more _flexible_ and _scale_ your application easier _without being a lot imperative._

#### Modules && Components

**EVERYTHING** on Appt's concept is about to build applications over the perception of **Modules** and **Components**. Inside `@appt/core`, these concepts are implemented as `@Module` and `@Component` decorators, which have the purpose to _assemble_ the whole application and _handle the implementation's logic_, respectively. That means, you can naturally build your application as you always do \(_building your custom middlewares, server, database connections and so on..._\) and let Appt to wrap it all with simplicity on a _non-intrusive_ style.

#### Special-Type Extenders

Even the main core decorators `@Module` and `@Component` have particular and simple roles, Appt also provides a way to add some powers and behaviours to them, making use of _Special-Type Extenders_. That means, even you do not need them, they can give an elegant, semantic and straightforward approach to your server implementation, database connection, routes etc.

#### Configurations

Because we are also talking about to create _ready-to-go NodeJs applications_, every Special-Type Extender has its default configuration. That means Appt can overcome some trivial steps on development process, such as writing `CORS`, defining `Body Parsers`, making `JWT middlewares`, configuring `Routers` etc, by simply providing built-in default configuration and, of course, letting you overwrite them. If you do, you can handle those configs using `@appt/core/config` or just do it on your own.

## @appt/core

This package is the main dependency of our framework. With it, you can start your NodeJs application and scale it on a _non-intrusive/non-imperative_ way by maintaining everything over a **Dependency Injection Pattern** working together with a **Module/Component** abstraction provided by Appt.

### Install

```text
$ npm install @appt/core --save
```

### Configurations

#### appt.json

Because we are talking about "_not to worry on filepaths_", appt has to be able to `glob require` your project files to put them into appt's ecosystem. To do so, every appt's project must to have an `appt.json` file, which will contain the paths to be included and excluded into the project according to the environment\(`NODE_ENV`\). Also, that file may keep you project configurations. Let's see the example below:

_package.json_

```javascript
{
  "name": "demo",
  "version": "1.0",
  "scripts": {
    "start": "export NODE_ENV=production && node ./dist/main.module.js",
    "dev": "babel-node ./src/main.module.js" 
  },
  "dependencies": {
    "@appt/core": "1.0.30"
  },
  "devDependencies": {
    "babel-cli": "^6.26.0",
    "babel-plugin-transform-decorators-legacy": "^1.3.4",
    "babel-preset-es2015": "^6.24.1"
  }
}
```

_appt.json_

```javascript
{
   "environments": {
      "default": {
         "include": ["src/**/*.js", "seeds/**/*.js"],
         "exclude": ["src/**/*.ejs"],
         "config": "./config/development"
      },
      "production": {
         "include": ["dist/**/*.js"],
         "exclude": ["dist/**/*.ejs"],
         "config": "./config/production"
      }
   }
}
```

_./config/development.js_

```javascript
export default {   
    database: { 
        uri: 'mongodb://localhost:27017/appt-demo',
        options: {
            debug:  true,
            useNewUrlParser:  true
        }
    }
}
```

_./config/production.js_

```javascript
export default {
    server_port: 3000, 
    database: { 
        uri: 'mongodb://127.53.44.23:27017/appt-production',
        options: {
            debug:  false,
            useNewUrlParser:  true
        }
    }
}
```

_What's gonna happen?_  When we execute `npm start`, before boot the program's entry file, our script into the `package.json` will export a `production` environment. That environment will be catched by appt, which will find for it into the `appt.json` file. Once found, the correspondent configurations will be merged with those into `default` environment, overriding the matched properties. Executing `npm run dev`, appt won't find any `NODE_ENV` exported. Then it will assume the `default` environment configurations.

#### @appt/core/config

Appt's configuration system is not required for any Appt's Project, but since our example is using it, let's assume the files above and see how it works running `npm run dev`:

```javascript
import { database } from '@appt/core/config';

// will print: mongodb://localhost:27017/appt-demo
console.log(database.uri);
```

_That's it!_ Now, your configurations are accessible in the whole project.

### Resources

The `@appt/core` export some resources which can be imported as seen below:

```javascript
import {
    Module,
    Component,
    TDatabase
} from '@appt/core';
```

#### @Module

It is a class decorator responsible for _call other modules and glue components together_, creating the whole application's tree.

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

The example above, shows the class \(`AppMain`\) handled by our module decorator, which **imports** others modules and **declares** your components. It is important to notice that:

* The `import` option is only used to call other **modules**;
* The `declare` option is designed to assemble \(and call\) only **components**;

#### @Component

It is a class decorator responsible for the _application's logic programming_. There is where you are going to put your code. For Appt, it does not really matters what your components are. Unless you modify a behaviour using a _Special-Type Extender_, it only cares if it's a piece of implementation which you want inject or use on/by somewhere else.

An `@Component` has the following syntax and options:

```javascript
import { Component, TDatabase } from '@appt/core';
import { database } from '@appt/core/config';
import { Mongoose } from '@appt/mongoose';

@Component({
    extend: TDatabase(Mongoose, database.uri, database.options),
    inject: ['HelpersComponent']
})
export class AppDatabase {
    constructor(helpers, res){
        console.log(res.instance, res.config)

        helpers.showDatabaseLog();
    }
}
```

There are few thing here:

* `@Component` is also a class decorator.
* For a didactic explanation, the example above expose all the options an `@Component` can have. Which means, to put a class into Appt's ecosystem, a simple `@Component()` is needed;
* We're using the `@appt/mongoose` plugin. It is a driver of MongoDB using Mongoose ODM \([docs here](https://www.npmjs.com/package/@appt/mongoose)\). 
* These type of decorator can only **inject** other components and these injection are passed through the class constructor, such as seen above with the `HelpersComponent` class which will print a log of our database connection \(at this example\);
* By default, TDatabase appends a param into contructor returning a driver instance, in this case mongoose and the configurations used.
* An `@Component` can get a meaning, a special behaviour passed through a Special-Type Extender \(_TDatabase, in this case_\).

#### TDatabase

It is the only Special-Type Extender of the package. It is only an implementation of a generic database connector that needs a 'driver' to execute what kind of database we are going to work with.

```javascript
TDatabase(Mongoose, database.uri, database.options)
```

### Packages

To guarantee you're gonna use \(_and load_\) only what you want/need, Appt is fully modularized and uncoupled by scoped packages. These are the other packages you might wanna use:

#### @appt/cli

A simple cli for Appt projects seed generation \(until now\)

**Install**

```text
$ npm install -g @appt/cli
```

**Read the docs:** [https://www.npmjs.com/package/@appt/cli](https://www.npmjs.com/package/@appt/cli)

#### @appt/api

A ready-to-go wrapper to build amazing API's that gathers essential tools, such as [express](https://www.npmjs.com/package/express), [`body-parser`](https://www.npmjs.com/package/body-parser) and [express-jwt](https://www.npmjs.com/package/express-jwt), putting them all into Appt's ecosystem.

**Install**

```text
$ npm install @appt/api --save
```

**Read the docs:** [https://www.npmjs.com/package/@appt/api](https://www.npmjs.com/package/@appt/api)

#### @appt/mongoose

A wrapper to put [mongoose](https://www.npmjs.com/package/mongoose) inside the Appt's ecosystem and make it works on crack!

**Install**

```text
$ npm install @appt/mongoose --save
```

**Read the docs:** [https://www.npmjs.com/package/@appt/mongoose](https://www.npmjs.com/package/@appt/mongoose)

#### @appt/legacy

There was a first implementation of Appt concept. It's not maintained anymore, but it's stable and has this value on a non-class-orientation approach. If you feel curious about it, maybe it's worth to check it out.

**Install**

```text
$ npm install @appt/legacy --save
```

**Read the docs:** [https://www.npmjs.com/package/@appt/legacy](https://www.npmjs.com/package/@appt/legacy)

### Compatibility

**We're using ES6 features!** Which means you gonna need to compile your code to work with current versions of **NodeJs**. Thankfully, there's a lot of tools out there doing that, such as [babel](https://babeljs.io/). You might also want to work with **TypeScript**. If you do, check the _experimental decorators support_ option to start coding.

### That's all folks!

If you have any suggestion or want to contribute somehow, let me know!

### License

```text
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

