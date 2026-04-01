document.addEventListener('DOMContentLoaded', () => {
    const tableBody = document.getElementById('task-table-body');

    function renderTasks() {
        if (tableBody) {
            tableBody.innerHTML = '';
        } else {
            return;
        }

        const tasks = JSON.parse(localStorage.getItem('yallado_tasks')) || [];

        if (tasks.length === 0) {
            tableBody.innerHTML = '<tr><td colspan="6" style="text-align:center; padding: 20px;">No tasks found. Click "Create New Task" to add one!</td></tr>';
            return;
        }

        tasks.forEach((task, index) => {
            const row = document.createElement('tr');
            const priorityClass = task.priority ? task.priority.toLowerCase() : 'low';

            row.innerHTML = `
                <td>${task.task_ID || 'N/A'}</td>
                <td>${task.task_title || 'Untitled'}</td>
                <td>${task.teacher_name || 'Unassigned'}</td>
                <td><span class="priority ${priorityClass}">${task.priority || 'Low'}</span></td>
                <td>${task.description || ''}</td>
                <td class="actions-cell">
                    <a href="Edit_Task.html?task_ID=${task.task_ID}" class="btn btn-edit">Edit</a>
                    <button class="btn btn-delete" data-index="${index}" style="cursor:pointer;">Delete</button>
                </td>
            `;
            tableBody.appendChild(row);
        });
        attachDeleteEvents();
    }

    function attachDeleteEvents() {
        const deleteButtons = document.querySelectorAll('.btn-delete');
        deleteButtons.forEach(button => {
            button.addEventListener('click', function() {
                const index = this.getAttribute('data-index');
                if (confirm('Are you sure you want to delete this task?')) {
                    let tasks = JSON.parse(localStorage.getItem('yallado_tasks')) || [];
                    tasks.splice(index, 1); 
                    localStorage.setItem('yallado_tasks', JSON.stringify(tasks));
                    renderTasks(); 
                }
            });
        });
    }

    renderTasks();
});