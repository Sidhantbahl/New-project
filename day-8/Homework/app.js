firebase.auth().onAuthStateChanged(function (user) {
  if (user) {
    document.getElementById("registrationPage").style.display = "none";
    document.getElementById("welcomePage").style.display = "none";
    document.getElementById("taskListPage").style.display = "block";
    document.getElementById("loginPage").style.display = "none";
    
    
    var displayName = user.displayName;
    var email = user.email;
    var emailVerified = user.emailVerified;
    var photoURL = user.photoURL;
    var isAnonymous = user.isAnonymous;
    var uid = user.uid;
    var providerData = user.providerData;

    //Can see email of signed in user on navbar
    document.getElementById("username_loggedIn").innerHTML = "Hi " + email ;
    document.getElementById("addBtn").addEventListener("click", (e) => {
      const taskInputElement = document.getElementById("task");
      const taskTitle = taskInputElement.value;
      const existingTaskId = taskInputElement.getAttribute("data-task-id");
      const priority = document.getElementById("priority").value;
      const uid = user.uid;

      if (existingTaskId) {
        taskListPage.saveTaskTitle(existingTaskId, taskTitle);
      } else {
        taskListPage.addTask(taskTitle, priority, uid);
      }
    });

    // ...
  } else {
    // User is signed out.
    // ...
  }
});

document.getElementById("taskListPage").style.display = "none";
document.getElementById("loginPage").style.display = "none";
document.getElementById("registrationPage").style.display = "none";

document.getElementById("register").addEventListener("click", () => {
  document.getElementById("registrationPage").style.display = "block";
  document.getElementById("welcomePage").style.display = "none";
  document.getElementById("taskListPage").style.display = "none";
  document.getElementById("loginPage").style.display = "none";
});

document.getElementById("signUp").addEventListener("click", () => {
  const email = document.getElementById("email").value;
  const passsword = document.getElementById("password").value;

  firebase
    .auth()
    .createUserWithEmailAndPassword(email, passsword)
    .then((user) => {
      if (user) {
        document.getElementById("registrationPage").style.display = "none";
        document.getElementById("welcomePage").style.display = "none";
        document.getElementById("taskListPage").style.display = "none";
        document.getElementById("loginPage").style.display = "block";
        console.log("Once a user has been created", user);
      }
    })
    .catch((err) => {
      console.log(err);
    });
});

document.getElementById("toLogIn").addEventListener("click", () => {
  document.getElementById("registrationPage").style.display = "none";
  document.getElementById("welcomePage").style.display = "none";
  document.getElementById("taskListPage").style.display = "none";
  document.getElementById("loginPage").style.display = "block";
});

document.getElementById("logIn").addEventListener("click", () => {
  const email = document.getElementById("emailLogIn").value;
  const password = document.getElementById("passwordLogIn").value;

  firebase
    .auth()
    .signInWithEmailAndPassword(email, password)
    .then(() => {
      document.getElementById("registrationPage").style.display = "none";
      document.getElementById("welcomePage").style.display = "none";
      document.getElementById("taskListPage").style.display = "block";
      document.getElementById("loginPage").style.display = "none";
    })
    .catch(function (error) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      // ...
    });
});

class Task {
  constructor(id, title, priorityId, userId) {
    this.id = id;
    this.title = title;
    this.priorityId = priorityId;
    this.userId = userId;
    // this.priority = priority;
    // this.priorityId = "";
    this.priority = {};
  }
}

class TaskListPage {
  constructor() {
    this.tasks = [];
    this.priorities = [];

    firebase
      .database()
      .ref("priorities")
      .once("value", (snapshot) => {
        const allPris = snapshot.val();
        // console.log(allPris);

        Object.keys(allPris).forEach((priorityId) => {
          const priorityData = allPris[priorityId];
          // console.log(priorityData);
          this.priorities.push(priorityData);
        });
        // console.log(this.priorities);
      });

    firebase
      .database()
      .ref("tasks")
      .once("value", (snapshot) => {
        const allTasks = snapshot.val();
        // console.log(allTasks);
        Object.keys(allTasks).forEach((taskId) => {
          const taskData = allTasks[taskId];
          const task = new Task(taskId, taskData.title, taskData.priority);
          // console.log(task);
          // console.log(taskData.priority);
          this.tasks.push(task);

          const taskListElement = document.getElementById("taskList");
          const row = document.createElement("tr");
          row.setAttribute("data-task-id", task.id);
          row.innerHTML = `
        <td>${task.title}</td>
        <td><button data-action="edit" data-task-id="${task.id}" class="btn btn-primary mr-3">Edit</button><button data-action="delete" data-task-id="${task.id}" class="btn btn-danger">Delete</button></td>
        <td><span class="badge badge-primary">${taskData.priority}</span></td>
        `;
          taskListElement.appendChild(row);
          document.getElementById("task").value = "";
        });
        // console.log(this.tasks);
      });
  }

  addTask(title, priorityName, userId) {
    // const taskId = this.tasks.length + 1;

    const newTaskSnapshot = firebase.database().ref("tasks").push({
      title: title,
      priority: priorityName,
      userId: userId,
    });

    const taskId = newTaskSnapshot.key;

    const priority = this.priorities.filter((obj) => {
      return obj.name === priorityName;
    });
    // console.log(priority);

    const task = new Task(taskId, title, priorityName, "unique key");
    this.tasks.push(task);
    // console.log(task);

    const taskListElement = document.getElementById("taskList");
    const row = document.createElement("tr");
    row.setAttribute("data-task-id", task.id);
    row.innerHTML = `
    <td>${task.title}</td>
    <td><button data-action="edit" data-task-id="${task.id}" class="btn btn-primary mr-3">Edit</button><button data-action="delete" data-task-id="${task.id}" class="btn btn-danger">Delete</button></td>
    <td><span class="badge badge-primary">${priorityName}</span></td>
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

    firebase.database().ref("tasks").child(taskId).set(task);

    const existingRow = document.querySelector(`tr[data-task-id="${task.id}"]`);
    if (!existingRow) return;

    existingRow.children[0].innerHTML = task.title;
    const taskInput = document.getElementById("task");
    taskInput.removeAttribute("data-task-id");
    taskInput.value = "";
    document.getElementById("addBtn").innerText = "Add";
  }

  deleteTask(taskId, row) {
    const task = this.tasks.find((task) => task.id == taskId);
    if (!task) return;

    firebase.database().ref("tasks").child(taskId).remove();

    row.remove();
  }
}

const taskListPage = new TaskListPage();

document.getElementById("taskList").addEventListener("click", (e) => {
  const action = e.target.getAttribute("data-action");
  const taskId = e.target.getAttribute("data-task-id");

  if (action === "edit") {
    taskListPage.startEdittingTask(taskId);
  } else if (action === "delete") {
    const row = e.target.parentElement.parentElement;
    taskListPage.deleteTask(taskId, row);
  }
});

document.getElementById("logout").addEventListener("click", () => {
  firebase
    .auth()
    .signOut()
    .then(() => {
      console.log("Signout successful!");
      document.getElementById("registrationPage").style.display = "none";
      document.getElementById("welcomePage").style.display = "block";
      document.getElementById("taskListPage").style.display = "none";
      document.getElementById("loginPage").style.display = "none";
    }).catch(err => {
      console.log(err);
    })
});
  