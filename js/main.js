// 从 localStorage 获取数据，如果没有则使用默认数据
const getStoredData = (key, defaultData) => {
    const storedData = localStorage.getItem(key);
    return storedData ? JSON.parse(storedData) : defaultData;
};

// 将数据保存到 localStorage
const saveData = (key, data) => {
    localStorage.setItem(key, JSON.stringify(data));
};

// 初始诗歌数据
const defaultPoems = [
    {
        id: 1,
        title: '春日遐想',
        content: '春风拂面暖，\n花香沁人心。\n蝴蝶舞翩跹，\n诗意正浓深。',
        author: '张明',
        category: '现代诗',
        tags: ['春天', '自然'],
        likes: 45,
        comments: []
    },
    {
        id: 2,
        title: '月夜思',
        content: '皓月当空照，\n清风徐徐来。\n思绪随风去，\n何处是归来。',
        author: '李华',
        category: '古典诗',
        tags: ['夜晚', '思念'],
        likes: 38,
        comments: []
    }
];

// 从 localStorage 获取诗歌数据
let poems = getStoredData('poems', defaultPoems);

// 加载诗歌列表
function loadPoems() {
    const poemsGrid = document.querySelector('.poems-grid');
    if (!poemsGrid) return;
    
    poemsGrid.innerHTML = '';

    poems.forEach(poem => {
        const poemCard = createPoemCard(poem);
        poemsGrid.appendChild(poemCard);
    });
}

// 创建诗歌卡片
function createPoemCard(poem) {
    const card = document.createElement('div');
    card.className = 'poem-card';
    
    card.innerHTML = `
        <h3 class="poem-title">${poem.title}</h3>
        <div class="poem-content">${poem.content.replace(/\n/g, '<br>')}</div>
        <div class="poem-meta">
            <span class="author">作者：${poem.author}</span>
            <div class="interactions">
                <button class="like-btn ${isLiked(poem.id) ? 'liked' : ''}" data-id="${poem.id}">
                    <i class="fas fa-heart"></i> ${poem.likes}
                </button>
                <button class="comment-btn" data-id="${poem.id}">
                    <i class="fas fa-comment"></i> ${poem.comments.length}
                </button>
            </div>
        </div>
        <div class="comments-section">
            ${renderComments(poem.comments)}
        </div>
    `;

    // 添加交互事件
    const likeBtn = card.querySelector('.like-btn');
    likeBtn.addEventListener('click', () => handleLike(poem.id));

    const commentBtn = card.querySelector('.comment-btn');
    commentBtn.addEventListener('click', () => showCommentModal(poem.id));

    return card;
}

// 检查用户是否已经点赞
function isLiked(poemId) {
    const likedPoems = getStoredData('likedPoems', []);
    return likedPoems.includes(poemId);
}

// 渲染评论
function renderComments(comments) {
    if (comments.length === 0) return '';
    
    return `
        <div class="comments-list">
            ${comments.map(comment => `
                <div class="comment">
                    <p class="comment-text">${comment.text}</p>
                    <span class="comment-date">${comment.date}</span>
                </div>
            `).join('')}
        </div>
    `;
}

// 处理点赞
function handleLike(poemId) {
    const likedPoems = getStoredData('likedPoems', []);
    const poemIndex = poems.findIndex(p => p.id === poemId);
    
    if (poemIndex === -1) return;

    if (likedPoems.includes(poemId)) {
        // 取消点赞
        poems[poemIndex].likes--;
        const index = likedPoems.indexOf(poemId);
        likedPoems.splice(index, 1);
    } else {
        // 添加点赞
        poems[poemIndex].likes++;
        likedPoems.push(poemId);
    }

    // 保存数据
    saveData('poems', poems);
    saveData('likedPoems', likedPoems);
    
    // 重新渲染
    loadPoems();
}

// 显示评论模态框
function showCommentModal(poemId) {
    const modal = document.createElement('div');
    modal.className = 'comment-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <h3>发表评论</h3>
            <textarea placeholder="写下你的想法..." maxlength="200"></textarea>
            <div class="modal-buttons">
                <button class="submit-comment">提交</button>
                <button class="close-modal">关闭</button>
            </div>
        </div>
    `;

    document.body.appendChild(modal);

    // 添加关闭功能
    modal.querySelector('.close-modal').addEventListener('click', () => {
        modal.remove();
    });

    // 添加提交功能
    modal.querySelector('.submit-comment').addEventListener('click', () => {
        const comment = modal.querySelector('textarea').value;
        if (comment.trim()) {
            addComment(poemId, comment);
            modal.remove();
        }
    });

    // 点击模态框外部关闭
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.remove();
        }
    });
}

// 添加评论
function addComment(poemId, comment) {
    const poemIndex = poems.findIndex(p => p.id === poemId);
    if (poemIndex === -1) return;

    const newComment = {
        id: Date.now(),
        text: comment,
        date: new Date().toLocaleString('zh-CN')
    };

    poems[poemIndex].comments.push(newComment);
    
    // 保存到 localStorage
    saveData('poems', poems);
    
    // 重新渲染
    loadPoems();
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
    loadPoems();
});

// 添加错误处理
window.addEventListener('error', (e) => {
    console.error('发生错误：', e.message);
    // 可以添加用户友好的错误提示
}); 