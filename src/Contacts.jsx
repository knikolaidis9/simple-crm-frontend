// src/Contacts.jsx

import React, { useState, useEffect } from "react";
import axios from "axios";
import { ClipLoader } from "react-spinners";
import { motion, AnimatePresence } from "framer-motion";

function Contacts() {
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [contacts, setContacts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [fieldErrors, setFieldErrors] = useState({});
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [newContact, setNewContact] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [currentContact, setCurrentContact] = useState({
    id: null,
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
  });

  useEffect(() => {
    // Fetch contacts from API
    setIsLoading(true); // Start loading
    axios
      .get("http://localhost:7126/api/Contacts")
      .then((response) => {
        setContacts(response.data); // Set contacts to state
        setIsLoading(false); // End loading
      })
      .catch((error) => {
        console.error("Error fetching contacts:", error);
        setIsLoading(false); // End loading even if there is an error
      });
  }, []);

  if (isLoading) {
    // Render the ClipLoader when contacts are being fetched
    return (
      <div className="loader-container">
        <ClipLoader color="#007bff" />
      </div>
    );
  }

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  const fetchContacts = () => {
    axios
      .get("http://localhost:7126/api/Contacts")
      .then((response) => {
        setContacts(
          response.data.sort((a, b) => a.firstName.localeCompare(b.firstName))
        );
        setError("");
      })
      .catch((error) => {
        setError("Error fetching contacts");
      });
  };

  const handleAddContact = (e) => {
    e.preventDefault();
    if (!validateForm(newContact)) return;
    axios
      .post("http://localhost:7126/api/Contacts", newContact)
      .then((response) => {
        fetchContacts();
        setNewContact({ firstName: "", lastName: "", email: "", phone: "" });
        setSuccessMessage("Contact added successfully");
        setError("");
      })
      .catch((error) => {
        setError("Error adding contact");
      });
  };

  const handleEditClick = (contact) => {
    setIsEditing(true);
    setCurrentContact({ ...contact });
  };

  const handleUpdateContact = (e) => {
    e.preventDefault();
    if (!validateForm(currentContact)) return;
    axios
      .put(
        `http://localhost:7126/api/Contacts/${currentContact.id}`,
        currentContact
      )
      .then((response) => {
        fetchContacts();
        setIsEditing(false);
        setCurrentContact({
          id: null,
          firstName: "",
          lastName: "",
          email: "",
          phone: "",
        });
        setSuccessMessage("Contact updated successfully");
        setError("");
      })
      .catch((error) => {
        setError("Error updating contact");
      });
  };

  const handleDeleteContact = (id) => {
    axios
      .delete(`http://localhost:7126/api/Contacts/${id}`) 
      .then((response) => {
        fetchContacts();
        setSuccessMessage("Contact deleted successfully");
        setError("");
      })
      .catch((error) => {
        setError("Error deleting contact");
      });
  };

  const validateForm = (contact) => {
    const errors = {};
    if (!contact.firstName.trim()) errors.firstName = "First name is required";
    if (!contact.lastName.trim()) errors.lastName = "Last name is required";
    if (!contact.email.trim()) errors.email = "Email is required";
    else if (!emailPattern.test(contact.email))
      errors.email = "Email is invalid";
    if (!contact.phone.trim()) errors.phone = "Phone is required";

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const renderErrorMessage = (fieldName) => {
    return fieldErrors[fieldName] ? (
      <p className="error-message">{fieldErrors[fieldName]}</p>
    ) : null;
  };

  return (
    <div className={`container ${isDarkMode ? "theme-dark" : "theme-light"}`}>
      <button onClick={toggleTheme} className="toggle-theme">
        {isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
      </button>
      <h1>Contacts</h1>
      <AnimatePresence>
        {error && (
          <motion.p
            style={{ color: "red" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {error}
          </motion.p>
        )}
        {successMessage && (
          <motion.p
            style={{ color: "green" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {successMessage}
          </motion.p>
        )}
      </AnimatePresence>
      <form onSubmit={handleAddContact}>
        <div className="form-group">
          <input
            type="text"
            value={newContact.firstName}
            onChange={(e) =>
              setNewContact({ ...newContact, firstName: e.target.value })
            }
            placeholder="First Name"
            className={`input ${fieldErrors.firstName ? "input-error" : ""}`}
          />
          {renderErrorMessage("firstName")}
          <input
            type="text"
            value={newContact.lastName}
            onChange={(e) =>
              setNewContact({ ...newContact, lastName: e.target.value })
            }
            placeholder="Last Name"
            className={`input ${fieldErrors.lastName ? "input-error" : ""}`}
          />
          {renderErrorMessage("lastName")}
          <input
            type="email"
            value={newContact.email}
            onChange={(e) =>
              setNewContact({ ...newContact, email: e.target.value })
            }
            placeholder="Email"
            className={`input ${fieldErrors.email ? "input-error" : ""}`}
          />
          {renderErrorMessage("email")}
          <input
            type="tel"
            value={newContact.phone}
            onChange={(e) =>
              setNewContact({ ...newContact, phone: e.target.value })
            }
            placeholder="Phone"
            className={`input ${fieldErrors.phone ? "input-error" : ""}`}
          />
          {renderErrorMessage("phone")}
        </div>
        <button type="submit">Add Contact</button>
      </form>

      {isEditing ? (
        <form onSubmit={(e) => e.preventDefault()}>
          <input
            type="text"
            value={currentContact.firstName}
            onChange={(e) =>
              setCurrentContact({
                ...currentContact,
                firstName: e.target.value,
              })
            }
          />
          <input
            type="text"
            value={currentContact.lastName}
            onChange={(e) =>
              setCurrentContact({ ...currentContact, lastName: e.target.value })
            }
          />
          <button onClick={handleUpdateContact}>Update Contact</button>
        </form>
      ) : (
        <ul>
          {contacts.map((contact) => (
            <li key={contact.id}>
              {contact.firstName} {contact.lastName}
              <button
                className="edit-button"
                onClick={() => handleEditClick(contact)}
              >
                Edit
              </button>
              <button
                className="delete-button"
                onClick={() => handleDeleteContact(contact.id)}
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}
      <ul>
        <AnimatePresence>
          <ul>
            {contacts.map((contact) => (
              <motion.li
                key={contact.id}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className="motion-enter-active"
              >
                {contact.firstName} {contact.lastName}
                {/* ... more contact information and buttons ... */}
              </motion.li>
            ))}
          </ul>
        </AnimatePresence>
      </ul>
    </div>
  );
}

export default Contacts;
