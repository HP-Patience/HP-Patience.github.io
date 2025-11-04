// 管理员脚本 - 结合Firebase的Hexo后端管理系统

class AdminSystem {
  constructor() {
    // 初始化Firebase应用
    this.initializeFirebase();
    // 初始化DOM元素
    this.initializeDOM();
    // 设置事件监听
    this.setupEventListeners();
    // 检查登录状态
    this.checkAuthState();
  }

  // 初始化Firebase
  initializeFirebase() {
    // 使用与登录系统相同的配置
    const firebaseConfig = {
      apiKey: "AIzaSyAYf-e1GjCDlkNrDZ51OYK2c-5Tv2tTCnQ",
      authDomain: "my-hexo-blog-1b604.firebaseapp.com",
      projectId: "my-hexo-blog-1b604",
      storageBucket: "my-hexo-blog-1b604.firebasestorage.app",
      messagingSenderId: "118378598865",
      appId: "1:118378598865:web:43e517c39d7c59388e90f0",
      measurementId: "G-1XEGP9WLX0"
    };

    // 导入Firebase模块
    Promise.all([
      import('https://www.gstatic.com/firebasejs/12.5.0/firebase-app.js'),
      import('https://www.gstatic.com/firebasejs/12.5.0/firebase-auth.js'),
      import('https://www.gstatic.com/firebasejs/12.5.0/firebase-firestore.js'),
      import('https://www.gstatic.com/firebasejs/12.5.0/firebase-storage.js')
    ]).then(([firebaseApp, firebaseAuth, firebaseFirestore, firebaseStorage]) => {
      const { initializeApp } = firebaseApp;
      const { getAuth, onAuthStateChanged } = firebaseAuth;
      const { getFirestore } = firebaseFirestore;
      const { getStorage } = firebaseStorage;

      this.app = initializeApp(firebaseConfig);
      this.auth = getAuth(this.app);
      this.db = getFirestore(this.app);
      this.storage = getStorage(this.app);

      // 监听身份验证状态变化
      onAuthStateChanged(this.auth, (user) => {
        this.currentUser = user;
        this.updateUI();
      });

      // 初始化Markdown渲染器
      this.initializeMarkdownRenderer();
    }).catch(error => {
      console.error('Firebase模块加载失败:', error);
      alert('Firebase模块加载失败，请刷新页面重试。');
    });
  }

  // 初始化DOM元素
  initializeDOM() {
    this.adminPanel = document.getElementById('admin-panel');
    
    // 标签切换
    this.tabButtons = document.querySelectorAll('.tab-btn');
    this.tabPanes = document.querySelectorAll('.tab-pane');
    
    // 文章管理
    this.newArticleBtn = document.getElementById('new-article-btn');
    this.refreshArticlesBtn = document.getElementById('refresh-articles-btn');
    this.articlesBody = document.getElementById('articles-body');
    
    // 媒体管理
    this.mediaUpload = document.getElementById('media-upload');
    this.uploadBtn = document.getElementById('upload-btn');
    this.refreshMediaBtn = document.getElementById('refresh-media-btn');
    this.mediaList = document.getElementById('media-list');
    
    // 部署
    this.deployBtn = document.getElementById('deploy-btn');
    this.deployLog = document.getElementById('deploy-log');
    
    // 编辑器模态框
    this.editorModal = document.getElementById('editor-modal');
    this.closeModalBtn = document.querySelector('.close-btn');
    this.editorTabButtons = document.querySelectorAll('.editor-tab-btn');
    this.editorPanes = document.querySelectorAll('.editor-pane');
    this.saveArticleBtn = document.getElementById('save-article-btn');
    this.publishArticleBtn = document.getElementById('publish-article-btn');
    this.cancelEditBtn = document.getElementById('cancel-edit-btn');
    
    // 文章表单字段
    this.articleTitle = document.getElementById('article-title');
    this.articleDate = document.getElementById('article-date');
    this.articleCategories = document.getElementById('article-categories');
    this.articleTags = document.getElementById('article-tags');
    this.articleStatus = document.getElementById('article-status');
    this.articleContent = document.getElementById('article-content');
    this.articlePreview = document.getElementById('article-preview');
    
    // 当前编辑的文章
    this.currentArticle = null;
  }

