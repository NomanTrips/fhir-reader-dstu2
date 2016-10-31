'use strict';

fhirReader.factory('Auth', function ($firebaseAuth, ENDPOINT_URI) {
    // Initialize Firebase
    var config = {
        apiKey: "AIzaSyDagTljyCPQvzwyZMWVgwOAfMqN4k8qmOM",
        authDomain: "fhir-reader.firebaseapp.com",
        databaseURL: "https://fhir-reader.firebaseio.com",
        storageBucket: "fhir-reader.appspot.com",
        messagingSenderId: "964822906062"
    };
    firebase.initializeApp(config);
    var rootRef = firebase.database().ref();
    return rootRef;
    //var ref = new Firebase(ENDPOINT_URI);
    //return $firebaseAuth(ref);
})
    ;