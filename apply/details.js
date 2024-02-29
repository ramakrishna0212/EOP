const list = document.querySelector('ul');
const titleInput = document.querySelector('#name');
const bodyInput = document.querySelector('#email');
const form = document.querySelector('form');
const submitBtn = document.querySelector('form button');

let db;

const openRequest = window.indexedDB.open('notes_db', 1);

openRequest.addEventListener('error', () => console.error('Database failed to open'));

openRequest.addEventListener('success', () => {
  console.log('Database opened successfully');
  db = openRequest.result;
  displayData();
});

openRequest.addEventListener('upgradeneeded', e => {
  db = e.target.result;

  const objectStore = db.createObjectStore('notes_os', { keyPath: 'id', autoIncrement:true });

  objectStore.createIndex('name', 'name', { unique: false });
  objectStore.createIndex('email', 'email', { unique: false });

  console.log('Database setup complete');
});

form.addEventListener('submit', addData);

function addData(e) {
  e.preventDefault();

  const newItem = { name: titleInput.value, email: bodyInput.value };

  const transaction = db.transaction(['notes_os'], 'readwrite');
  const objectStore = transaction.objectStore('notes_os');
  const addRequest = objectStore.add(newItem);

  addRequest.addEventListener('success', () => {
    titleInput.value = '';
    bodyInput.value = '';
  });

  transaction.addEventListener('complete', () => {
    console.log('Transaction completed: database modification finished.');

    displayData();
  });

  transaction.addEventListener('error', () => console.log('Transaction not opened due to error'));
}

function displayData() {
  while (list.firstChild) {
    list.removeChild(list.firstChild);
  }

  const objectStore = db.transaction('notes_os').objectStore('notes_os');
  objectStore.openCursor().addEventListener('success', e => {
    const cursor = e.target.result;

    if(cursor) {
      const listItem = document.createElement('li');
      const h3 = document.createElement('h3');
      const para = document.createElement('p');

      listItem.appendChild(h3);
      listItem.appendChild(para);
      list.appendChild(listItem);

      h3.textContent = cursor.value.name;
      para.textContent = cursor.value.email;

      listItem.setAttribute('data-note-id', cursor.value.id);

      cursor.continue();
    } else {
      if(!list.firstChild) {
        const listItem = document.createElement('li');
        listItem.textContent = 'No notes stored.'
        list.appendChild(listItem);
        listItem.submitBtn;
      }

      console.log('Notes all displayed');
    }
  });
}
