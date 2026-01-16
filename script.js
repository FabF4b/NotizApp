const newTitleEle = document.getElementById("newNoteTitle-input");
const newContentEle = document.getElementById("newNote-input");
const saveButtonEle = document.getElementById("save-btn");
const deleteButtonEle = document.getElementById("delete-btn");
const notesListEle = document.getElementById("notes-list");

let notes = [];

loadFromLocalStorage();
renderNotes();

// daten aus eingabe in objekt
function saveNote() {
  const note = {
    id: crypto.randomUUID(),
    title: newTitleEle.value,
    content: newContentEle.value,
    lastSave: new Date(),
  };
  notes.push(note);
  console.log(note.id);

  renderNotes();
  saveToLocalStorage();
  newTitleEle.value = "";
  newContentEle.value = "";
}

// notiz rendern
function renderNotes() {
  notesListEle.textContent = "";

  const sortedNotes = notes.sort(
    (noteA, noteB) => noteB.lastSave - noteA.lastSave
  );

  sortedNotes.forEach((note) => {
    const notesDiv = document.createElement("div");
    notesDiv.classList.add("sidebar-note");
    notesDiv.dataset.id = note.id;

    const noteTitle = document.createElement("h3");
    noteTitle.textContent = note.title;

    const noteContent = document.createElement("p");
    noteContent.textContent = note.content;

    const noteDate = document.createElement("h5");
    noteDate.textContent = note.lastSave.toLocaleString("de-DE");

    notesDiv.appendChild(noteTitle);
    notesDiv.appendChild(noteContent);
    notesDiv.appendChild(noteDate);

    notesListEle.appendChild(notesDiv);
  });
}

// daten im LS speichern
function saveToLocalStorage() {
  localStorage.setItem("notes", JSON.stringify(notes));
}

// daten aus LS laden
function loadFromLocalStorage() {
  const savedNotes = localStorage.getItem("notes");
  if (savedNotes) {
    notes = JSON.parse(savedNotes);
  }
}

// save-btn funktion
saveButtonEle.addEventListener("click", () => {
  if (newTitleEle.value === "" || newContentEle.value === "") {
    alert("Bitte gib einen Titel und Inhalt ein");
    return;
  }
  saveNote();
});

// delete-btn funktion

// neue notiz-btn funktion
function newNote() {
  newTitleEle.value = "";
  newContentEle.value = "";
}

// notiz auswählen und anzeigen
notesListEle.addEventListener("click", (event) => {
  const clickedNoteId = event.target.closest(".sidebar-note").dataset.id;
  showSelectedNote(clickedNoteId);
});

function showSelectedNote(id) {
  const selectedNote = notes.find((note) => note.id === id);
  if (!selectedNote) return;

  newTitleEle.value = selectedNote.title;
  newContentEle.value = selectedNote.content;
}
