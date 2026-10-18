<script>
const pageContents = {
  question: {
    title: '题目管理',
    subtitle: '整理题目、调整选项，为下一次答题做好准备。',
    listTitle: '题目列表',
    placeholder: '输入关键词搜索题目...',
    addText: '+ 添加题目',
  },
  user: {
    title: '用户管理',
    subtitle: '查看参与答题的用户，维护用户名和账号信息。',
    listTitle: '用户列表',
    placeholder: '输入用户名搜索...',
    addText: '+ 添加用户',
  },
}

export default {
  name: 'App',

  data() {
    return {
      currentPage: 'question',
      keyword: '',
      appliedKeyword: '',
      pageConfig: {
        title: '题目管理',
        subtitle: '整理题目、调整选项，为下一次答题做好准备。',
        listTitle: '题目列表',
        placeholder: '输入关键词搜索...',
        addText: '+ 添加',
      },
      questions: [
        { id: '01', title: '世界上国土面积最大的国家是？', category: '常识', answer: 'B' },
        { id: '02', title: '法国的首都是哪里？', category: '常识', answer: 'C' },
        { id: '03', title: 'HTML 的全称是什么？', category: 'HTML', answer: 'A' },
        { id: '04', title: '在 JavaScript 中，哪个关键字用于声明常量？', category: 'JavaScript', answer: 'C' },
        { id: '05', title: 'CSS 的主要作用是什么？', category: 'CSS', answer: 'B' },
      ],
      users: [
        { id: '1', name: '1', date: '2026-10-10' },
        { id: '2', name: '2', date: '2026-10-10' },
        { id: '3', name: '3', date: '2026-10-11' },
        { id: '4', name: '4', date: '2026-10-12' },
        { id: '5', name: '5', date: '2026-10-13' },
      ],
      modalVisible: false,
      modalMode: 'add',
      editingId: null,
      form: {
        title: '',
        category: '',
        answer: '',
        name: '',
        date: '',
      },
    }
  },

  computed: {
    currentData() {
      const source = this.currentPage === 'question' ? this.questions : this.users
      const keyword = this.appliedKeyword

      return source.filter((item) => {
        if (this.currentPage === 'question') {
          return item.title.toLowerCase().includes(keyword)
            || item.category.toLowerCase().includes(keyword)
        }

        return item.name.toLowerCase().includes(keyword)
      })
    },

    modalTitle() {
      const type = this.currentPage === 'question' ? '题目' : '用户'
      return `${this.modalMode === 'add' ? '添加' : '编辑'}${type}`
    },
  },

  methods: {
    switchPage(page) {
      this.currentPage = page
      this.keyword = ''
      this.appliedKeyword = ''
      this.pageConfig = pageContents[page]
    },

    search() {
      this.appliedKeyword = this.keyword.trim().toLowerCase()
    },

    resetSearch() {
      this.keyword = ''
      this.appliedKeyword = ''
    },

    openModal(mode, id = null) {
      this.editingId = id
      this.modalMode = mode
      this.form = {
        title: '',
        category: '',
        answer: '',
        name: '',
        date: '',
      }

      if (mode === 'edit') {
        const source = this.currentPage === 'question' ? this.questions : this.users
        const record = source.find((item) => item.id === id)

        if (record) {
          this.form = { ...this.form, ...record }
        }
      } else if (this.currentPage === 'user') {
        this.form.date = this.today()
      }

      this.modalVisible = true
    },

    closeModal() {
      this.modalVisible = false
      this.editingId = null
    },

    saveData() {
      if (this.currentPage === 'question') {
        const title = this.form.title.trim()
        const category = this.form.category.trim()
        const answer = this.form.answer.trim()

        if (!title || !category || !answer) {
          alert('请填写完整信息！')
          return
        }

        if (this.editingId) {
          const index = this.questions.findIndex((item) => item.id === this.editingId)
          this.questions[index] = { ...this.questions[index], title, category, answer }
        } else {
          const id = String(this.questions.length + 1).padStart(2, '0')
          this.questions.unshift({ id, title, category, answer })
        }
      } else {
        const name = this.form.name.trim()
        const date = this.form.date

        if (!name || !date) {
          alert('请填写完整信息！')
          return
        }

        if (this.editingId) {
          const index = this.users.findIndex((item) => item.id === this.editingId)
          this.users[index] = { ...this.users[index], name, date }
        } else {
          const id = String(this.users.length + 1)
          this.users.unshift({ id, name, date })
        }
      }

      this.closeModal()
      this.appliedKeyword = ''
    },

    deleteData(id) {
      if (!confirm('确定要删除这条数据吗？')) return

      if (this.currentPage === 'question') {
        this.questions = this.questions.filter((item) => item.id !== id)
      } else {
        this.users = this.users.filter((item) => item.id !== id)
      }

      this.appliedKeyword = ''
    },

    today() {
      const date = new Date()
      const year = date.getFullYear()
      const month = String(date.getMonth() + 1).padStart(2, '0')
      const day = String(date.getDate()).padStart(2, '0')
      return `${year}-${month}-${day}`
    },
  },
}
</script>

