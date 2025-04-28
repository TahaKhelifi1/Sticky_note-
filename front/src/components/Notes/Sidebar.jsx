import React from "react";
import "./styles/Sidebar.scss";
import { useNotes } from "../../Context/NoteContext";

const Sidebar = ({ isEditMode }) => {
  const { notes, selectedNote, setSelectedNote, addNote } = useNotes();
  return (
    <div className="sidebar">
      <button
        className="add-note"
        disabled={isEditMode}
        onClick={() => addNote("Untitled Note", "")}
      >
        + Add Note
      </button>
      <ul className={`note-list ${isEditMode ? "no-cursor" : ""}`}>
        {notes.map((note) => (
          <li
            key={note.id}
            className={`note-item ${selectedNote?.id === note.id ? "active" : ""}`}
            onClick={() => setSelectedNote(note)}
          >
            {note.title || "Untitled Note"}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;