  // 设置事件监听
  setupEventListeners() {
    // 标签切换
    this.tabButtons.forEach(button => {
      button.addEventListener('click', () => {
        const tab = button.getAttribute('data-tab');
        this.switchTab(tab);
      });
    });
    
    // 编辑器标签切换
    if (this.editorTabButtons) {
      this.editorTabButtons.forEach(button => {
        button.addEventListener('click', () => {
          const tab = button.getAttribute('data-editor-tab');
          this.switchEditorTab(tab);
        });
      });
    }
    
    // 新建文章
    if (this.newArticleBtn) {
      this.newArticleBtn.addEventListener('click', () => this.createNewArticle());
    }
    
    // 刷新文章列表
    if (this.refreshArticlesBtn) {
      this.refreshArticlesBtn.addEventListener('click', () => this.loadArticles());
    }
    
    // 上传媒体文件
    if (this.uploadBtn) {
      this.uploadBtn.addEventListener('click', () => this.uploadMediaFiles());
    }
    
    // 刷新媒体列表
    if (this.refreshMediaBtn) {
      this.refreshMediaBtn.addEventListener('click', () => this.loadMediaFiles());
    }
    
    // 部署博客
    if (this.deployBtn) {
      this.deployBtn.addEventListener('click', () => this.deployBlog());
    }
    
    // 模态框操作
    if (this.closeModalBtn) {
      this.closeModalBtn.addEventListener('click', () => this.closeEditorModal());
    }
    if (this.saveArticleBtn) {
      this.saveArticleBtn.addEventListener('click', () => this.saveArticle());
    }
    if (this.publishArticleBtn) {
      this.publishArticleBtn.addEventListener('click', () => this.publishArticle());
    }
    if (this.cancelEditBtn) {
      this.cancelEditBtn.addEventListener('click', () => this.closeEditorModal());
    }
    
    // 编辑内容变化时更新预览
    if (this.articleContent) {
      this.articleContent.addEventListener('input', () => this.updatePreview());
    }
  }

  // 检查身份验证状态
  checkAuthState() {
    // 延迟检查，确保Firebase已初始化
    setTimeout(() => {
      if (!this.currentUser) {
        alert('请先登录后再访问管理界面');
        window.location.href = '/';
      }
    }, 1000);
  }

  // 更新UI
  updateUI() {
    if (this.currentUser) {
      this.adminPanel.style.display = 'block';
      // 加载文章列表
      this.loadArticles();
      // 加载媒体文件列表
      this.loadMediaFiles();
    } else {
      this.adminPanel.style.display = 'none';
    }
  }

  // 切换标签
  switchTab(tabId) {
    // 隐藏所有标签内容
    this.tabPanes.forEach(pane => {
      pane.classList.remove('active');
    });
    
    // 移除所有按钮的活动状态
    this.tabButtons.forEach(button => {
      button.classList.remove('active');
    });
    
    // 显示选中的标签内容
    const activePane = document.getElementById(`${tabId}-tab`);
    if (activePane) {
      activePane.classList.add('active');
    }
    
    // 激活选中的按钮
    const activeButton = document.querySelector(`.tab-btn[data-tab="${tabId}"]`);
    if (activeButton) {
      activeButton.classList.add('active');
    }
  }

  // 切换编辑器标签
  switchEditorTab(tabId) {
    // 隐藏所有编辑器标签内容
    this.editorPanes.forEach(pane => {
      pane.classList.remove('active');
    });
    
    // 移除所有按钮的活动状态
    this.editorTabButtons.forEach(button => {
      button.classList.remove('active');
    });
    
    // 显示选中的标签内容
    const activePane = document.getElementById(`${tabId}-tab`);
    if (activePane) {
      activePane.classList.add('active');
    }
    
    // 激活选中的按钮
    const activeButton = document.querySelector(`.editor-tab-btn[data-editor-tab="${tabId}"]`);
    if (activeButton) {
      activeButton.classList.add('active');
    }
    
    // 如果切换到预览标签，更新预览
    if (tabId === 'preview') {
      this.updatePreview();
    }
  }

