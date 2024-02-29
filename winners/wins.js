const todosesUl = document.querySelector('.todoses');
const input = document.querySelector('#add');
const saveBtn = document.querySelector('#save');

const gettodoses = () => {
    let todoses;
    if (localStorage.getItem('todoses') === null) {
        todoses = [];
    } else {
        todoses = JSON.parse(localStorage.getItem('todoses'));
    }
    return todoses;
};

const savetodoses = inputData => {
    const todoses = gettodoses();
    todoses.push(inputData);
    localStorage.setItem('todoses', JSON.stringify(todoses));
};

const addtodoses = e => {
    e.preventDefault();

    const file = input.files[0];
    if (file) {
        let li = document.createElement('li');
        let img = document.createElement('img');
        const reader = new FileReader();

        reader.onload = function (e) {
            img.src = e.target.result;
            li.appendChild(img);
            img.style.width = '90%'; 
            savetodoses(e.target.result); // Save image data to local storage
        };

        reader.readAsDataURL(file);

        todosesUl.appendChild(li);
        input.value = ''; // Clear the input
    }
};

saveBtn.addEventListener('click', addtodoses);

window.addEventListener('DOMContentLoaded', () => {
    const todoses = gettodoses();

    todoses.forEach(imageData => {
        let li = document.createElement('li');
        let img = document.createElement('img');
        img.src = imageData;
        li.appendChild(img);
        img.style.width = '90%'; 

        todosesUl.appendChild(li);

        li.addEventListener('dblclick', () => {
            deletetodoses(todoses, imageData);
            todosesUl.removeChild(li);
        });
    });
});
