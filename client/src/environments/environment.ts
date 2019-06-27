// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  BASE_URL: 'http://localhost:5000/api',
  firebase: {
    apiKey: "AIzaSyCuSRroU3vGqVS0PjAdkr67aheIQMmptB8",
    authDomain: "ng-phonebook-58f04.firebaseapp.com",
    databaseURL: "https://ng-phonebook-58f04.firebaseio.com",
    projectId: "ng-phonebook-58f04",
    storageBucket: "",
    messagingSenderId: "870796540855",
    appId: "1:870796540855:web:591e3635f2ffddc4"
  }
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
