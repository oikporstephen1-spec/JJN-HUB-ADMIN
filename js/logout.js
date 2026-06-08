const logoutBtn =
document.getElementById("logoutBtn");

if(logoutBtn){

logoutBtn.addEventListener(
"click",
async () => {

await supabaseClient.auth.signOut();

window.location.href =
"login.html";

});

}