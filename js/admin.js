function toggleAdminMenu(){

const sidebar =
document.querySelector(".sidebar");

if(sidebar){

sidebar.classList.toggle("show");

}

}
document
.querySelectorAll(".sidebar a")
.forEach(link=>{

link.addEventListener("click",()=>{

const sidebar =
document.querySelector(".sidebar");

if(window.innerWidth <= 900){

sidebar.classList.remove("show");

}

});

});