  // 初始化Markdown渲染器
  initializeMarkdownRenderer() {
    // 动态加载marked库用于Markdown渲染
    import('https://cdn.jsdelivr.net/npm/marked/marked.min.js').then(markedModule => {
      this.marked = markedModule.default;
      // 配置marked
      this.marked.setOptions({
        breaks: true,
        gfm: true,
        headerIds: true
      });
    }).catch(error => {
      console.error('Marked库加载失败:', error);
    });
  }

  // 更新预览
  updatePreview() {
    if (!this.marked) return;
    
    const content = this.articleContent.value;
    const html = this.marked(content);
    this.articlePreview.innerHTML = html;
    
    // 添加代码高亮（可选）
    this.highlightCode();
  }

  // 代码高亮
  highlightCode() {
    // 这里可以集成highlight.js或其他代码高亮库
    const codeBlocks = this.articlePreview.querySelectorAll('pre code');
    codeBlocks.forEach(block => {
      // 简单的代码高亮样式
      block.style.backgroundColor = '#f6f8fa';
      block.style.padding = '1em';
      block.style.borderRadius = '3px';
      block.style.display = 'block';
    });
  }

  // 创建新文章
  createNewArticle() {
    this.currentArticle = null;
    this.clearEditor();
    
    // 设置当前日期
    const now = new Date();
    this.articleDate.value = now.toISOString().slice(0, 16);
    
    // 显示编辑器模态框
    this.editorModal.style.display = 'block';
  }

  // 编辑文章
  editArticle(article) {
    this.currentArticle = article;
    
    // 填充编辑器
    this.articleTitle.value = article.title || '';
    this.articleDate.value = article.date ? new Date(article.date).toISOString().slice(0, 16) : '';
    this.articleCategories.value = Array.isArray(article.categories) ? article.categories.join(', ') : article.categories || '';
    this.articleTags.value = Array.isArray(article.tags) ? article.tags.join(', ') : article.tags || '';
    this.articleStatus.value = article.status || 'draft';
    this.articleContent.value = article.content || '';
    
    // 显示编辑器模态框
    this.editorModal.style.display = 'block';
  }

  // 保存文章
  async saveArticle() {
    try {
      const { collection, addDoc, updateDoc, doc } = await import('https://www.gstatic.com/firebasejs/12.5.0/firebase-firestore.js');
      
      const articleData = {
        title: this.articleTitle.value,
        date: new Date(this.articleDate.value),
        categories: this.articleCategories.value.split(',').map(c => c.trim()),
        tags: this.articleTags.value.split(',').map(t => t.trim()),
        status: this.articleStatus.value,
        content: this.articleContent.value,
        updatedAt: new Date()
      };
      
      if (this.currentArticle && this.currentArticle.id) {
        // 更新现有文章
        await updateDoc(doc(this.db, 'articles', this.currentArticle.id), articleData);
        alert('文章更新成功！');
      } else {
        // 创建新文章
        await addDoc(collection(this.db, 'articles'), articleData);
        alert('文章保存成功！');
      }
      
      // 重新加载文章列表
      this.loadArticles();
      this.closeEditorModal();
    } catch (error) {
      console.error('保存文章失败:', error);
      alert('保存文章失败，请重试。');
    }
  }

  // 发布文章
  async publishArticle() {
    this.articleStatus.value = 'published';
    await this.saveArticle();
    
    // 提示用户是否需要部署博客
    if (confirm('文章已发布，是否立即部署博客？')) {
      this.deployBlog();
    }
  }

  // 关闭编辑器模态框
  closeEditorModal() {
    this.editorModal.style.display = 'none';
    this.clearEditor();
  }

