const logoutBtn =
document.getElementById("logoutBtn");

const userName =
document.getElementById("userName");

(async () => {

const { data } =
await supabaseClient.auth.getUser();

if(data.user && userName){

userName.textContent =
data.user.email;

}

})();

if(logoutBtn){

logoutBtn.addEventListener(
"click",
async () => {

await supabaseClient.auth.signOut();

window.location.href =
"login.html";

});

}
