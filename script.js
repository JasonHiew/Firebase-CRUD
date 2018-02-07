var rootRef = firebase.database().ref().child("users");

//-------------------------------------------------------Input validation rules(JQuery)-------------------------------------------------------

//-------------------------------------------------------Submit form on "Enter" keypress-------------------------------------------------------
$(function () {
    $("#reason").keypress(function (e) {
        var code = (e.keyCode ? e.keyCode : e.which);
        if (!e.ctrlKey && code == 13) {
            e.preventDefault();
            $("#add-button").trigger('click');
            return false;
        }
    });
});

$(function () {
    $("#reason-modal").keypress(function (e) {
        var code = (e.keyCode ? e.keyCode : e.which);
        if (!e.ctrlKey && code == 13) {
            e.preventDefault();
            $("#saveChanges").trigger('click');
            return false;
        }
    });
});
// -------------------------------------------------------End of Submit form on "Enter" keypress---------------------------------------------------
// -------------------------------------------------------------Table update listeners---------------------------------------------------------------------
rootRef.on("child_added", snap => {
    var key = snap.key;

    console.log(key);

    var ic = snap.child("ic").val();
    var name = snap.child("name").val();
    var plateNo = snap.child("plateNo").val();
    var time = snap.child("time").val();
    var reason = snap.child("reason").val();

    $("#table_body").append("<tr id='" + key + "'>" +
        // "<td><button class='btn btn-primary'  data-id='" + key + "' onclick='copyUser(\"" + key + "\")'>Copy To</button></td>" +
        "<td>" + ic + "</td>" +
        "<td>" + name + "</td>" +
        "<td>" + plateNo + "</td>" +
        "<td>" + time + "</td>" +
        "<td>" + reason + "</td>" +
        "<td><button class='btn btn-danger'  data-id='" + key + "' onclick='deleteUser(\"" + key + "\")'>Remove</button></td>" +
        "<td><button class='btn btn-primary'  data-id='" + key + "' onclick='updateUser(\"" + key + "\")' data-toggle='modal' data-target='#update-modal-form'>Update</button></td>" +
        "</tr>");
});

rootRef.on("child_changed", snap => {
    var key = snap.key;
    var ic = snap.child("ic").val();
    var name = snap.child("name").val();
    var plateNo = snap.child("plateNo").val();
    var time = snap.child("time").val();
    var reason = snap.child("reason").val();

    $("#" + key).replaceWith("<tr id='" + key + "'>" +
        // "<td><button class='btn btn-primary'  data-id='" + key + "' onclick='copyUser(\"" + key + "\")'>Copy To</button></td>" +
        "<td>" + ic + "</td>" +
        "<td>" + name + "</td>" +
        "<td>" + plateNo + "</td>" +
        "<td>" + time + "</td>" +
        "<td>" + reason + "</td>" +
        "<td><button class='btn btn-danger'  data-id='" + key + "' onclick='deleteUser(\"" + key + "\")'>Remove</button></td>" +
        "<td><button class='btn btn-primary'  data-id='" + key + "' onclick='updateUser(\"" + key + "\")' data-toggle='modal' data-target='#update-modal-form'>Update</button></td>" +
        "</tr>");
});

//Reflection of row delete without refresh
rootRef.on("child_removed", oldSnap => {
    var key = oldSnap.key;

    $("#" + key).remove();
});

//------------------------------------------------------------End of table update listeners-----------------------------------------------------------------

//-----------------------------------------------------------------Row delete function----------------------------------------------------------------------
function deleteUser(k) {

    console.log("Remove btn clicked at snapshot.key : " + k);

    $("#" + k).remove();
    rootRef.child(k).remove();
}


