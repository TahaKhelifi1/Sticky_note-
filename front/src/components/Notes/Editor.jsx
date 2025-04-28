import React, { useEffect, useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import "./styles/Editor.scss";
import { useNotes } from "../../Context/NoteContext";

const Editor = ({ isEditMode, setIsEditMode }) => {
  const { selectedNote, setSelectedNote, updateNote, addNote, deleteNote } = useNotes();
  const [isSaving, setIsSaving] = useState(false);
  const [isAutoSave, setIsAutoSave] = useState(true); // Toggle for Auto-Save

  const modules = {
    toolbar: [
      [{ font: [] }],
      [{ size: ["small", "normal", "large", "huge"] }],
      ["bold", "italic", "underline"],
      [{ list: "ordered" }, { list: "bullet" }],
      ["link"],
      [{ align: [] }],
      [{ color: [] }, { background: [] }],
      ["blockquote", "code-block"],
    ],
  };

  // Auto-Save when enabled
  useEffect(() => {
    if (!selectedNote || !isAutoSave) return;

    const timeoutId = setTimeout(() => {
      if (selectedNote.id) {
        updateNote(selectedNote.id, selectedNote.title, selectedNote.content);
      } else {
        addNote(selectedNote.title, selectedNote.content);
      }
      setIsSaving(true);
      setTimeout(() => setIsSaving(false), 1000); // Show "Saving..." briefly
    }, 1000); // Auto-save delay

    return () => clearTimeout(timeoutId);
  }, [selectedNote?.title, selectedNote?.content, isAutoSave]);

  // Manual Save Function
  const handleSave = () => {
    if (selectedNote.id) {
      updateNote(selectedNote.id, selectedNote.title, selectedNote.content);
    } else {
      addNote(selectedNote.title, selectedNote.content);
    }
    setIsEditMode(false);
  };

  // Delete Note
  const handleDelete = () => {
    deleteNote(selectedNote.id);
    setSelectedNote(null);
  };

  if (!selectedNote) {
    return <div className="editor">Select a note to start editing.</div>;
  }

  return (
    <div className="editor">
      <div className="mode-buttons">
        <button className="toggle-save-mode" onClick={() => setIsAutoSave(!isAutoSave)}>
          {isAutoSave ? "Switch to Manual Save" : "Switch to Auto Save"}
        </button>
        {!isEditMode && (
          <div className="btns">
            <button className="edit-button" onClick={() => setIsEditMode(true)}>Edit</button>
            <button className="delete-button" onClick={handleDelete}>Delete</button>
          </div>
        )}
        {isEditMode && !isAutoSave && (
          <button className="save-button alone" onClick={handleSave}>Save</button>
        )}

        {isEditMode && isAutoSave && (
          <button className="edit-button alone" onClick={()=>setIsEditMode(false)}>Go Back</button>
        )}
      </div>

      {isSaving && isAutoSave && <div className="saving-indicator">Saving...</div>}

      {isEditMode ? (
        <div className="editor-content">
          <input
            type="text"
            value={selectedNote.title}
            onChange={(e) => setSelectedNote({ ...selectedNote, title: e.target.value })}
            placeholder="Enter title"
            className="title-input"
          />
          <ReactQuill
            value={selectedNote.content}
            onChange={(content) => setSelectedNote({ ...selectedNote, content })}
            placeholder="Write your note here..."
            className="content-editor"
            theme="snow"
            modules={modules}
          />
        </div>
      ) : (
        <div className="read-only-content">
          <h2>{selectedNote.title}</h2>
          <div className="note-content" dangerouslySetInnerHTML={{ __html: selectedNote.content }} />
        </div>
      )}
    </div>
  );
};

export default Editor;
