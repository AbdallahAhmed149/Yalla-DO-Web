document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('form');
    if (!form) {
        console.error("Form not found!");
        return;
    }

    function showSuccessMessage(message) {
        const messageContainer = document.createElement('div');
        messageContainer.className = 'success-message';
        messageContainer.textContent = message;
        document.body.appendChild(messageContainer);
        setTimeout(() => {
            messageContainer.remove();
        }, 2500);
    }

    function showErrorMessage(message) {
        const messageContainer = document.createElement('div');
        messageContainer.className = 'error-message';
        messageContainer.textContent = message;
        document.body.appendChild(messageContainer);
        setTimeout(() => {
            messageContainer.remove();
        }, 3000);
    }

    const urlParams = new URLSearchParams(window.location.search);
    const taskID = urlParams.get('task_ID');
    if (!taskID) {
        showErrorMessage("The task number has not been specified for editing ❌");
        setTimeout(() => {
            window.history.back();
        }, 1500);
        return;
    }

    let tasks = JSON.parse(localStorage.getItem('yallado_tasks')) || [];
    const taskIndex = tasks.findIndex(task => task.task_ID === taskID);
    if (taskIndex === -1) {
        showErrorMessage("The requested task does not exist ❌");
        setTimeout(() => {
            window.history.back();
        }, 1500);
        return;
    }

    const currentTask = tasks[taskIndex];
    document.getElementById('task_ID').value = currentTask.task_ID;
    document.getElementById('task_title').value = currentTask.task_title || '';
    document.getElementById('teacher_name').value = currentTask.teacher_name || '';
    document.getElementById('subject').value = currentTask.subject || '';
    document.getElementById('grade').value = currentTask.grade || '';
    document.getElementById('description').value = currentTask.description || '';
    document.getElementById('created_by').value = currentTask.created_by || '';

    const priorityRadios = document.querySelectorAll('input[name="priority"]');
    priorityRadios.forEach(radio => {
        if (radio.value === (currentTask.priority || 'low')) {
            radio.checked = true;
        }
    });

    form.addEventListener('submit', function (e) {
        e.preventDefault();
        if (!confirm("Are you sure you want to save these changes?")) {
            return;
        }

        currentTask.task_title = document.getElementById('task_title').value.trim();
        currentTask.teacher_name = document.getElementById('teacher_name').value.trim();
        currentTask.subject = document.getElementById('subject').value.trim();
        currentTask.grade = document.getElementById('grade').value.trim();
        currentTask.priority = document.querySelector('input[name="priority"]:checked')  ? document.querySelector('input[name="priority"]:checked').value  : currentTask.priority || 'low';
        currentTask.description = document.getElementById('description').value.trim();
        currentTask.created_by = document.getElementById('created_by').value.trim();
        currentTask.updated_at = new Date().toLocaleString('ar-EG');

        tasks[taskIndex] = currentTask;
        localStorage.setItem('yallado_tasks', JSON.stringify(tasks));

        showSuccessMessage('Task updated successfully ✅');
        setTimeout(() => {
            window.location.href = "Admin_Dashboard.html";
        }, 1600);
    });

});
