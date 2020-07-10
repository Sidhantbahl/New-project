class Task {
    constructor(id, title) {
      this.id = id;
      this.title = title;
    }
  }
  
  class TaskListPage {
    constructor() {
      this.tasks = []; // Array of Task instances...
    }
  
    addTask(task) {
      const taskId = this.tasks.length + 1;
      const newTask = new Task(taskId, task);
      this.tasks.push(newTask);
      console.log(this.tasks);
  
      const row = document.createElement("tr");
      row.setAttribute("data-task-id", newTask.id);
      row.innerHTML = `
      <td>${newTask.title}</td>
      <td><button data-action="edit" data-task-id="${newTask.id}">Edit</button></td>
      `;
      document.getElementById("taskList").appendChild(row);
    }
  
    editTask(taskId) {
      for (let k = 0; k < this.tasks.length; k++) {
        if (this.tasks[k].id == taskId) {
          const task = this.tasks[k];
          const taskInput = document.getElementById("task");
          taskInput.value = task.title;
          taskInput.setAttribute("data-task-id", task.id);
        }
      }
    }
  }
  
  const taskListPage = new TaskListPage();
  
  document.getElementById("addBtn").addEventListener("click", (e) => {
    const taskInput = document.getElementById("task");
    const task = taskInput.value;
    taskListPage.addTask(task);
  });
  
  document.getElementById("taskList").addEventListener("click", (e) => {
    const action = e.target.getAttribute("data-action");
    if (!action) {
      console.log("Not interested...");
      return; // Don't do anything
    }
  
    if (action === "edit") {
      const taskId = e.target.getAttribute("data-task-id");
      taskListPage.editTask(taskId);
    }
  });
