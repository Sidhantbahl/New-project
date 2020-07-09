// ES6 Classes

// Contact Class
class Tasks {
    constructor(task) {
      this.task = task;
    }
  }
  
  // UI Class
  class UI {
    addContact(contact) {
      const list = document.getElementById("contact-list");
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${contact.tasks}</td>
        <td>${contact.edits}</td>
        <td><a class="delete" style="cursor: pointer;">x</a></td>
      `;
  
      list.appendChild(row);
    }
  
    clearFields() {
      document.getElementById("tasks").value = "";
      document.getElementById("edits").value = "";
    }
  
   
  // Event Listeners
  document.getElementById("contact-form").addEventListener("submit", function (e) {
      const tasks = document.getElementById("task").value;
      const contact = new Contact(task);
  
      const ui = new UI();
      ui.addContact(contact);
      ui.clearFields();
  
      e.preventDefault();
    });
  
  