let db =
JSON.parse(
localStorage.getItem("galleryDB")
)
||
{
  folders:{
    "Default":[]
  }
};

let currentFolder =
"Default";

const gallery =
document.getElementById("gallery");

const folderBar =
document.getElementById("folderBar");

const upload =
document.getElementById("upload");

const search =
document.getElementById("search");

const empty =
document.getElementById("empty");

function save(){

localStorage.setItem(
"galleryDB",
JSON.stringify(db)
);

}

function renderFolders(){

folderBar.innerHTML = "";

Object.keys(
db.folders
).forEach(folder=>{

const div =
document.createElement("div");

div.className = "folder";

if(folder === currentFolder){
div.classList.add("active");
}

div.innerText = folder;

div.onclick = ()=>{

currentFolder = folder;

renderFolders();

renderGallery();

};

folderBar.appendChild(div);

});

}

function renderGallery(){

gallery.innerHTML = "";

const files =
db.folders[currentFolder];

const searchValue =
search.value.toLowerCase();

const filtered =
files.filter(file=>
file.name
.toLowerCase()
.includes(searchValue)
);

if(filtered.length === 0){
empty.style.display = "block";
}else{
empty.style.display = "none";
}

filtered.forEach((file,index)=>{

const card =
document.createElement("div");

card.className = "card";

let media = "";

if(
file.type.startsWith("image")
){

media =
`<img src="${file.data}">`;

}else{

media =
`
<video
src="${file.data}"
controls>
</video>
`;

}

card.innerHTML = `

${media}

<div class="content">

<div class="filename">
${file.name}
</div>

<div class="actions">

<button
class="download"
onclick="downloadFile(${index})">

Download

</button>

<button
class="delete"
onclick="deleteFile(${index})">

Delete

</button>

</div>

</div>
`;

gallery.appendChild(card);

});

}

upload.addEventListener(
"change",
function(e){

const files =
Array.from(e.target.files);

files.forEach(file=>{

const reader =
new FileReader();

reader.onload =
function(event){

db.folders[currentFolder]
.push({

name:file.name,

type:file.type,

data:event.target.result

});

save();

renderGallery();

};

reader.readAsDataURL(file);

});

});

document
.getElementById("newFolder")
.onclick = ()=>{

const name =
prompt("Folder name:");

if(!name) return;

db.folders[name] = [];

currentFolder = name;

save();

renderFolders();

renderGallery();

};

function deleteFile(index){

db.folders[currentFolder]
.splice(index,1);

save();

renderGallery();

}

function downloadFile(index){

const file =
db.folders[currentFolder]
[index];

const a =
document.createElement("a");

a.href = file.data;

a.download = file.name;

a.click();

}

search.addEventListener(
"input",
renderGallery
);

renderFolders();

renderGallery();