<template>
  <div class="app-layout">
    <aside class="sidebar">
      <div class="logo-area">
        <div class="logo-icon">Q</div>
        <span>Quiz 题库管理</span>
      </div>
      <div class="menu-group">
        <div class="menu-title">工作台</div>
        <ul class="menu-list">
          <li
            class="menu-item"
            :class="{ active: currentPage === 'question' }"
            data-target="question"
            @click="switchPage('question')"
          >
            <i class="icon">📝</i> 题目管理 <span class="badge">{{ questions.length }}</span>
          </li>
          <li
            class="menu-item"
            :class="{ active: currentPage === 'user' }"
            data-target="user"
            @click="switchPage('user')"
          >
            <i class="icon">👥</i> 用户管理 <span class="badge">{{ users.length }}</span>
          </li>
        </ul>
      </div>
      <div class="sidebar-footer">
        <div class="user-info">
          <div class="avatar">A</div>
          <div>
            <div class="name">管理员</div>
            <div class="role">Web 开发技术</div>
          </div>
        </div>
      </div>
    </aside>

    <main class="main-content">
      <header class="top-header">
        <div class="breadcrumb">Quiz 管理后台 > <span>{{ pageConfig.title }}</span></div>
        <a href="#" class="front-link">打开答题前台 ↗</a>
      </header>

      <div class="content-wrapper">
        <div class="page-header">
          <div>
            <h1>{{ pageConfig.title }}</h1>
            <p class="subtitle">{{ pageConfig.subtitle }}</p>
          </div>
        </div>

        <div class="card">
          <div class="card-header">
            <h2>{{ pageConfig.listTitle }}</h2>
            <div class="action-bar">
              <div class="search-box">
                <i class="search-icon">🔍</i>
                <input
                  v-model="keyword"
                  type="text"
                  :placeholder="pageConfig.placeholder"
                  @keyup.enter="search"
                >
              </div>
              <button class="btn btn-primary" @click="search">查询</button>
              <button class="btn btn-default" @click="resetSearch">重置</button>
              <button class="btn btn-success" @click="openModal('add')">{{ pageConfig.addText }}</button>
            </div>
          </div>

          <div class="table-container">
            <table v-if="currentPage === 'question'">
              <thead>
                <tr>
                  <th width="80">编号</th>
                  <th>题目内容</th>
                  <th width="120">分类</th>
                  <th width="100">正确答案</th>
                  <th width="150">操作</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item in currentData" :key="item.id">
                  <td>{{ item.id }}</td>
                  <td>{{ item.title }}</td>
                  <td><span class="tag">{{ item.category }}</span></td>
                  <td><span class="answer-tag">{{ item.answer }}</span></td>
                  <td class="action-links">
                    <a class="link-edit" @click="openModal('edit', item.id)">编辑</a> <a class="link-delete" @click="deleteData(item.id)">删除</a>
                  </td>
                </tr>
              </tbody>
            </table>

            <table v-else>
              <thead>
                <tr>
                  <th width="80">编号</th>
                  <th>用户名</th>
                  <th>演示密码</th>
                  <th>加入日期</th>
                  <th width="150">操作</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item in currentData" :key="item.id">
                  <td>{{ item.id }}</td>
                  <td>
                    <div style="display:flex; align-items:center; gap:8px;">
                      <div style="width:24px; height:24px; background:#e2e8f0; border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:12px; color:#64748b;">
                        {{ item.name.charAt(0) }}
                      </div>
                      {{ item.name }}
                    </div>
                  </td>
                  <td>••••••••</td>
                  <td>{{ item.date }}</td>
                  <td class="action-links">
                    <a class="link-edit" @click="openModal('edit', item.id)">编辑</a> <a class="link-delete" @click="deleteData(item.id)">删除</a>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div v-if="currentData.length === 0" class="empty-state">
            没有找到匹配的数据
          </div>

          <div class="card-footer">
            <div class="total-info">共 {{ currentData.length }} 条数据</div>
            <div class="pagination">
              <button class="page-btn" disabled>〈</button>
              <button class="page-btn active">1</button>
              <button class="page-btn">〉</button>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>

  <div class="modal-overlay" :class="{ show: modalVisible }">
    <div class="modal-content">
      <div class="modal-header">
        <h3>{{ modalTitle }}</h3>
        <span class="close-btn" @click="closeModal">&times;</span>
      </div>
      <div class="modal-body">
        <template v-if="currentPage === 'question'">
          <div class="form-group">
            <label>题目内容</label>
            <input v-model="form.title" type="text" class="form-control" placeholder="请输入题目内容">
          </div>
          <div class="form-group">
            <label>分类</label>
            <input v-model="form.category" type="text" class="form-control" placeholder="如: 常识, HTML, JS...">
          </div>
          <div class="form-group">
            <label>正确答案</label>
            <input v-model="form.answer" type="text" class="form-control" placeholder="如: A, B, C, D">
          </div>
        </template>
        <template v-else>
          <div class="form-group">
            <label>用户名</label>
            <input v-model="form.name" type="text" class="form-control" placeholder="请输入用户名">
          </div>
          <div class="form-group">
            <label>加入日期</label>
            <input v-model="form.date" type="date" class="form-control">
          </div>
        </template>
      </div>
      <div class="modal-footer">
        <button class="btn btn-default" @click="closeModal">取消</button>
        <button class="btn btn-primary" @click="saveData">保存</button>
      </div>
    </div>
  </div>
</template>
