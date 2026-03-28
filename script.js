
let currentFilter = 'all'; 
const taskGrid = document.getElementById('task-grid');
const searchInput = document.getElementById('search-input');
const modalOverlay = document.getElementById('modal-overlay');
const addTaskBtn = document.getElementById('add-task-btn');
const closeModalX = document.getElementById('close-modal-x');
const cancelModal = document.getElementById('cancel-modal');
const addTaskForm = document.getElementById('add-task-form');
const mobileMenuBtn = document.getElementById('mobile-menu-btn');
const mobileMenu = document.getElementById('mobile-menu');
const sortMenuBtn = document.getElementById('sort-menu-btn');
const sortDropdown = document.getElementById('sort-dropdown');
const sortOptions = document.querySelectorAll('.sort-option');

let tasks = [
    { id: 1, name: "Write unit tests", desc: "Cover auth and payment modules with tests.", priority: "medium", status: "done", date: "2026-03-02" },
    { id: 2, name: "Update dependencies", desc: "Bump all packages to latest stable versions.", priority: "low", status: "done", date: "2026-03-03" },
    { id: 3, name: "Implement dark mode", desc: "Add theme toggle with CSS custom properties.", priority: "medium", status: "done", date: "2026-03-04" },
    { id: 4, name: "Set up CI/CD pipeline", desc: "Configure GitHub Actions for auto deploy.", priority: "medium", status: "done", date: "2026-03-05" },
    { id: 5, name: "Create user dashboard", desc: "Build the analytics dashboard for end users.", priority: "high", status: "in-progress", date: "2026-03-06" },
    { id: 6, name: "Performance audit", desc: "Run Lighthouse and fix critical issues.", priority: "medium", status: "in-progress", date: "2026-03-07" },
    { id: 7, name: "Fix login redirect bug", desc: "Users are redirected to 404 after OAuth login.", priority: "high", status: "in-progress", date: "2026-03-08" },
    { id: 8, name: "Database migration", desc: "Migrate user table to new schema.", priority: "high", status: "todo", date: "2026-03-09" }
];

//render function
function renderTasks(filter = 'all', searchTerm = '') {
    updateStats();
    taskGrid.innerHTML = '';

    const filteredTasks = tasks.filter(task => {
        const matchesStatus = filter === 'all' || task.status === filter;
        const matchesSearch = task.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            task.desc.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesStatus && matchesSearch;
    });

    if (filteredTasks.length === 0) {
        taskGrid.innerHTML = `
            <div class="col-span-full flex flex-col items-center justify-center py-20 animate-fadeIn text-center">
                <div class="mb-4 p-4 bg-gray-50 rounded-full inline-block">
                    <svg xmlns="http://www.w3.org/2000/svg" class="w-12 h-12 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                </div>
                <p class="text-gray-500 font-medium text-lg">No tasks found in this category.</p>
            </div>`;
        return;
    }

    filteredTasks.forEach(task => {
        const card = document.createElement('div');
        
        const priorityClass = task.priority === 'high' ? 'bg-red-50 text-red-600 border-red-100' : 
                            task.priority === 'medium' ? 'bg-orange-50 text-orange-600 border-orange-100' : 
                            'bg-green-50 text-green-600 border-green-100';
                            
        const statusClass = 
            task.status === 'done' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 
            task.status === 'in-progress' ? 'bg-blue-50 text-blue-600 border-blue-100' : 
            'bg-slate-100 text-slate-600 border-slate-200';

        const displayStatus = task.status === 'done' ? 'Completed' : 
                             task.status === 'in-progress' ? 'In Progress' : 'To Do';

        let buttonText = task.status === 'todo' ? "Mark In Progress" : 
                         task.status === 'in-progress' ? "Mark Completed" : "Undo";

        card.className = "task-card bg-white p-5 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all group animate-fadeIn";
        card.innerHTML = `
            <div class="flex justify-between items-start mb-3">
                <h4 class="font-bold text-gray-800 ${task.status === 'done' ? 'line-through opacity-40' : ''}">${task.name}</h4>
                <button onclick="deleteTask(${task.id})" class="p-1.5 rounded-md text-gray-400 hover:text-red-600 hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-all">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                </button>
            </div>
            <p class="text-sm text-gray-500 mb-5 leading-relaxed">${task.desc}</p>
            <div class="flex flex-wrap gap-2 mb-5">
                <span class="px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider border ${priorityClass}">${task.priority}</span>
                <span class="px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider border ${statusClass}">${displayStatus}</span>
            </div>
            <div class="flex justify-between items-center pt-4 border-t border-gray-50">
                <span class="text-xs text-gray-400 font-medium">${task.date}</span>
                <button onclick="toggleStatus(${task.id})" class="text-xs font-bold bg-gray-700 text-slate-100 rounded-lg px-4 py-2 hover:bg-black transition-colors shadow-sm">
                    ${buttonText}
                </button>
            </div>
        `;
        taskGrid.appendChild(card);
    });
}

