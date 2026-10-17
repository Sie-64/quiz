// ================= 1. 初始数据 =================
let questionData = [
    { id: "01", title: "世界上国土面积最大的国家是？", category: "常识", answer: "B" },
    { id: "02", title: "法国的首都是哪里？", category: "常识", answer: "C" },
    { id: "03", title: "HTML 的全称是什么？", category: "HTML", answer: "A" },
    { id: "04", title: "在 JavaScript 中，哪个关键字用于声明常量？", category: "JavaScript", answer: "C" },
    { id: "05", title: "CSS 的主要作用是什么？", category: "CSS", answer: "B" }
];

let userData = [
    { id: "1", name: "1", date: "2026-10-10" },
    { id: "2", name: "2", date: "2026-10-10" },
    { id: "3", name: "3", date: "2026-10-11" },
    { id: "4", name: "4", date: "2026-10-12" },
    { id: "5", name: "5", date: "2026-10-13" }
];

// ================= 2. 全局变量 & DOM =================
let currentPage = "question"; // 当前页面类型
let currentData = [];         // 当前渲染的过滤后数据
let editingId = null;         // 正在编辑的ID (null表示新增)

const menuItems = document.querySelectorAll('.menu-item');
const searchInput = document.getElementById('searchInput');
const tableHead = document.getElementById('tableHead');
const tableBody = document.getElementById('tableBody');
const emptyState = document.getElementById('emptyState');
const totalInfo = document.getElementById('totalInfo');
const pageTitle = document.getElementById('pageTitle');
const pageSubtitle = document.getElementById('pageSubtitle');
const currentPageName = document.getElementById('currentPageName');
const listTitle = document.getElementById('listTitle');

// 弹窗相关
const modalOverlay = document.getElementById('modalOverlay');
const modalTitle = document.getElementById('modalTitle');
const modalBody = document.getElementById('modalBody');
const closeModalBtn = document.getElementById('closeModalBtn');
const cancelBtn = document.getElementById('cancelBtn');
const saveBtn = document.getElementById('saveBtn');

// ================= 3. 渲染核心逻辑 =================
function renderPage(keyword = "") {
    // 更新左侧角标
    document.getElementById('questionBadge').innerText = questionData.length;
    document.getElementById('userBadge').innerText = userData.length;

    let sourceData = currentPage === "question" ? questionData : userData;
    
    // 过滤数据
    currentData = sourceData.filter(item => {
        if (currentPage === "question") {
            return item.title.toLowerCase().includes(keyword) || item.category.toLowerCase().includes(keyword);
        } else {
            return item.name.toLowerCase().includes(keyword);
        }
    });

    // 渲染表头 & 表体
    if (currentPage === "question") {
        tableHead.innerHTML = `<tr><th width="80">编号</th><th>题目内容</th><th width="120">分类</th><th width="100">正确答案</th><th width="150">操作</th></tr>`;
        tableBody.innerHTML = currentData.map(item => `
            <tr>
                <td>${item.id}</td>
                <td>${item.title}</td>
                <td><span class="tag">${item.category}</span></td>
                <td><span class="answer-tag">${item.answer}</span></td>
                <td class="action-links">
                    <a class="link-edit" onclick="openModal('edit', '${item.id}')">编辑</a>
                    <a class="link-delete" onclick="deleteItem('${item.id}')">删除</a>
                </td>
            </tr>
        `).join('');
    } else {
        tableHead.innerHTML = `<tr><th width="80">编号</th><th>用户名</th><th>演示密码</th><th>加入日期</th><th width="150">操作</th></tr>`;
        tableBody.innerHTML = currentData.map(item => `
            <tr>
                <td>${item.id}</td>
                <td>
                    <div style="display:flex; align-items:center; gap:8px;">
                        <div style="width:24px; height:24px; background:#e2e8f0; border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:12px; color:#64748b;">${item.name.charAt(0)}</div>
                        ${item.name}
                    </div>
                </td>
                <td>••••••••</td>
                <td>${item.date}</td>
                <td class="action-links">
                    <a class="link-edit" onclick="openModal('edit', '${item.id}')">编辑</a>
                    <a class="link-delete" onclick="deleteItem('${item.id}')">删除</a>
                </td>
            </tr>
        `).join('');
    }

    // 空状态处理
    if (currentData.length === 0) {
        emptyState.style.display = 'block';
        tableBody.innerHTML = '';
    } else {
        emptyState.style.display = 'none';
    }
    totalInfo.innerText = `共 ${currentData.length} 条数据`;
}

