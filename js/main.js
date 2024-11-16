// 示例诗歌数据
const poems = [
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

// 加载诗歌列表
function loadPoems() {
    const poemsGrid = document.querySelector('.poems-grid');
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
                <button class="like-btn" data-id="${poem.id}">
                    <i class="fas fa-heart"></i> ${poem.likes}
                </button>
                <button class="comment-btn" data-id="${poem.id}">
                    <i class="fas fa-comment"></i> ${poem.comments.length}
                </button>
            </div>
        </div>
    `;

    // 添加交互事件
    const likeBtn = card.querySelector('.like-btn');
    likeBtn.addEventListener('click', () => handleLike(poem.id));

    const commentBtn = card.querySelector('.comment-btn');
    commentBtn.addEventListener('click', () => showCommentModal(poem.id));

    return card;
}

// 处理点赞
function handleLike(poemId) {
    const poem = poems.find(p => p.id === poemId);
    if (poem) {
        poem.likes++;
        loadPoems(); // 重新渲染以更新点赞数
    }
}

// 显示评论模态框
function showCommentModal(poemId) {
    // 创建模态框
    const modal = document.createElement('div');
    modal.className = 'comment-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <h3>发表评论</h3>
            <textarea placeholder="写下你的想法..."></textarea>
            <button class="submit-comment">提交</button>
            <button class="close-modal">关闭</button>
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
}

// 添加评论
function addComment(poemId, comment) {
    const poem = poems.find(p => p.id === poemId);
    if (poem) {
        poem.comments.push({
            id: Date.now(),
            text: comment,
            date: new Date().toLocaleString()
        });
        loadPoems(); // 重新渲染以更新评论数
    }
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
    loadPoems();
}); 