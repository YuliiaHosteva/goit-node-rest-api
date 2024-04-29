import * as fs from "node:fs/promises";
import path from "node:path";
import { nanoid } from 'nanoid';

const contactsPath = path.resolve("db", 'contacts.json');

async function listContacts() {
  const data = await fs.readFile(contactsPath, 'utf-8');
  return JSON.parse(data);
}

async function getContactById(contactId) {
  const contacts = await listContacts();
  return contacts.find(contact => contact.id === contactId) || null;
}

async function removeContact(contactId) {
  const contacts = await listContacts();
  const updatedContacts = contacts.filter(contact => contact.id !== contactId);
  await fs.writeFile(contactsPath, JSON.stringify(updatedContacts, null, 2));
  return contacts.find(contact => contact.id === contactId) || null;
}

async function saveContacts(contacts) {
  await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));
}

async function addContact(name, email, phone) {
  const contacts = await listContacts();
  const newContact = { id: nanoid(), name, email, phone };
  contacts.push(newContact);
  await saveContacts(contacts);
  return newContact;
}

async function updateContactId(contactId, contactData) {
  const contacts = await listContacts();
  const contactIndex = contacts.findIndex(contact => contact.id === contactId);

  if (contactIndex === -1) return null;

  const updatedContact = { ...contacts[contactIndex], ...contactData };
  contacts[contactIndex] = updatedContact;

  await saveContacts(contacts);
  return updatedContact;
}

export { listContacts, getContactById, removeContact, addContact, updateContactId };
