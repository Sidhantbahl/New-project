class Contact {
    constructor(name, number, email) {
      this.name = name;
      this.number = number;
      this.email = email;
    }
  }
  
  // UI Class
  class UI {
    addContact(contact) {
      const list = document.getElementById("contact-list");
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${contact.name}</td>
        <td>${contact.number}</td>
        <td>${contact.email}</td>
        <td><a class="delete" style="cursor: pointer;">x</a></td>
      `;
  
      list.appendChild(row);
    }
  
    clearFields() {
      document.getElementById("name").value = "";
      document.getElementById("number").value = "";
      document.getElementById("email").value = "";
    }
  
    deleteContact(target) {
      if (target.className === "delete") {
        target.parentElement.parentElement.remove();
      }
    }
  }
  
  // Event Listeners
  document.getElementById("contact-form").addEventListener("submit", function (e) {
      const name = document.getElementById("name").value;
      const number = document.getElementById("number").value;
      const email = document.getElementById("email").value;
  
      const contact = new Contact(name, number, email);
  
      const ui = new UI();
      ui.addContact(contact);
      ui.clearFields();
  
      e.preventDefault();
    });