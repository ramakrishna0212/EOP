
const todossUl = document.querySelector('.todoss');
const input = document.querySelector('#add');
const saveBtn = document.querySelector('#save');


const savetodoss = (imageData, submissionTime) => {
    const todoss = gettodoss();
    todoss.push({ imageData: imageData, time: submissionTime });
    localStorage.setItem('todoss', JSON.stringify(todoss));
};


const displayTodoItem = (imageData, submissionTime) => {
    let li = document.createElement('li');
    let img = document.createElement('img');
    img.onload = function() {
        img.style.width = '90%'; 
        li.appendChild(img);
        todossUl.appendChild(li);
    };
    img.src = imageData;
    let span = document.createElement('span');
    span.textContent = submissionTime;
    li.appendChild(span);
    li.addEventListener('dblclick', () => {
        deletetodoss(li);
    });
};


const handleFileUpload = () => {
    const files = input.files;
    const submissionTime = new Date();

    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (file) {
            const reader = new FileReader();
            reader.onload = function (e) {
                const imageData = e.target.result;
                displayTodoItem(imageData, submissionTime);
                savetodoss(imageData, submissionTime);
            };
            reader.readAsDataURL(file);
        }
    }

    
    input.value = ''; 
};


saveBtn.addEventListener('click', handleFileUpload);


const loadImagesFromLocalStorage = () => {
    const todoss = gettodoss();

    todoss.forEach(item => {
        displayTodoItem(item.imageData, new Date(item.time).toLocaleString());
    });
};


const gettodoss = () => {
    let todoss;
    if (localStorage.getItem('todoss') === null) {
        todoss = [];
    } else {
        todoss = JSON.parse(localStorage.getItem('todoss'));
    }
    return todoss;
};

window.addEventListener('DOMContentLoaded', loadImagesFromLocalStorage);