//------------------------------------------------------------------Add Function-------------------------------------------------------------------
function addUser() {

    var ic = $("#ic").val();
    var name = $("#name").val();
    var plateNo = $("#plate-no").val();
    var reason = $("#reason").val();
    //Add current time into the table
    var now = new Date();
    var time = now.getFullYear() + '-' + ('0' + (now.getMonth()+1)).slice(-2) + '-' + ('0' + now.getDate()).slice(-2) + "  " + 
    now.getHours() + ":" + ('0' + (now.getMinutes())).slice(-2) + ":" + ('0' + now.getSeconds()).slice(-2);

    if (ic == "" || name == "" || plateNo == "" || plateNo == "") {
        alert('Please insert all details!');
    } else {
        var newData = {
            ic: ic,
            name: name,
            plateNo: plateNo,
            time: time,
            reason: reason
        };
        rootRef.push(newData);
    }

    console.log("Add btn clicked");
    // formClear();
}

//------------------------------------------------------------------Update Functions-------------------------------------------------------------------
function updateUser(k) {
    // var k = $(this).data('id');
    var userRef = firebase.database().ref('users/' + k);

    console.log("Update btn clicked at snapshot.key : " + k);

    userRef.once('value', snap => {    
        $("#ic-modal").val(snap.val().ic);
        $("#name-modal").val(snap.val().name);
        $("#plate-no-modal").val(snap.val().plateNo); 
        $("#reason-modal").val(snap.val().reason); 


        //Set the snapshot.key to Jquery's invisible data attribute, "data-id", of the saveChanges button in the modal dialog box
        $('#saveChanges').data('id', k);
    });
}

//On Click of Save Changes btn in modal window
$('#saveChanges').click(function(){
    
    //Retrieve the snapshot.key passed to data-id in saveChanges button in the modal dialog box
    var data = $(this).data("id");
    console.log("Changes saved to snapshot.key : " + data);

    var ic = $("#ic-modal").val();
    var name = $("#name-modal").val();
    var plateNo = $("#plate-no-modal").val();
    var reason = $("#reason-modal").val();

    if (ic == "" || name == "" || plateNo == "" || plateNo == "") {
        alert('Please insert all details!');
    } else {
        var newData = {
            ic: ic,
            name: name,
            plateNo: plateNo,
            reason: reason,
            // time: time
        };

        rootRef.child(data).update(newData);
        $('#update-modal-form').modal('toggle');
    }
});

function copyUser(k) {
    console.log("Copy btn clicked at snapshot.key : " + k);
    var ic = $("#ic-modal").val();
    var name = $("#name-modal").val();
    var plateNo = $("#plate-no-modal").val();
    var reason = $("#reason-modal").val();

    if (ic == "" || name == "" || plateNo == "" || plateNo == "") {
        alert('Please insert all details!');
    } else {
        var newData = {
            ic: ic,
            name: name,
            plateNo: plateNo,
            reason: reason,
            // time: time
        };
        rootRef.child(k).update(newData);
    }
}
//------------------------------------------------------------------End of Update Functions-----------------------------------------------------------

// Clear form fields
function formClear() {
    $("#ic").val("");
    $("#name").val("");
    $("#plateNo").val("");
    $("#reason").val("");

}

//------------------------------------------------------------------Testing Login-----------------------------------------------------------

// TODO Add auth state change listener as well as other auth state listeners
// TODO Add non-interactive modal dialog that forces users to log in by showing them a button to go back to login page


//Test Button click
// $("#logout-button").click(function() {
//     // location = "TVAC Studio Login/index.html";
//     window.location.replace("login_page.html");
// })



firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
        // User is signed in.
        
        // alert("Auth State Changed");
        
        $('#login-modal-form').modal('hide');        

        // window.location = "index.html"
        $("#redirect-button").css("display", "block");


    } else {
        // No user is signed in.
        
        $('#login-modal-form').modal('show');
        // window.location = "login_page.html"
         
        // alert("Auth State Changed");
        
        $("#redirect-button").css("display", "none");
    }
});

function login() {

    var userEmail = $("#login-email").val();
    var userPass = $("#login-password").val();

    console.log(userEmail, userPass);

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

// $("#login-button").click(function(){
//     window.location.replace("index.html");
// })

function redirect(){
    window.location.replace("index.html");
}