//stats logic
function updateStats() {
    const today = new Date().toISOString().split('T')[0];
    const stats = {
        total: tasks.length,
        progress: tasks.filter(t => t.status === 'in-progress').length,
        completed: tasks.filter(t => t.status === 'done').length,
        overdue: tasks.filter(t => t.date < today && t.status !== 'done').length
    };

    document.getElementById('total-tasks-count').textContent = stats.total;
    document.getElementById('in-progress-count').textContent = stats.progress;
    document.getElementById('completed-count').textContent = stats.completed;
    document.getElementById('overdue-count').textContent = stats.overdue;
}

//actio functions
function deleteTask(id) {
    tasks = tasks.filter(task => task.id !== id);
    renderTasks(currentFilter, searchInput.value);
}

function toggleStatus(id) {
    const task = tasks.find(t => t.id === id);
    if (task) {
        if (task.status === 'todo') task.status = 'in-progress';
        else if (task.status === 'in-progress') task.status = 'done';
        else if (task.status === 'done') task.status = 'todo';
        renderTasks(currentFilter, searchInput.value);
    }
}

//event listeners
const filterBtns = document.querySelectorAll('.filter-btn');

filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        filterBtns.forEach(b => {
            b.classList.remove('border-b-2', 'border-black', 'text-black');
            b.classList.add('text-gray-400');
        });
        btn.classList.add('border-b-2', 'border-black', 'text-black');
        btn.classList.remove('text-gray-400');
        currentFilter = btn.getAttribute('data-filter');
        renderTasks(currentFilter, searchInput ? searchInput.value : '');
    });
});


//Modal Logic
if(addTaskBtn) {
    addTaskBtn.addEventListener('click', () => {
        modalOverlay.classList.remove('hidden');
        modalOverlay.classList.add('flex');
    });
}

function hideModal() {
    modalOverlay.classList.add('hidden');
    modalOverlay.classList.remove('flex');
    addTaskForm.reset();
}

closeModalX.addEventListener('click', hideModal);
cancelModal.addEventListener('click', hideModal);
modalOverlay.addEventListener('click', (e) => { if (e.target === modalOverlay) hideModal(); });

//Form Submit
addTaskForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const newTask = {
        id: Date.now(),
        name: document.getElementById('task-name').value,
        desc: document.getElementById('task-desc').value,
        priority: document.getElementById('task-priority').value,
        status: document.getElementById('task-status').value,
        date: document.getElementById('task-date').value || new Date().toISOString().split('T')[0]
    };
    tasks.push(newTask);
    renderTasks(currentFilter, searchInput.value);
    hideModal();
});

//Search Logic
if (searchInput) {
    searchInput.addEventListener('input', (e) => {
        renderTasks(currentFilter, e.target.value);
    });
}

//Sort Logic
sortMenuBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    sortDropdown.classList.toggle('hidden');
});

sortOptions.forEach(option => {
    option.addEventListener('click', () => {
        const sortBy = option.getAttribute('data-sort');
        if (sortBy === 'date') tasks.sort((a, b) => new Date(a.date) - new Date(b.date));
        else if (sortBy === 'priority') {
            const map = { 'high': 1, 'medium': 2, 'low': 3 };
            tasks.sort((a, b) => map[a.priority] - map[b.priority]);
        } 
        else if (sortBy === 'name') tasks.sort((a, b) => a.name.localeCompare(b.name));

        sortDropdown.classList.add('hidden');
        renderTasks(currentFilter, searchInput.value);
    });
});

//Mobile Toggle
if (mobileMenuBtn && mobileMenu) {
    mobileMenuBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        mobileMenu.classList.toggle('hidden');
    });
}

window.addEventListener('click', () => {
    if (sortDropdown) sortDropdown.classList.add('hidden');
    if (mobileMenu && !mobileMenu.classList.contains('hidden')) mobileMenu.classList.add('hidden');
});

//FAQ
document.querySelectorAll('.faq-toggle').forEach(button => {
    button.addEventListener('click', () => {
        button.nextElementSibling.classList.toggle('hidden');
        button.querySelector('svg').classList.toggle('rotate-180');
    });
});

renderTasks();
