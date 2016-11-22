'use strict';

fhirReader.factory('Auth', function (firebase, $firebaseAuth, ENDPOINT_URI, $firebaseObject) {
    var factory = this;

    // Initialize Firebase
    var config = {
        apiKey: "AIzaSyDagTljyCPQvzwyZMWVgwOAfMqN4k8qmOM",
        authDomain: "fhir-reader.firebaseapp.com",
        databaseURL: "https://fhir-reader.firebaseio.com",
        storageBucket: "fhir-reader.appspot.com",
        messagingSenderId: "964822906062"
    };

    firebase.initializeApp(config);
    factory.authObj = $firebaseAuth();

    var rootRef = firebase.database().ref();
    //var obj = $firebaseObject(rootRef);

    factory.isNew = function (uid) {
        var user = rootRef.child("users").child(uid);
        var obj = $firebaseObject(user);
        //console.log(obj);
        // console.log(obj.$value);
        //if (obj.$value != null) {
        //    return false;
        // } else {
        //    return true;
        // }


        return obj.$loaded();


    }

    return {
        authenticate: function (authMethod) {
            if (authMethod == 'Google') {
                return factory.authObj.$signInWithPopup("google").then(function (authData) {
                    var isNew;
                    factory.isNew(authData.user.uid)
                        .then(function (data) {
                            console.log(data.$value); // true
                            if (typeof data.$value != 'undefined' && data.$value === null) {
                                console.log('set to true');
                                isNew = true;
                            } else {
                                console.log('set to false');
                                isNew = false;
                            }
                            if (authData && isNew) {
                                console.log('setting new');
                                rootRef.child("users").child(authData.user.uid).set({
                                    provider: authData.user.providerData[0].providerId,
                                    name: authData.user.displayName,
                                    fhirSettings: {
                                        baseUrl: "",
                                        clientName: ""
                                    }
                                    //some more user data
                                });

                            }
                        })
                        .catch(function (error) {
                            console.error("Error:", error);
                            isNew = false;

                        });


                })
            }
        },
        saveFhirSettings: function (settingsData) {
            var firebaseUser = factory.authObj.$getAuth();
            rootRef.child("users").child(firebaseUser.uid).child("fhirSettings").set(settingsData);
        },
        getFhirSettings: function () {
            var firebaseUser = factory.authObj.$getAuth();
            var settingsPath = rootRef.child("users").child(firebaseUser.uid).child("fhirSettings");
            var settingsObject = $firebaseObject(settingsPath);
            //console.log(settingsObject);
            return settingsObject;
        },
        authObj: factory.authObj
    }
    //return rootRef;
    //var ref = new Firebase(ENDPOINT_URI);
    //return $firebaseAuth(ref);

});