import React, { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import Editor from "./Editor";
import UserProfile from "./UserProfile";
import "./styles/NotesApp.scss";
import { useAuth } from "../../Context/AuthContext";
import { useNotes } from "../../Context/NoteContext";

const NotesApp = () => {
  const { user } = useAuth();
  const {
    notes,
    selectedNote,
    setSelectedNote,
    addNote,
  } = useNotes();
  const [isEditMode, setIsEditMode] = useState(false);
  const [openedProfile,setOpenedProfile] = useState(false);

  const handleAddNote = async() => {
    const newNote = {
      title: "Untitled Note",
      content: "",
    };
    await addNote(newNote.title, newNote.content);
  };

  const handleOpenSide = () => {
    setOpenedProfile(!openedProfile);
  }
  useEffect(()=>{
    setSelectedNote(null);
  },[]);

  return (
    <div className="notes-app">
      <Sidebar
        notes={notes}
        selectedNote={selectedNote}
        setSelectedNote={setSelectedNote}
        handleAddNote={handleAddNote}
        isEditMode={isEditMode}
      />
      <Editor
        selectedNote={selectedNote}
        setSelectedNote={setSelectedNote}
        isEditMode={isEditMode}
        setIsEditMode={setIsEditMode}
      />
      <button className="btn-side" onClick={handleOpenSide}>{openedProfile ? "▶":"◀"}</button>
      <UserProfile
        openedProfile={openedProfile}
        user={user} 
      />
    </div>
  );
};

export default NotesApp;
