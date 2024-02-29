const noteList = document.querySelector('ul');
const titleInput = document.querySelector('#title');
const bodyInput = document.querySelector('#body');
const form = document.querySelector('form');
let database;

const openRequest = window.indexedDB.open('notes_db', 1);
openRequest.addEventListener('error', () => console.error('Database failed to open'));
openRequest.addEventListener('success', () => {
  console.log('Database opened successfully');
  database = openRequest.result;
  displayNotes();
});
openRequest.addEventListener('upgradeneeded', e => {
  database = e.target.result;
  const objectStore = database.createObjectStore('notes_os', { keyPath: 'id', autoIncrement:true });
  objectStore.createIndex('title', 'title', { unique: false });
  objectStore.createIndex('body', 'body', { unique: false });
  console.log('Database setup complete');
});
form.addEventListener('submit', addNote);

function addNote(e) { 
  e.preventDefault();
  const newNote = { title: titleInput.value, body: bodyInput.value };
  const transaction = database.transaction(['notes_os'], 'readwrite');
  const objectStore = transaction.objectStore('notes_os');
  const addRequest = objectStore.add(newNote);
  addRequest.addEventListener('success', () => {
    titleInput.value = '';
    bodyInput.value = '';
    displayNotes();
  });
  transaction.addEventListener('complete', () => {
    console.log('Transaction completed: database modification finished.'); 
  });
  transaction.addEventListener('error', () => console.log('Transaction not opened due to error'));
}
function displayNotes() {
  while (noteList.firstChild) {
    noteList.removeChild(noteList.firstChild);
  }
  const objectStore = database.transaction('notes_os').objectStore('notes_os');
  objectStore.openCursor().addEventListener('success', e => {
    const cursor = e.target.result;
    if(cursor) {
      const listItem = document.createElement('li');
      const h3 = document.createElement('h3');
      const para = document.createElement('p');
      listItem.appendChild(h3);
      listItem.appendChild(para);
      noteList.appendChild(listItem);
      h3.textContent = cursor.value.title;
      para.textContent = cursor.value.body;
      cursor.continue();
    } else {
      if(!noteList.firstChild) {
        const listItem = document.createElement('li');
        listItem.textContent = 'No note found';
        noteList.appendChild(listItem);
      }
      console.log('All notes displayed');
    }
  });
}
