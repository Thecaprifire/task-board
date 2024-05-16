// Retrieve tasks and nextId from localStorage
let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
let nextId =JSON.parse(localStorage.getItem('nextId')) || 1;

// Todo: create a function to generate a unique task id
function generateTaskId() {
  return nextId++;
}

// Todo: create a function to create a task card
function createTaskCard(task) {
  // Create task card HTML dynamically
  const card = `
    <div class="card task-card mb-3" data-id="${task.id}">
      <div class="card-body">
        <h5 class="card-title">${task.title}</h5>
        <p class="card-text">${task.description}</p>
        <p class="card-text">Due: ${task.dueDate}</p>
        <button type="button" class="btn btn-danger btn-sm delete-task">Delete</button>
      </div>
    </div>
  `;
  return card;
}

// Todo: create a function to render the task list and make cards draggable
function renderTaskList() {
  // Clear existing task cards
  $('#todo-cards, #in-progress-cards, #done-cards').empty();

  // Loop through tasks and append cards to respective lanes
  tasks.forEach(task => {
    const card = createTaskCard(task);
    $(`#${task.status}-cards`).append(card);
  });

  // Make task cards draggable
  $('.task-card').draggable({
    revert: true,
    revertDuration: 0
  });
}

// Todo: create a function to handle adding a new task
function handleAddTask(event) {
  event.preventDefault();

  const title = $('#task-title').val().trim();
  const description = $('#task-description').val().trim();
  const dueDate = $('#datepicker').val();

  if (!title || !dueDate) return;

  const newTask = {
    id: generateTaskId(),
    title,
    description,
    dueDate,
    status: 'todo'
  };

  tasks.push(newTask);
  localStorage.setItem('tasks', JSON.stringify(tasks));
  localStorage.setItem('nextId', nextId);

  renderTaskList();

  // Clear input fields and close modal
  $('#task-title, #task-description, #datepicker').val('');
  $('#formModal').modal('hide');
}

// Todo: create a function to handle deleting a task
function handleDeleteTask(event) {
  const taskId = $(event.target).closest('.task-card').data('id');
  tasks = tasks.filter(task => task.id !== taskId);
  localStorage.setItem('tasks', JSON.stringify(tasks));
  renderTaskList();
}

// Todo: create a function to handle dropping a task into a new status lane
function handleDrop(event, ui) {
  const taskId = ui.draggable.data('id');
  const newStatus = $(event.target).closest('.lane').attr('id');
  tasks = tasks.map(task => {
    if (task.id === taskId) {
      task.status = newStatus;
    }
    return task;
  });
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Event listeners
$(document).ready(function () {
  // Initialize datepicker
  $("#datepicker").datepicker({
    changeMonth: true,
    changeYear: true
  });

  // Render task list and make lanes droppable
  renderTaskList();
  $('.lane').droppable({
    accept: '.task-card',
    drop: handleDrop
  });

  // Add task event listener
  $('#formModal').on('submit', handleAddTask);

  // Delete task event listener
  $(document).on('click', '.delete-task', handleDeleteTask);
});
