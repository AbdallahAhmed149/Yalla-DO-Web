document.addEventListener("DOMContentLoaded", () => {

    const loggedEmail = localStorage.getItem("yallado_email") || '';
    const loggedName = localStorage.getItem("yallado_name")   || '';

    const greeting = document.querySelector("main h2");
    if (greeting && loggedName) {
        greeting.textContent = `Hello, ${loggedName}! 👋`;
    }

    function getContainer() {
        return document.getElementById("task-list-container");
    }

    function priorityBadge(priority) {
        const p = (priority || "low").toLowerCase();
        return `<span class="badge badge-${p}">${priority || 'Low'}</span>`;
    }

    function getTasksByPriority(priorityFilter) {
        const allTasks = JSON.parse(localStorage.getItem("yallado_tasks")) || [];
        return allTasks.filter(task => {
            const isMyTask =
                task.teacher_name  === loggedName  ||
                task.teacher_email === loggedEmail ||
                (!loggedEmail && !loggedName);
            
            return isMyTask && task.status !== "Completed" && task.priority?.toLowerCase() === priorityFilter.toLowerCase();
        });
    }

    function renderCards(tasks, priorityFilter) {
        const container = getContainer();
        container.innerHTML = "";

        if (tasks.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <div class="empty-state-icon">🔍</div>
                    <p class="empty-state-title">
                        No <span style="text-transform:capitalize;">${priorityFilter}</span> priority tasks found.
                    </p>
                    <p class="empty-state-text">
                        Try searching for High, Medium, or Low.
                    </p>
                </div>`;
            return;
        }

        tasks.forEach((task, i) => {
            const card = document.createElement("div");
            card.className = "task-card";
            

            card.style.transition = `
                opacity 0.35s ease ${i * 0.08}s,
                transform 0.35s ease ${i * 0.08}s,
                box-shadow 0.25s ease
            `;

            card.innerHTML = `
                <div class="task-header">
                    <h3 class="task-title">${task.task_title || 'Untitled Task'}</h3>
                    <span class="task-status">🔄 Ongoing</span>
                </div>
                <div class="task-grid">
                    <div>
                        <span class="task-label">Task ID:</span>
                        <span class="task-value">${task.task_ID || '—'}</span>
                    </div>
                    <div>
                        <span class="task-label">Subject:</span>
                        <span class="task-value">${task.subject || '—'}</span>
                    </div>
                    <div>
                        <span class="task-label">Priority:</span>
                        <span class="task-value-wrapper">${priorityBadge(task.priority)}</span>
                    </div>
                    <div>
                        <span class="task-label">Created by:</span>
                        <span class="task-value">${task.created_by || '—'}</span>
                    </div>
                    <div>
                        <span class="task-label">Grade:</span>
                        <span class="task-value">${task.grade || '—'}</span>
                    </div>
                    <div>
                        <span class="task-label">Status:</span>
                        <span class="task-value">Ongoing</span>
                    </div>
                </div>
                <div class="task-footer">
                    <a href="Task_details.html?task_ID=${encodeURIComponent(task.task_ID)}&priority=${encodeURIComponent(priorityFilter)}" class="btn-details">
                        📋 View Details →
                    </a>
                </div>
            `;

            container.appendChild(card);

            requestAnimationFrame(() => requestAnimationFrame(() => {
                card.style.opacity = "1";
                card.style.transform = "translateY(0)";
            }))
        })
    }

    const form = document.querySelector("form");
    const searchInput = document.getElementById("search");
    if (!form || !searchInput) return;

    form.addEventListener("submit", (e) => {
        e.preventDefault();
        const query = searchInput.value.trim();

        if (!query) {
            getContainer().innerHTML = `
                <div class="empty-state">
                    <p class="empty-state-title">
                        Please type High, Medium, or Low to search your tasks.
                    </p>
                </div>`;
            return;
        }

        renderCards(getTasksByPriority(query), query);
    });

    searchInput.addEventListener("change", () => {
        const query = searchInput.value.trim();
        if (query) renderCards(getTasksByPriority(query), query);
    });
});