const fs = require("node:fs/promises");
const path = require("node:path");
const crypto = require("node:crypto");

const contactsPath = path.join(__dirname, "db", "contacts.json");

//  Read File
async function read() {
  const data = await fs.readFile(contactsPath, "utf-8");

  return JSON.parse(data);
}

//  Write File
async function write(data) {
  return await fs.writeFile(contactsPath, JSON.stringify(data));
}

//------------------------------------------

//  Возвращает массив контактов.
async function listContacts() {
  const data = await read();

  return data;
}

// Возвращает объект контакта с таким id. Возвращает null, если объект с таким id не найден.
async function getContactById(id) {
  const data = await read();
  const result = data.find((contact) => contact.id === id);

  return result || null;
}

// Возвращает объект удаленного контакта. Возвращает null, если объект с таким id не найден.
async function removeContact(contactId) {
  const data = await read();

  const index = data.findIndex((contact) => contact.id === contactId);

  if (index === -1) {
    return null;
  }

  const newContacts = [...data.slice(0, index), ...data.slice(index + 1)];

  await write(newContacts);

  return data[index];
}

// Возвращает объект добавленного контакта.
async function addContact(name, email, phone) {
  const data = await read();

  const id = crypto.randomUUID();
  const newContact = { name, email, phone, id };

  const isExist = data.some((contact) => contact.id === id);
  if (isExist) {
    throw new Error(`Contact with id: ${id} already exist`);
  }

  data.push(newContact);

  await write(data);

  return newContact;
}

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
};
