const todossUl = document.querySelector('.todoss');
const input = document.querySelector('#add');
const saveBtn = document.querySelector('#save');

let userCounter = 0;
let lineCounter = 0;

const gettodoss = () => {
    let todoss;
    if (localStorage.getItem('todoss') === null) {
        todoss = [];
    } else {
        todoss = JSON.parse(localStorage.getItem('todoss'));
    }
    return todoss;
};

const savetodoss = (inputData, submissionTime,username) => {
    const todoss = gettodoss();
    todoss.push({ username:username,imageData: inputData, time: submissionTime });
    localStorage.setItem('todoss', JSON.stringify(todoss));
};

const loadImagesFromLocalStorage = () => {
    const todoss = gettodoss();

    todoss.forEach(item => {
        let li = document.createElement('li');
        let img = document.createElement('img');
        let span = document.createElement('span');
        img.onload = function() {
            li.appendChild(img);
            img.style.width = '90%'; 
            todossUl.appendChild(li);
        };
        img.src = item.imageData;
        span.textContent = new Date(item.time).toLocaleString();
        li.appendChild(span);
        li.addEventListener('dblclick', () => {
            deletetodoss(todoss, item);
            todossUl.removeChild(li);
        });
    });
};

const addtodoss = e => {
    e.preventDefault();
    userCounter++;

    const files = input.files; 
    const submissionTime = new Date();

   
    let line = document.createElement('hr');
    lineCounter++;
    line.innerHTML = `User ${userCounter} | Lines: ${lineCounter} | <span>${submissionTime.toLocaleString()}</span>`;
    todossUl.appendChild(line);

    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (file) {
            let li = document.createElement('li');
            let img = document.createElement('img');
            const reader = new FileReader();
            reader.onload = function (e) {
                img.src = e.target.result;
                li.appendChild(img);
                img.style.width = '90%'; 
                savetodoss(e.target.result, submissionTime);
            };

            reader.readAsDataURL(file);

            todossUl.appendChild(li);
        }
    }

    input.value = ''; 
};

const deletetodoss = (todoss, item) => {
    const index = todoss.findIndex(i => i === item);
    if (index !== -1) {
        todoss.splice(index, 1);
        localStorage.setItem('todoss', JSON.stringify(todoss));
    }
};


window.addEventListener('DOMContentLoaded', () => {
    loadImagesFromLocalStorage();
});

saveBtn.addEventListener('click', addtodoss);
