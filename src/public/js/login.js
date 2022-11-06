function t1(){
    var email= document.getElementById("email").value;
    if(email!=""){
        document.getElementById("email").innerHTML = "";
        return true;
    }
}
function t2(){
    var mk= document.getElementById("password").value;
    if(mk!=""){
        document.getElementById("mk").innerHTML = "";
        return true;
    }
}