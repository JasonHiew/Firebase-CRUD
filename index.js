var rootRef = firebase.database().ref().child("users");

var tableElement = $('#table_body');

// -------------------------------------------------------------Table update listeners---------------------------------------------------------------------
rootRef.on("child_added", snap => {
    var key = snap.key;

    console.log(key);

    var name = snap.child("name").val();
    var email = snap.child("email").val();
    var time = snap.child("time").val();

    $("#table_body").append("<tr id='" + key + "'>" +
        "<td><button class='btn btn-primary'  data-id='" + key + "' onclick='copyUser(\"" + key + "\")'>Copy To</button></td>" +
        "<td>" + name + "</td>" +
        "<td>" + email + "</td>" +
        "<td>" + time + "</td>" +
        "<td><button class='btn btn-danger'  data-id='" + key + "' onclick='deleteUser(\"" + key + "\")'>Remove</button></td>" +
        "<td><button class='btn btn-primary'  data-id='" + key + "' onclick='updateUser(\"" + key + "\")' data-toggle='modal' data-target='#update-modal'>Update</button></td>" +
        "</tr>");
});

rootRef.on("child_changed", snap => {
    var key = snap.key;
    var name = snap.child("name").val();
    var email = snap.child("email").val();
    var time = snap.child("time").val();

    $("#" + key).replaceWith("<tr id='" + key + "'>" +
        "<td><button class='btn btn-primary'  data-id='" + key + "' onclick='copyUser(\"" + key + "\")'>Copy To</button></td>" +
        "<td>" + name + "</td>" +
        "<td>" + email + "</td>" +
        "<td>" + time + "</td>" +
        "<td><button class='btn btn-danger'  data-id='" + key + "' onclick='deleteUser(\"" + key + "\")'>Remove</button></td>" +
        "<td><button class='btn btn-primary'  data-id='" + key + "' onclick='updateUser(\"" + key + "\")' data-toggle='modal' data-target='#update-modal'>Update</button></td>" +
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

    console.log("Remove btn clicked at snapshot.key : " + k)

    $("#" + k).remove();
    rootRef.child(k).remove();

}


//------------------------------------------------------------------Add Function-------------------------------------------------------------------
function addUser() {
    var name = $("#name").val();
    var email = $("#email").val();

    var now = new Date();
    var time = now.getFullYear() + '-' + ('0' + (now.getMonth()+1)).slice(-2) + '-' + ('0' + now.getDate()).slice(-2) + "  " + 
    now.getHours() + ":" + ('0' + (now.getMinutes())).slice(-2) + ":" + ('0' + now.getSeconds()).slice(-2);

    if (name == "" || email == "") {
        alert('Please insert all details!');
    } else {
        var newData = {
            email: email,
            name: name,
            time: time
        }
        rootRef.push(newData);
    }

    console.log("Add btn clicked");
    // formClear();
}

//------------------------------------------------------------------Update Functions-------------------------------------------------------------------
function updateUser(k) {
    // var k = $(this).data('id');
    var userRef = firebase.database().ref('users/' + k);

    console.log("Update btn clicked at snapshot.key : " + k)

    userRef.once('value', snap => {    
        $("#name-modal").val(snap.val().name);
        $("#email-modal").val(snap.val().email);  

        //Set the snapshot.key to Jquery's invisible data attribute, "data-id", of the saveChanges button in the modal dialog box
        $('#saveChanges').data('id', k);
    })
}

//On Click of Save Changes btn in modal window
$('#saveChanges').click(function(){
    
    //Retrieve the snapshot.key passed to data-id in saveChanges button in the modal dialog box
    var data = $(this).data("id");
    console.log("Changes saved to snapshot.key : " + data);

    var name = $("#name-modal").val();
    var email = $("#email-modal").val();

    if (name == "" || email == "") {
        alert('Please insert all details!');
    } else {
        var newData = {
            name: name,
            email: email,
            // time: time
        }

        rootRef.child(data).update(newData);
        $('#update-modal').modal('toggle');
    }
});

function copyUser(k) {
    console.log("Copy btn clicked at snapshot.key : " + k)
    var name = $("#name").val();
    var email = $("#email").val();

    if (name == "" || email == "") {
        alert('Please insert all details!');
    } else {
        var newData = {
            name: name,
            email: email,
            // time: time
        }
        rootRef.child(k).update(newData);
    }
}
//------------------------------------------------------------------End of Update Functions-----------------------------------------------------------

// Clear form fields
function formClear() {
    $("#name").val("");
    $("#email").val("");
}

