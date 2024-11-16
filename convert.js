const fs = require('fs');
const path = require('path');
const markdownIt = require('markdown-it');

const md = new markdownIt();
const postsDir = path.join(__dirname, '_posts');
const outputDir = path.join(__dirname, 'posts');

// 创建输出目录
if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir);
}

// 读取所有 Markdown 文件
fs.readdir(postsDir, (err, files) => {
    if (err) throw err;

    files.forEach(file => {
        const filePath = path.join(postsDir, file);
        const fileContent = fs.readFileSync(filePath, 'utf-8');

        // 解析 Markdown 文件
        const htmlContent = md.render(fileContent);

        // 提取文件名作为 HTML 文件名
        const outputFileName = file.replace('.md', '.html');
        const outputPath = path.join(outputDir, outputFileName);

        // 写入 HTML 文件
        fs.writeFileSync(outputPath, htmlContent);
        console.log(`Generated ${outputFileName}`);
    });
}); 