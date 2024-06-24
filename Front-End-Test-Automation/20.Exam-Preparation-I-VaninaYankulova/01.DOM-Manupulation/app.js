window.addEventListener("load", solve);

function solve() {
  let snowmanNameElement = document.getElementById("snowman-name");
  let snowmanHeightElement= document.getElementById("snowman-height");
  let locationElement = document.getElementById("location");
  let creatorNameElement= document.getElementById("creator-name");
  let attributeElement= document.getElementById("special-attribute");

  let addButtonElement = document.querySelector(".add-btn");
  let snowListElement =document.querySelector(".snowman-preview");
  let showSnowmanElement =document.querySelector(".snow-list");
  let main = document.getElementById("hero");
  let bodyElement = document.querySelector(".body");
  let backImg = document.getElementById("back-img");

  addButtonElement.addEventListener("click", onAdd);

  function onAdd(e){
e.preventDefault();
//check valid data
if (
  snowmanNameElement == ""||
  snowmanHeightElement == ""||
  locationElement == ""||
  creatorNameElement== ""||
  attributeElement== ""
){
  return;
}

//create paragraph elements for the snowman details list 
let articleElementInfo = document.createElement("article");

let liElement = document.createElement("li");
liElement.setAttribute("class", "snowman-info");

let btnContainer = document.createElement("div");
btnContainer.setAttribute("class", "btn-container");

//create paragraph elements for the snowman details list
let snowmanName= document.createElement('p');
snowmanName.textContent=`Name: ${snowmanNameElement.value}`; 

let snowmanHeight= document.createElement('p');
snowmanHeight.textContent=`Height: ${snowmanHeightElement.value}`; 

let location= document.createElement('p');
location.textContent=`Location: ${locationElement.value}`; 

let creator= document.createElement('p');
creator.textContent=`Creator: ${creatorNameElement.value}`; 

let attribute= document.createElement('p');
attribute.textContent=`Attribute: ${attributeElement.value}`; 


//create button elements for the Edit and Next Buttons
let editBtn = document.createElement("button");
editBtn.setAttribute("class", "edit-btn");
editBtn.textContent="Edit";

let nextBtn = document.createElement("button");
nextBtn.setAttribute("class", "next-btn");
nextBtn.textContent="Next";

//add all fields and buttons to the snowman article element

articleElementInfo.appendChild(snowmanName);
articleElementInfo.appendChild(snowmanHeight);
articleElementInfo.appendChild(location);
articleElementInfo.appendChild(creator);
articleElementInfo.appendChild(attribute);

//add buttons in button container
btnContainer.appendChild(editBtn);
btnContainer.appendChild(nextBtn);

liElement.appendChild(articleElementInfo);
liElement.appendChild(btnContainer);

snowListElement.appendChild(liElement);

//save filled in fields in let variables and reset form 
let editedSnowmanName = snowmanNameElement.value;
let editedSnowmanHeight = snowmanHeightElement.value;
let editedLocation = locationElement.value;
let editedCreatot = creatorNameElement.value;
let editedAttribute = attributeElement.value;

//reset form
snowmanNameElement.value="";
snowmanHeightElement.value="";
locationElement.value="";
creatorNameElement.value="";
attributeElement.value="";
addButtonElement.disabled = true;

/**
 * On edit functionality
 */
editBtn.addEventListener("click", onEdit);
function onEdit(){
  snowmanNameElement.value=editedSnowmanName;
  snowmanHeightElement.value=editedSnowmanHeight;
  locationElement.value=editedLocation;
  creatorNameElement.value=editedCreatot;
  attributeElement.value=editedAttribute;
  liElement.remove();
  addButtonElement.disabled=false;
}



 /**
  * Add next button functionality
  */
nextBtn.addEventListener("click", onNext);

function onNext(){
// create confirm element container to store the final snowman data
let liElementconfirm=document.createElement("li");
liElementconfirm.setAttribute("class", "snowman-content");

//create article element to store the send button
let articleElementContinue = document.createElement("article");
articleElementContinue=articleElementInfo;

//create sent button
let sendBtn = document.createElement("button");
sendBtn.setAttribute("class", "send-btn");
sendBtn.textContent="Send";

//add send button to the article element and the article element to the li element
articleElementContinue.appendChild(sendBtn);
liElementconfirm.appendChild(articleElementContinue);

//remove the li element where tge data were stored
liElement.remove();
//add the element with the whole data and button to the existing element
showSnowmanElement.appendChild(liElementconfirm);


//logic on click send button
sendBtn.addEventListener("click", onConfirm);
function onConfirm(){
  //remove main element as stated in the task document
  main.remove();

  //create back button
  let backBtn=document.createElement("button");
  backBtn.setAttribute("class", "back-btn");
  backBtn.textContent="Back";

  //make back image visible;
  backImg.hidden=false;

// add back button to the body
bodyElement.appendChild(backBtn);
backBtn.addEventListener("click", onBack);
function onBack(){
  window.location.reload();
}
}
}
  }
}
