class Task {
    constructor(id, title, sortKey = 0) {
      this.id = id;
      this.title = title;
      this.sortKey = sortKey; // If you want to sort... this doesn't work yet
      this.priority = {};
    }
  }
  
  class TaskListPage {
    constructor() {
      this.tasks = [];
      this.priorities = [];
  
      // Hey guys :D 
  
      // const massUpdates = {
      //   '/tasks/some-id-1': {title: "Task 1"},
      //   '/tasks/some-id-2': {title: "Task 2"},
      //   '/tasks/1': {title: "Something cool"}
      // };
  
      // if (task1.something == true) {
      //   massUpdates['/tasks/1'] = {title: "Something cool"};
      // }
  
      // firebase.database().ref().update(massUpdates);
  
      firebase.database().ref("priorities").once("value", (prioritiesSnapshot) => {
        const allPriorities = prioritiesSnapshot.val();
        Object.keys(allPriorities).forEach(priorityId => {
          const priorityData = allPriorities[priorityId];
          const priority = {
            id: priorityId,
            name: priorityData.name,
            color: priorityData.color
          };
          this.priorities.push(priority);
        });
  
        console.log(this.priorities);
  
        firebase
        .database()
        .ref("tasks")
        .once("value", (snapshot) => {
          const allTasks = snapshot.val();
          Object.keys(allTasks).forEach((taskId) => {
            const taskData = allTasks[taskId];
            const task = new Task(taskId, taskData.title);
  
            if (taskData.priorityId) {
              const priority = this.priorities.find(priority => priority.id == taskData.priorityId);
              task.priority = priority;
            }
  
            this.tasks.push(task);
  
            const taskListElement = document.getElementById("taskList");
            const row = document.createElement("tr");
            row.setAttribute("data-task-id", task.id);
            row.innerHTML = `
              <td>${task.title} <span class="badge badge-success">${task.priority.name}</span></td>
              <td>
                <button data-action="edit" data-task-id="${task.id}" class="btn btn-primary">Edit</button>
                <button data-action="delete" data-task-id="${task.id}" class="btn btn-danger">Delete</button>
              </td>
              `;
            taskListElement.appendChild(row);
          });
        });
      })
  
  
    }
  
    addTask(title) {
      // const taskId = this.tasks.length + 1;
      const sortKey = this.tasks.length + 1;
      const newTaskSnapshot = firebase.database().ref('tasks').push({
        title: title,
        sortKey: sortKey
      });
      const taskId = newTaskSnapshot.key;
  
      // const taskId = firebase.database().ref('tasks').push().key;
      // firebase.database().ref('tasks/' + taskId).set({
      //   title: title
      // });
  
      const task = new Task(taskId, title, sortKey);
      this.tasks.push(task);
  
      const taskListElement = document.getElementById("taskList");
      const row = document.createElement("tr");
      row.setAttribute("data-task-id", task.id);
      row.innerHTML = `
        <td>${task.title}</td>
        <td>
          <button data-action="edit" data-task-id="${task.id}" class="btn btn-primary">Edit</button>
          <button data-action="delete" data-task-id="${task.id}" class="btn btn-danger">Delete</button>
        </td>
      `;
      taskListElement.appendChild(row);
      document.getElementById("task").value = "";
    }
  
    startEdittingTask(taskId) {
      for (let k = 0; k < this.tasks.length; k++) {
        if (this.tasks[k].id == taskId) {
          const task = this.tasks[k];
  
          const taskInputElement = document.getElementById("task");
          taskInputElement.value = task.title;
          taskInputElement.setAttribute("data-task-id", task.id);
          document.getElementById("addBtn").innerText = "Save";
        }
      }
    }
  
    saveTaskTitle(taskId, taskTitle) {
      // this.tasks.forEach(function (task) {
      //   if (task.id == taskId) {
      //   }
      // });
  
      // const task = this.tasks.find(function (task) {
      //   if (task.id == taskId) return true;
      // });
  
      const task = this.tasks.find((task) => task.id == taskId);
      if (!task) return;
  
      task.title = taskTitle;
  
      // firebase.database().ref('tasks/' + taskId)
      firebase.database().ref('tasks').child(taskId).set(task);
  
      const existingRow = document.querySelector(`tr[data-task-id="${task.id}"]`);
      if (!existingRow) return;
  
      existingRow.children[0].innerHTML = task.title;
      const taskInput = document.getElementById("task");
      taskInput.removeAttribute("data-task-id");
      taskInput.value = "";
      document.getElementById("addBtn").innerText = "Add";
    }
  
    delete(taskId) {
      const task = this.tasks.find((task) => task.id == taskId);
      if (!task) return;
  
      firebase.database().ref('tasks').child(taskId).remove();
  
      const existingRow = document.querySelector(`tr[data-task-id="${task.id}"]`);
      if (!existingRow) return;
      existingRow.remove();
    }
  }
  
  const taskListPage = new TaskListPage();
  
  document.getElementById("addBtn").addEventListener("click", (e) => {
    const taskInputElement = document.getElementById("task");
    const taskTitle = taskInputElement.value;
  
    const existingTaskId = taskInputElement.getAttribute("data-task-id");
    if (existingTaskId) {
      taskListPage.saveTaskTitle(existingTaskId, taskTitle);
    } else {
      taskListPage.addTask(taskTitle);
    }
  });
  
  document.getElementById("taskList").addEventListener("click", (e) => {
    const action = e.target.getAttribute("data-action");
    const taskId = e.target.getAttribute("data-task-id");
  
    if (action == "edit") {
      taskListPage.startEdittingTask(taskId);
    } else if (action == "delete") {
      taskListPage.delete(taskId);
    }
  
  });
  