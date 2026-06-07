function toggleMenu(){

const menu =
document.getElementById("mobileMenu");

if(menu){

menu.classList.toggle("active");

}

}


/* ORDER POPUP */

function openOrderForm(vehicle){

const popup =
document.getElementById("orderPopup");

const selectedVehicle =
document.getElementById("selectedVehicle");

if(selectedVehicle && vehicle){

selectedVehicle.value = vehicle;

}

if(popup){

popup.style.display = "block";

}

}


function closeOrderForm(){

const popup =
document.getElementById("orderPopup");

if(popup){

popup.style.display = "none";

}

}


/* IMAGE POPUP */

function openImage(img){

const popup =
document.getElementById("imagePopup");

const popupImage =
document.getElementById("popupImage");

if(popup && popupImage){

popup.style.display = "flex";

popupImage.src = img.src;

}

}


function closeImage(){

const popup =
document.getElementById("imagePopup");

if(popup){

popup.style.display = "none";

}

}


/* CLOSE POPUPS WHEN CLICKING OUTSIDE */

window.onclick = function(event){

const orderPopup =
document.getElementById("orderPopup");

const imagePopup =
document.getElementById("imagePopup");

if(orderPopup && event.target === orderPopup){

orderPopup.style.display = "none";

}

if(imagePopup && event.target === imagePopup){

imagePopup.style.display = "none";

}

}

function openOrderForm(){

const popup =
document.getElementById("orderPopup");

if(popup){

popup.style.display="block";

}

}


function closeOrderForm(){

const popup =
document.getElementById("orderPopup");

if(popup){

popup.style.display="none";

}

}


window.onclick = function(event){

const popup =
document.getElementById("orderPopup");

if(popup && event.target === popup){

popup.style.display="none";

}

}
function openImage(img){

document
.getElementById("imagePopup")
.style.display="flex";

document
.getElementById("popupImage")
.src=img.src;

}

function closeImage(){

document
.getElementById("imagePopup")
.style.display="none";

}
function showMarine(service, button){

document
.querySelectorAll('.marine-description')
.forEach(item=>{

item.classList.remove('active-marine-content');

});

document
.querySelectorAll('.marine-btn')
.forEach(item=>{

item.classList.remove('active-marine');

});

document
.getElementById(service)
.classList.add('active-marine-content');

button.classList.add('active-marine');

const image =
document.getElementById('marineImage');

if(service==='electrical'){
image.src='assets/marine1.jpg';
}

if(service==='switchboard'){
image.src='assets/marine2.jpg';
}

if(service==='navigation'){
image.src='assets/marine3.jpg';
}

if(service==='communication'){
image.src='assets/marine4.jpg';
}

if(service==='troubleshooting'){
image.src='assets/marine5.jpg';
}

if(service==='dockyard'){
image.src='assets/marine1.jpg';
}

}
function showLogistics(service, button){

document
.querySelectorAll('.logistics-description')
.forEach(item=>{

item.classList.remove('active-logistics-content');

});

document
.querySelectorAll('.logistics-btn')
.forEach(item=>{

item.classList.remove('active-logistics');

});

document
.getElementById(service)
.classList.add('active-logistics-content');

button.classList.add('active-logistics');

const image =
document.getElementById('logisticsImage');

if(service==='freight'){
image.src='assets/logistics1.jpg';
}

if(service==='shipping'){
image.src='assets/logistics2.jpg';
}

if(service==='importexport'){
image.src='assets/logistics3.jpg';
}

if(service==='procurement'){
image.src='assets/logistics4.jpg';
}

if(service==='tracking'){
image.src='assets/logistics5.jpg';
}

if(service==='project'){
image.src='assets/logistics1.jpg';
}

}
function showProcurement(service, button){

document
.querySelectorAll('.procurement-description')
.forEach(item=>{

item.classList.remove('active-procurement-content');

});

document
.querySelectorAll('.procurement-btn')
.forEach(item=>{

item.classList.remove('active-procurement');

});

document
.getElementById(service)
.classList.add('active-procurement-content');

button.classList.add('active-procurement');

const image =
document.getElementById('procurementImage');

if(service==='industrial'){
image.src='assets/procurement1.jpg';
}

if(service==='marine'){
image.src='assets/procurement2.jpg';
}

if(service==='automotive'){
image.src='assets/procurement3.jpg';
}

if(service==='technical'){
image.src='assets/procurement4.jpg';
}

if(service==='vendor'){
image.src='assets/procurement5.jpg';
}

if(service==='strategic'){
image.src='assets/procurement1.jpg';
}

}