const newTitleEle = document.getElementById("newNoteTitle-input");
const newContentEle = document.getElementById("newNote-input");
const newNoteButtonEle = document.getElementById("new-note-btn");
const saveButtonEle = document.getElementById("save-btn");
const deleteButtonEle = document.getElementById("delete-btn");
const notesListEle = document.getElementById("notes-list");

let notes = [];

loadFromLocalStorage();

// daten aus eingabe in objekt
function saveNote() {
  const note = {
    id: crypto.randomUUID(),
    title: newTitleEle.value,
    content: newContentEle.value,
    lastSave: new Date(),
  };
  notes.push(note);

  renderNotes();
  saveToLocalStorage();
  newTitleEle.value = "";
  newContentEle.value = "";
}

// save-btn funktion
saveButtonEle.addEventListener("click", () => {
  if (newTitleEle.value === "" || newContentEle.value === "") {
    alert("Bitte gib einen Titel und Inhalt ein");
    return;
  }

  const activeDiv = document.querySelector(".sidebar-note-active");

  // notiz bearbeiten
  if (activeDiv) {
    const activeId = activeDiv.dataset.id;
    const note = notes.find((note) => note.id === activeId);
    if (!note) return;

    note.title = newTitleEle.value;
    note.content = newContentEle.value;
    note.lastSave = new Date();
    renderNotes();
    saveToLocalStorage();
  }

  // neue notiz
  else {
    saveNote();
  }
});

// notiz rendern
function renderNotes() {
  notesListEle.textContent = "";
  const sortedNotes = notes.sort(
    (noteA, noteB) => new Date(noteB.lastSave) - new Date(noteA.lastSave)
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
    noteDate.textContent = new Date(note.lastSave).toLocaleString("de-DE");

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
  renderNotes();
}

// neue notiz-btn funktion
newNoteButtonEle.addEventListener("click", () => {
  newTitleEle.value = "";
  newContentEle.value = "";
  document.querySelectorAll(".sidebar-note").forEach((noteDiv) => {
    noteDiv.classList.remove("sidebar-note-active");
  });
});

// notiz auswählen und anzeigen
notesListEle.addEventListener("click", (event) => {
  const clickedNoteId = event.target.closest(".sidebar-note").dataset.id;
  const clickedNote = event.target.closest(".sidebar-note");
  showSelectedNote(clickedNoteId, clickedNote);
});

function showSelectedNote(id, note) {
  const selectedNote = notes.find((note) => note.id === id);
  if (!selectedNote) return;

  document.querySelectorAll(".sidebar-note").forEach((noteDiv) => {
    noteDiv.classList.remove("sidebar-note-active");
  });

  note.classList.add("sidebar-note-active");

  newTitleEle.value = selectedNote.title;
  newContentEle.value = selectedNote.content;
}

// delete-btn funktion
deleteButtonEle.addEventListener("click", () => {
  const activeNote = document.querySelector(".sidebar-note-active");
  if (!activeNote) return;

  const id = activeNote.dataset.id;

  notes = notes.filter((note) => note.id !== id);

  saveToLocalStorage();
  renderNotes();
  newTitleEle.value = "";
  newContentEle.value = "";
});
