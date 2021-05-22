<!-- https://stackoverflow.com/questions/46851399/how-to-generate-components-in-a-specific-folder-with-angular-cli -->
<!-- https://stackoverflow.com/a/58485993/10569815 -->

Angular CLI provides all the commands you need in your app development. For your specific requirement, you can easily use ng g (ng generate) to get the work done.

ng g c directory/component-name will generate component-name component in the directory folder.

Following is a map of a few simple commands you can use in your application.

    ng g c comp-name or ng generate component comp-name to create a component with the name 'comp-name'
    ng g s serv-name or ng generate service serv-name to create a service with the name 'serv-name'
    ng g m mod-name or ng generate module mod-name to create a module with the name 'mod-name'
    ng g m mod-name --routing or ng generate module mod-name --routing to create a module with the name 'mod-name' with angular routing

Hope this helps!

Good Luck!
