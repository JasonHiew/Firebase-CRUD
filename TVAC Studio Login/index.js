firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
        // User is signed in.

        document.getElementById("user_div").style.display = "block";
        document.getElementById("login_div").style.display = "none";

        var user = firebase.auth().currentUser;

        //Get user details
        var user = firebase.auth().currentUser;
        var name, email, photoUrl, uid, emailVerified;

        if (user != null) {
          name = user.displayName;
          email = user.email;
          photoUrl = user.photoURL;
          emailVerified = user.emailVerified;
          uid = user.uid;  // The user's ID, unique to the Firebase project. Do NOT use
                           // this value to authenticate with your backend server, if
                           // you have one. Use User.getToken() instead.
          document.getElementById("user_para").innerHTML =  '<b>Your Details:</b> <br>' +
                                                            'Name : ' + name + 
                                                            '<br>Email : ' + email +
                                                            '<br>photoUrl : ' + photoUrl +
                                                            '<br>emailVerified : ' + emailVerified +
                                                            '<br>UID : ' + uid;
        }


    } else {
        // No user is signed in.

        document.getElementById("user_div").style.display = "none";
        document.getElementById("login_div").style.display = "block";

    }
});

function login() {

    var userEmail = document.getElementById("email_field").value;
    var userPass = document.getElementById("password_field").value;

    firebase.auth().signInWithEmailAndPassword(userEmail, userPass).catch(function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;

        window.alert("Error : " + errorMessage);

        // ...
    });
}

function logout() {
    firebase.auth().signOut();
}

document.getElementById("go-to-database").addEventListener("click", redirect);

function redirect() {
    //location = "../index.html";
    window.location.replace("../index.html");
}