  // 清空编辑器
  clearEditor() {
    this.articleTitle.value = '';
    this.articleDate.value = '';
    this.articleCategories.value = '';
    this.articleTags.value = '';
    this.articleStatus.value = 'draft';
    this.articleContent.value = '';
    this.articlePreview.innerHTML = '';
  }

  // 加载文章列表
  async loadArticles() {
    try {
      const { collection, getDocs, query, orderBy } = await import('https://www.gstatic.com/firebasejs/12.5.0/firebase-firestore.js');
      
      // 清空列表
      this.articlesBody.innerHTML = '';
      
      // 从Firestore获取文章
      const q = query(collection(this.db, 'articles'), orderBy('date', 'desc'));
      const querySnapshot = await getDocs(q);
      
      if (querySnapshot.empty) {
        this.articlesBody.innerHTML = '<tr><td colspan="6">暂无文章</td></tr>';
        return;
      }
      
      // 遍历文章并添加到列表
      querySnapshot.forEach(doc => {
        const article = {
          id: doc.id,
          ...doc.data()
        };
        
        const row = document.createElement('tr');
        row.innerHTML = `
          <td>${article.title || '无标题'}</td>
          <td>${article.date ? new Date(article.date).toLocaleDateString() : '无日期'}</td>
          <td>${Array.isArray(article.categories) ? article.categories.join(', ') : article.categories || '无分类'}</td>
          <td>${Array.isArray(article.tags) ? article.tags.join(', ') : article.tags || '无标签'}</td>
          <td>${article.status === 'published' ? '已发布' : '草稿'}</td>
          <td>
            <button class="edit-btn" data-id="${article.id}">编辑</button>
            <button class="delete-btn" data-id="${article.id}">删除</button>
            ${article.status === 'draft' ? `<button class="publish-btn" data-id="${article.id}">发布</button>` : ''}
          </td>
        `;
        
        this.articlesBody.appendChild(row);
      });
      
      // 绑定编辑按钮事件
      document.querySelectorAll('.edit-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const articleId = btn.getAttribute('data-id');
          const article = this.findArticleById(articleId);
          if (article) {
            this.editArticle(article);
          }
        });
      });
      
      // 绑定删除按钮事件
      document.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', async () => {
          const articleId = btn.getAttribute('data-id');
          if (confirm('确定要删除这篇文章吗？')) {
            await this.deleteArticle(articleId);
          }
        });
      });
      
      // 绑定发布按钮事件
      document.querySelectorAll('.publish-btn').forEach(btn => {
        btn.addEventListener('click', async () => {
          const articleId = btn.getAttribute('data-id');
          await this.publishArticleById(articleId);
        });
      });
    } catch (error) {
      console.error('加载文章列表失败:', error);
      this.articlesBody.innerHTML = '<tr><td colspan="6">加载失败，请重试</td></tr>';
    }
  }

  // 根据ID查找文章
  async findArticleById(id) {
    try {
      const { doc, getDoc } = await import('https://www.gstatic.com/firebasejs/12.5.0/firebase-firestore.js');
      
      const docRef = doc(this.db, 'articles', id);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return {
          id: docSnap.id,
          ...docSnap.data()
        };
      }
      return null;
    } catch (error) {
      console.error('查找文章失败:', error);
      return null;
    }
  }

  // 删除文章
  async deleteArticle(id) {
    try {
      const { doc, deleteDoc } = await import('https://www.gstatic.com/firebasejs/12.5.0/firebase-firestore.js');
      
      await deleteDoc(doc(this.db, 'articles', id));
      alert('文章删除成功！');
      this.loadArticles();
    } catch (error) {
      console.error('删除文章失败:', error);
      alert('删除文章失败，请重试。');
    }
  }

  // 根据ID发布文章
  async publishArticleById(id) {
    try {
      const { doc, updateDoc } = await import('https://www.gstatic.com/firebasejs/12.5.0/firebase-firestore.js');
      
      await updateDoc(doc(this.db, 'articles', id), {
        status: 'published',
        updatedAt: new Date()
      });
      
      alert('文章发布成功！');
      this.loadArticles();
      
      // 提示用户是否需要部署博客
      if (confirm('文章已发布，是否立即部署博客？')) {
        this.deployBlog();
      }
    } catch (error) {
      console.error('发布文章失败:', error);
      alert('发布文章失败，请重试。');
    }
  }

  // 上传媒体文件
  async uploadMediaFiles() {
    const files = this.mediaUpload.files;
    if (files.length === 0) {
      alert('请选择要上传的文件');
      return;
    }
    
    try {
      const { ref, uploadBytesResumable, getDownloadURL } = await import('https://www.gstatic.com/firebasejs/12.5.0/firebase-storage.js');
      
      for (const file of files) {
        // 创建存储引用
        const storageRef = ref(this.storage, `media/${Date.now()}_${file.name}`);
        
        // 创建上传任务
        const uploadTask = uploadBytesResumable(storageRef, file);
        
        // 监听上传进度
        uploadTask.on('state_changed',
          (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log(`上传中: ${progress}%`);
          },
          (error) => {
            console.error('文件上传失败:', error);
            alert(`文件 ${file.name} 上传失败`);
          },
          async () => {
            // 上传完成
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            console.log('文件上传成功:', downloadURL);
            
            // 保存文件信息到Firestore
            await this.saveFileInfo(file.name, downloadURL);
          }
        );
      }
      
      alert(`开始上传 ${files.length} 个文件，请耐心等待`);
      this.mediaUpload.value = ''; // 清空文件选择
    } catch (error) {
      console.error('上传文件失败:', error);
      alert('上传文件失败，请重试。');
    }
  }

  // 保存文件信息到Firestore
  async saveFileInfo(fileName, downloadURL) {
    try {
      const { collection, addDoc } = await import('https://www.gstatic.com/firebasejs/12.5.0/firebase-firestore.js');
      
      await addDoc(collection(this.db, 'media'), {
        name: fileName,
        url: downloadURL,
        uploadDate: new Date(),
        uploadBy: this.currentUser?.email || 'admin'
      });
      
      // 刷新媒体列表
      this.loadMediaFiles();
    } catch (error) {
      console.error('保存文件信息失败:', error);
    }
  }

  // 加载媒体文件列表
  async loadMediaFiles() {
    try {
      const { collection, getDocs, query, orderBy } = await import('https://www.gstatic.com/firebasejs/12.5.0/firebase-firestore.js');
      
      // 清空列表
      this.mediaList.innerHTML = '';
      
      // 从Firestore获取媒体文件
      const q = query(collection(this.db, 'media'), orderBy('uploadDate', 'desc'));
      const querySnapshot = await getDocs(q);
      
      if (querySnapshot.empty) {
        this.mediaList.innerHTML = '<p>暂无媒体文件</p>';
        return;
      }
      
      // 遍历媒体文件并添加到列表
      querySnapshot.forEach(doc => {
        const file = doc.data();
        
        const fileItem = document.createElement('div');
        fileItem.className = 'media-item';
        
        // 判断文件类型，显示不同的预览
        let preview = '';
        const isImage = file.name.match(/\.(jpeg|jpg|gif|png|webp)$/i);
        const isVideo = file.name.match(/\.(mp4|webm|ogg)$/i);
        const isAudio = file.name.match(/\.(mp3|wav|ogg)$/i);
        
        if (isImage) {
          preview = `<img src="${file.url}" alt="${file.name}" style="max-width: 100px; max-height: 100px;">`;
        } else if (isVideo) {
          preview = `<video src="${file.url}" controls style="max-width: 200px;"></video>`;
        } else if (isAudio) {
          preview = `<audio src="${file.url}" controls></audio>`;
        } else {
          preview = `<div class="file-icon">📄</div>`;
        }
        
        fileItem.innerHTML = `
          <div class="media-preview">${preview}</div>
          <div class="media-info">
            <p class="media-name">${file.name}</p>
            <p class="media-date">${new Date(file.uploadDate).toLocaleString()}</p>
            <button class="copy-url-btn" data-url="${file.url}">复制链接</button>
            <button class="delete-file-btn" data-id="${doc.id}">删除</button>
          </div>
        `;
        
        this.mediaList.appendChild(fileItem);
      });
      
      // 绑定复制链接按钮事件
      document.querySelectorAll('.copy-url-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const url = btn.getAttribute('data-url');
          navigator.clipboard.writeText(url).then(() => {
            alert('链接已复制到剪贴板');
          }).catch(() => {
            alert('复制失败，请手动复制');
          });
        });
      });
      
      // 绑定删除文件按钮事件
      document.querySelectorAll('.delete-file-btn').forEach(btn => {
        btn.addEventListener('click', async () => {
          const fileId = btn.getAttribute('data-id');
          if (confirm('确定要删除这个文件吗？')) {
            await this.deleteMediaFile(fileId);
          }
        });
      });
    } catch (error) {
      console.error('加载媒体文件列表失败:', error);
      this.mediaList.innerHTML = '<p>加载失败，请重试</p>';
    }
  }

  // 删除媒体文件
  async deleteMediaFile(id) {
    try {
      const { doc, deleteDoc, getDoc } = await import('https://www.gstatic.com/firebasejs/12.5.0/firebase-firestore.js');
      const { ref, deleteObject } = await import('https://www.gstatic.com/firebasejs/12.5.0/firebase-storage.js');
      
      // 获取文件信息
      const docRef = doc(this.db, 'media', id);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        const file = docSnap.data();
        
        // 从存储中删除文件
        // 注意：这里需要从URL中提取路径，或者在数据库中存储完整的路径
        // 简化版本，假设我们能从URL构建引用
        const url = new URL(file.url);
        const path = url.pathname.split('/').slice(2).join('/'); // 提取路径部分
        const storageRef = ref(this.storage, path);
        
        try {
          await deleteObject(storageRef);
        } catch (storageError) {
          console.error('删除存储文件失败:', storageError);
          // 继续删除数据库记录，即使存储删除失败
        }
        
        // 从数据库中删除记录
        await deleteDoc(docRef);
        
        alert('文件删除成功！');
        this.loadMediaFiles();
      }
    } catch (error) {
      console.error('删除媒体文件失败:', error);
      alert('删除文件失败，请重试。');
    }
  }

  // 部署博客
  async deployBlog() {
    try {
      // 显示部署日志
      this.deployLog.innerHTML = '开始部署...<br>';
      this.deployBtn.disabled = true;
      
      // 在实际项目中，这里会调用一个云函数或其他服务来触发部署
      // 这里模拟部署过程
      
      // 1. 导出文章到Markdown文件
      this.log('正在导出文章...');
      await this.exportArticles();
      
      // 2. 触发构建
      this.log('正在触发构建...');
      await this.triggerBuild();
      
      // 3. 部署完成
      this.log('部署完成！博客已更新。');
      alert('博客部署成功！');
    } catch (error) {
      console.error('部署博客失败:', error);
      this.log(`部署失败: ${error.message}`);
      alert('部署失败，请重试。');
    } finally {
      this.deployBtn.disabled = false;
    }
  }

  // 导出文章到Markdown
  async exportArticles() {
    // 模拟导出过程
    return new Promise(resolve => setTimeout(resolve, 2000));
  }

  // 触发构建
  async triggerBuild() {
    // 在实际项目中，这里会调用GitHub Actions API、Netlify API或其他CI/CD服务
    // 这里模拟触发构建
    return new Promise(resolve => setTimeout(resolve, 3000));
  }

  // 记录部署日志
  log(message) {
    this.deployLog.innerHTML += `${message}<br>`;
    this.deployLog.scrollTop = this.deployLog.scrollHeight;
  }
}

// 初始化管理系统
window.addEventListener('DOMContentLoaded', () => {
  // 确保用户已登录
  if (window._FIREBASE_LOGIN_INITIALIZED) {
    setTimeout(() => {
      new AdminSystem();
    }, 1000);
  } else {
    alert('请先登录后再访问管理界面');
    window.location.href = '/';
  }
});