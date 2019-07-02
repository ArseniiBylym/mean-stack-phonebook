// change file name to environtment.prod.ts and fill the firebase config object with your personal firebase project config data
export const environment = {
    production: true,
    BASE_URL: 'http://localhost:5000/api',
    firebase: {
        apiKey: '<apiKey>',
        authDomain: '<authDomain>',
        databaseURL: '<databaseURL>',
        projectId: '<projectId>',
        storageBucket: '',
        messagingSenderId: '<messagingSenderId>',
        appId: '<appId>',
    },
};