// ================= 4. 菜单切换逻辑 =================
menuItems.forEach(item => {
    item.addEventListener('click', function() {
        menuItems.forEach(i => i.classList.remove('active'));
        this.classList.add('active');
        currentPage = this.dataset.target;
        searchInput.value = ""; // 切换时清空搜索框

        if (currentPage === "question") {
            pageTitle.innerText = "题目管理";
            currentPageName.innerText = "题目管理";
            pageSubtitle.innerText = "整理题目、调整选项，为下一次答题做好准备。";
            listTitle.innerText = "题目列表";
            searchInput.placeholder = "输入关键词搜索题目...";
            document.getElementById('addBtn').innerText = "+ 添加题目";
        } else {
            pageTitle.innerText = "用户管理";
            currentPageName.innerText = "用户管理";
            pageSubtitle.innerText = "查看参与答题的用户，维护用户名和账号信息。";
            listTitle.innerText = "用户列表";
            searchInput.placeholder = "输入用户名搜索...";
            document.getElementById('addBtn').innerText = "+ 添加用户";
        }
        renderPage();
    });
});

// ================= 5. 搜索与重置 =================
document.getElementById('searchBtn').addEventListener('click', () => renderPage(searchInput.value.trim().toLowerCase()));
searchInput.addEventListener('keyup', (e) => { if (e.key === 'Enter') renderPage(searchInput.value.trim().toLowerCase()); });
document.getElementById('resetBtn').addEventListener('click', () => { searchInput.value = ''; renderPage(); });

// ================= 6. 弹窗与增删改逻辑 =================
const addBtn = document.getElementById('addBtn');

// 打开弹窗
function openModal(mode, id = null) {
    editingId = id;
    modalOverlay.classList.add('show');
    
    if (currentPage === "question") {
        modalTitle.innerText = mode === 'add' ? "添加题目" : "编辑题目";
        modalBody.innerHTML = `
            <div class="form-group">
                <label>题目内容</label>
                <input type="text" class="form-control" id="formTitle" placeholder="请输入题目内容">
            </div>
            <div class="form-group">
                <label>分类</label>
                <input type="text" class="form-control" id="formCategory" placeholder="如: 常识, HTML, JS...">
            </div>
            <div class="form-group">
                <label>正确答案</label>
                <input type="text" class="form-control" id="formAnswer" placeholder="如: A, B, C, D">
            </div>
        `;
        // 如果是编辑，回显数据
        if (mode === 'edit') {
            const data = questionData.find(item => item.id === id);
            if (data) {
                document.getElementById('formTitle').value = data.title;
                document.getElementById('formCategory').value = data.category;
                document.getElementById('formAnswer').value = data.answer;
            }
        }
    } else {
        modalTitle.innerText = mode === 'add' ? "添加用户" : "编辑用户";
        modalBody.innerHTML = `
            <div class="form-group">
                <label>用户名</label>
                <input type="text" class="form-control" id="formName" placeholder="请输入用户名">
            </div>
            <div class="form-group">
                <label>加入日期</label>
                <input type="date" class="form-control" id="formDate">
            </div>
        `;
        if (mode === 'edit') {
            const data = userData.find(item => item.id === id);
            if (data) {
                document.getElementById('formName').value = data.name;
                document.getElementById('formDate').value = data.date;
            }
        } else {
            // 默认日期设为今天
            document.getElementById('formDate').valueAsDate = new Date();
        }
    }
}

// 关闭弹窗
function closeModal() {
    modalOverlay.classList.remove('show');
    editingId = null;
}
closeModalBtn.addEventListener('click', closeModal);
cancelBtn.addEventListener('click', closeModal);

// 添加按钮点击
addBtn.addEventListener('click', () => openModal('add'));

// 保存数据 (新增 / 编辑)
saveBtn.addEventListener('click', () => {
    if (currentPage === "question") {
        const title = document.getElementById('formTitle').value.trim();
        const category = document.getElementById('formCategory').value.trim();
        const answer = document.getElementById('formAnswer').value.trim();
        
        if (!title || !category || !answer) return alert("请填写完整信息！");

        if (editingId) {
            // 编辑
            const index = questionData.findIndex(item => item.id === editingId);
            questionData[index] = { ...questionData[index], title, category, answer };
        } else {
            // 新增
            const newId = String(questionData.length + 1).padStart(2, '0');
            questionData.unshift({ id: newId, title, category, answer }); // 插在最前面
        }
    } else {
        const name = document.getElementById('formName').value.trim();
        const date = document.getElementById('formDate').value;

        if (!name || !date) return alert("请填写完整信息！");

        if (editingId) {
            const index = userData.findIndex(item => item.id === editingId);
            userData[index] = { ...userData[index], name, date };
        } else {
            const newId = String(userData.length + 1);
            userData.unshift({ id: newId, name, date });
        }
    }
    
    closeModal();
    renderPage(); // 重新渲染表格
});

// 删除数据
function deleteItem(id) {
    if (!confirm("确定要删除这条数据吗？")) return;

    if (currentPage === "question") {
        questionData = questionData.filter(item => item.id !== id);
    } else {
        userData = userData.filter(item => item.id !== id);
    }
    
    renderPage();
}

// ================= 7. 初始化 =================
renderPage();