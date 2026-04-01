document.addEventListener("DOMContentLoaded", () => {

    const loggedEmail = localStorage.getItem("yallado_email") || "";
    const loggedName = localStorage.getItem("yallado_name") || "";
    const main = document.querySelector("main");
    const emptyState = document.getElementById("empty-state");
    const template = document.getElementById("task-card-template");

    document.querySelectorAll(".task-card").forEach(el => {
        if (!el.parentElement.matches("template")) {
            el.remove();
        }
    });

    const allTasks = JSON.parse(localStorage.getItem("yallado_tasks")) || [];

    const completedTasks = allTasks.filter(task => {
        const isMyTask = 
            task.teacher_name === loggedName ||
            task.teacher_email === loggedEmail ||
            (!loggedEmail && !loggedName);
        return isMyTask && task.status === "Completed";
    });

    completedTasks.sort((a, b) => 
        (b.completed_at || '') > (a.completed_at || '') ? 1 : -1
    )

    if (completedTasks.length === 0) {
        if (emptyState) emptyState.style.display = "block";
        return;
    }

    completedTasks.forEach((task, i) => {
        const clone = template.content.cloneNode(true);
        const card = clone.querySelector(".task-card")

        card.querySelector(".task-title").textContent = task.task_title || "Untitled Task";
        card.querySelector(".task-id").textContent = task.task_ID || "_";
        card.querySelector(".task-teacher").textContent = task.teacher_name || "_";
        card.querySelector(".task-creator").textContent = task.created_by || "_";
        card.querySelector(".task-date").textContent = task.due_date || "_";

        const priorityBadge = card.querySelector(".task-priority");
        const p = (task.priority || "low").toLowerCase();
        const validPriority     = ['high', 'medium', 'low'].includes(p) ? p : 'low';
        priorityBadge.className = `priority ${validPriority}`;
        priorityBadge.textContent = validPriority.toUpperCase();

        card.style.opacity = "0";
        card.style.transform = "translateY(20px)";
        card.style.transition = `opacity 0.4s ease ${i * 0.1}s, transform 0.4s ease ${i * 0.1}s`;

        main.appendChild(card);

        requestAnimationFrame(() => requestAnimationFrame(() => {
            card.style.opacity   = '1';
            card.style.transform = 'translateY(0)';
        }));
    })
})