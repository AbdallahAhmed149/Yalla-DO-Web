document.addEventListener("DOMContentLoaded", () => {

    const loggedEmail = localStorage.getItem("yallado_email") || "";
    const loggedName = localStorage.getItem("yallado_name") || "";
    const main = document.querySelector("main");

    const urlParams = new URLSearchParams(window.location.search);
    const focusedTaskID = urlParams.get("task_ID");
    const priorityFilter = urlParams.get("priority");

    function showToast(message, type = "success") {
        const existing = document.querySelector(".td-toast");
        if (existing) existing.remove();

        const toast = document.createElement("div");
        toast.className = `td-toast ${type}`;
        toast.textContent = message;
    
        document.body.appendChild(toast);
        setTimeout(() => toast.remove(), 3000);
    }

    function buildCard(task) {
        const template = document.getElementById("task-card-template")
        const clone = template.content.cloneNode(true);
        const card = clone.querySelector(".task-card");

        card.dataset.taskId = task.task_ID;

        card.querySelector('.task-title').textContent = task.task_title || 'Untitled Task';
        card.querySelector('.task-id-val').textContent = task.task_ID || '—';
        card.querySelector('.task-teacher-val').textContent = task.teacher_name || '—';
        card.querySelector('.task-creator-val').textContent = task.created_by || '—';
        card.querySelector('.task-due-val').textContent = task.due_date || '—';

        const p = (task.priority || 'low').toLowerCase();
        const priorityBadge = document.createElement('span');
        priorityBadge.className = `priority ${p}`;
        priorityBadge.textContent = (task.priority || 'Low').toUpperCase();
        card.querySelector('.priority-container').appendChild(priorityBadge);

        if (task.description) {
            const descContainer = card.querySelector(".task-desc-container");
            descContainer.classList.remove("hidden");
            card.querySelector('.task-desc-val').textContent = task.description;
        }

        const btnComplete = card.querySelector(".btn-complete");
        btnComplete.dataset.taskId = task.task_ID;
        btnComplete.addEventListener('click', () => {
            markComplete(task.task_ID, card);
        });

        return card;
    }

    function markComplete(taskID, cardEl) {
        let tasks = JSON.parse(localStorage.getItem("yallado_tasks")) || [];
        const idx = tasks.findIndex(t => t.task_ID == taskID);

        if (idx === -1) {
            showToast('Task not found ❌', 'error');
            return;
        }

        tasks[idx].status = "Completed";
        tasks[idx].completed_at = new Date().toLocaleString();
        localStorage.setItem('yallado_tasks', JSON.stringify(tasks));

        showToast('Task marked as completed ✅');

        cardEl.style.transition = "opacity 0.4s ease, transform 0.4s ease";
        cardEl.style.opacity = "0";
        cardEl.style.transform = 'translateX(60px)';

        setTimeout(() => {
            cardEl.remove();
            const remaining = main.querySelectorAll(".task-card");
            if (remaining.length === 0) renderAllDone();
        }, 450)
    }

    function renderAllDone() {
        const old = document.getElementById("td-empty");
        if (old) old.remove();

        const template = document.getElementById("empty-state-template");
        const clone = template.content.cloneNode(true);
        main.appendChild(clone);
    }

    document.querySelectorAll('.task-card').forEach(el => el.remove());

    const allTasks = JSON.parse(localStorage.getItem("yallado_tasks")) || [];
    let tasksToShow = [];

    if (focusedTaskID) {
        const focusedTask = allTasks.find(t => t.task_ID === focusedTaskID);

        if (focusedTask && focusedTask.status !== 'Completed') {
            // Show ALL active tasks matching that priority (for that teacher)
            const p = priorityFilter || focusedTask.priority;
            tasksToShow = allTasks.filter(t => {
                const isMyTask =
                    t.teacher_name  === loggedName  ||
                    t.teacher_email === loggedEmail ||
                    (!loggedEmail && !loggedName);
                return isMyTask &&
                       t.status !== 'Completed' &&
                       t.priority?.toLowerCase() === p?.toLowerCase();
            });
            // Put the focused task first
            tasksToShow.sort((a, b) =>
                a.task_ID === focusedTaskID ? -1 :
                b.task_ID === focusedTaskID ?  1 : 0
            );
        }
        
    } else {
        tasksToShow = allTasks.filter(t => {
            const isMyTask = 
                t.teacher_name === loggedName ||
                t.teacher_email === loggedEmail ||
                (!loggedEmail && !loggedName);
            return isMyTask && t.status !== "Completed";
        })
    }

    if (tasksToShow.length === 0) {
        renderAllDone();
        return;
    }

    tasksToShow.forEach((task, i) => {
        const card = buildCard(task);
        card.style.opacity   = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = `opacity 0.4s ease ${i * 0.1}s, transform 0.4s ease ${i * 0.1}s`;
        main.appendChild(card);

        requestAnimationFrame(() => requestAnimationFrame(() => {
            card.style.opacity = "1";
            card.style.transform = "translateY(0)";
        }));
    });

    if (focusedTaskID) {
        setTimeout(() => {
            const el = document.querySelector(`[data-task-id="${focusedTaskID}"]`);
            if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 500);
    }

})