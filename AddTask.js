document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('addTaskForm');
    let isSubmitting = false; 

    if (!form) return;

    function showSuccessMessage(message) {
        const messageContainer = document.createElement('div');
        messageContainer.className = 'success-message';
        messageContainer.textContent = message;
        document.body.appendChild(messageContainer);
        setTimeout(() => {
            messageContainer.remove();
        }, 2000);
    }

    form.addEventListener('submit', function (e) {
        e.preventDefault(); 

        if (isSubmitting) return; 
        isSubmitting = true;

        const newTask = {
            time: Date.now(),                   
            task_ID: document.getElementById('task_ID').value.trim(),
            task_title: document.getElementById('task_title').value.trim(),
            teacher_name: document.getElementById('teacher_name').value.trim(),
            subject: document.getElementById('subject').value.trim(),
            grade: document.getElementById('grade').value.trim(),
            priority: document.querySelector('input[name="priority"]:checked').value,   
            description: document.getElementById('description').value.trim(),
            created_by: document.getElementById('created_by').value.trim(),
            created_at: new Date().toLocaleString('ar-EG'),
            status: "Pending"
        };
        
        let tasks = JSON.parse(localStorage.getItem('yallado_tasks')) || [];
        tasks.push(newTask);
        localStorage.setItem('yallado_tasks', JSON.stringify(tasks));
        
        showSuccessMessage('Task created successfully ✅');
        
        setTimeout(() => {
            window.location.href = "Admin_dashboard.html";
        },3000);
    });
});
