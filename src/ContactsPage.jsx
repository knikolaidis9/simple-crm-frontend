// src/ContactsPage.jsx

import React, { useState } from "react";
import { motion } from "framer-motion";
import Contacts from "./Contacts";

function ContactsPage() {
  const [showContacts, setShowContacts] = useState(false);

  return (
    <div className="container">
      <motion.h1
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        Simple Contact Manager
      </motion.h1>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <button
          onClick={() => setShowContacts(!showContacts)}
          className="button"
        >
          {showContacts ? "Hide Contacts" : "Show Contacts"}
        </button>
        {showContacts && <Contacts />}
      </motion.div>
    </div>
  );
}

export default ContactsPage;
