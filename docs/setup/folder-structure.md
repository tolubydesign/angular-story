---
id: folder-structure
chapter: Folder Structure
---

# Implementation of Folder Structure


Below is an idea for how the folder structure of a Framework like angular could look like

```shell
|-- app
     |-- modules
       |-- home
           |-- [+] components
           |-- [+] pages
           |-- home-routing.module.ts
           |-- home.module.ts
     |
     |-- core
       |-- [+] authentication
       |-- [+] footer
       |-- [+] guards
       |-- [+] http
       |-- [+] interceptors
       |-- [+] mocks
       |-- [+] services
       |-- [+] header
       |-- core.module.ts
       |-- ensureModuleLoadedOnceGuard.ts
       |-- logger.service.ts
     |
     |-- shared
          |-- [+] components
          |-- [+] directives
          |-- [+] pipes
          |-- [+] models
     |
     |-- [+] configs
|-- assets
     |-- scss
          |-- [+] partials
          |-- _base.scss
          |-- styles.scss
```
Provided here, [How to define a highly scalable folder structure for your Angular project](https://itnext.io/choosing-a-highly-scalable-folder-structure-in-angular-d987de65ec7), is more on the reason why one would opt to structure a Framework like this.

## Creating Components within this Folder Structure

Because the project is an Angular Framework, set rules must be followed.

The information provided blow was captured gathered from Angular's documents. 

(Angular Documentation)[https://angular.io/docs]
(Angular 17 Documentation)[https://angular.dev/]

_Angular CLI provides all the commands you need in your app development. For your specific requirement, you can easily use ng g (ng generate) to get the work done._

`ng g c directory/component-name` will generate component-name component in the directory folder.

Following is a map of a few simple commands you can use in your application:

`ng g c comp-name` or `ng generate component comp-name` to create a component with the name 'comp-name'

`ng g s serv-name` or `ng generate service serv-name` to create a service with the name 'serv-name'

`ng g m mod-name` or `ng generate module mod-name` to create a module with the name 'mod-name'

`ng g m mod-name --routing` or `ng generate module mod-name --routing` to create a module with the name 'mod-name' with angular routing

ng g c /shared/components/not-found/not-found --flat || ng g c /shared/components/dashboard-panel/

Below is an example of how one can create a component using `ng`:
```shell
$ ng g c shared/components/ui/comp
```

Will return
```shell
CREATE src/app/shared/components/ui/comp/comp.component.scss (0 bytes)
CREATE src/app/shared/components/ui/comp/comp.component.html (38 bytes)
CREATE src/app/shared/components/ui/comp/comp.component.spec.ts (733 bytes)
CREATE src/app/shared/components/ui/comp/comp.component.ts (342 bytes)
```


