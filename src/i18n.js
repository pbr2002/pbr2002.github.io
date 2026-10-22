// Translate text nodes in place so the globe, icons and animation targets survive switching.
const translations = new Map(Object.entries({
'跳到正文':'Skip to content',
'关于我':'About', '项目作品':'Projects', '联系我':'Contact',
'UNSW SYDNEY · 信息技术硕士在读':'UNSW SYDNEY · MASTER OF INFORMATION TECHNOLOGY',
'用代码，':'Code.', '探索':'Explore.', '智能的无限可能':'The possibilities of AI', '。':'.',
'你好，我是':'Hi, I’m ', '庞博仁':'Boren Pang',
'一名对软件开发与 AI 充满好奇的 UNSW IT 研一学生。':'A first-year IT master’s student at UNSW, curious about software and AI.',
'探索我的项目':'Explore my projects', '向下探索':'Scroll to explore',
'始于好奇，行于实践':'CURIOSITY INTO PRACTICE',
'保持好奇，':'Stay curious. ', '持续探索。':'Keep exploring.',
'从数据科学，到信息技术。':'From data science to information technology.',
'在学习与实践中，拓展技术的边界。':'Learning by doing. Exploring what comes next.',
'我的学习坐标':'WHERE I STUDY', '拖动地球 · 探索视角':'Drag to explore the globe',
'从杨凌，':'From Yangling,', '到悉尼。':'to Sydney.',
'本科阶段':'Undergraduate', '硕士阶段':'Master’s',
'本科和硕士学习地点':'Undergraduate and postgraduate study locations',
'西北农林科技大学 → UNSW Sydney':'Northwest A&F University → UNSW Sydney',
'你好，我是庞博仁':'HELLO, I’M BOREN PANG',
'让好奇心，':'Let curiosity', '成为':' inspire ', '下一行代码。':'the next line of code.',
'我目前在澳大利亚新南威尔士大学（UNSW Sydney）攻读信息技术硕士学位，本科毕业于西北农林科技大学数据科学与大数据技术专业。':'I’m pursuing a Master of Information Technology at UNSW Sydney, Australia. I completed my undergraduate studies in Data Science and Big Data Technology at Northwest A&F University.',
'我对软件开发、人工智能和计算机技术充满兴趣，希望通过实际项目积累经验，未来寻找软件开发或 AI 相关的实习及工作机会。':'I’m interested in software development, artificial intelligence and computing. I’m building experience through practical projects and seeking internships and graduate opportunities in software or AI.',
'软件开发':'Software development', '人工智能':'Artificial intelligence', '计算机技术':'Computing',
'从想法到实现':'FROM IDEAS TO IMPLEMENTATION', '我的技术语言':'My language of choice',
'用 Python，把探索落到实处。':'Turning curiosity into practice with Python.',
'当前的研究兴趣':'RESEARCH INTERESTS', '生成式 AI':'Generative AI', '计算机视觉':'Computer vision',
'探索扩散模型与 GAN 在行人重识别数据增强中的应用。':'Exploring diffusion models and GANs for data augmentation in person re-identification.',
'把想法，':'Bringing ideas ', '带进真实场景。':'into the real world.',
'我的 GitHub':'My GitHub', '输入图像':'Input image', '扩散模型 / GAN':'Diffusion / GAN', '增强样本':'Augmented sample',
'个人项目 / 03':'PERSONAL PROJECT / 03', '中英双语交互式':'Bilingual, interactive',
'个人作品集网站':'personal portfolio website', '个人作品集':'PERSONAL PORTFOLIO',
'构建中英双语响应式作品集，使用 Three.js 实现交互式点阵地球，并以 GSAP 制作页面动效；支持减少动态效果偏好，并为不支持 WebGL 的环境提供回退体验。':'Built a responsive bilingual portfolio with an interactive Three.js point-cloud globe and GSAP motion; respects reduced-motion preferences and provides a fallback where WebGL is unavailable.',
'使用 esbuild 构建静态站点，并配置 GitHub Actions，在浏览器与无障碍检查通过后自动部署至 GitHub Pages。':'Built the static site with esbuild and configured GitHub Actions to deploy to GitHub Pages after browser and accessibility checks pass.',
'编写 8 项 Playwright 端到端测试，覆盖语言切换、页面导航、外链安全、减少动态效果、WebGL 回退、JavaScript 异常及 360/375px 移动布局；并对中英文页面执行 axe WCAG 2.1 A/AA 检查。':'Wrote eight Playwright end-to-end tests covering language switching, navigation, external-link safety, reduced motion, WebGL fallback, JavaScript errors and 360/375px mobile layouts; also ran axe WCAG 2.1 A/AA checks in both languages.',
'交互体验 · 双语界面':'INTERACTION · BILINGUAL UI',
'查看个人作品集网站源码':'View portfolio source on GitHub',
'生成 · 增强 · 识别':'GENERATE · AUGMENT · IDENTIFY', '研究项目 / 01':'RESEARCH / 01',
'基于扩散模型的':'Diffusion models for', '行人重识别研究':'person re-identification',
'基于 Python 和深度学习技术，研究扩散模型与生成对抗网络（GAN）在行人重识别任务中的数据增强方法。':'Using Python and deep learning to investigate data augmentation with diffusion models and generative adversarial networks (GANs) for person re-identification.',
'结合 DCAC、Cluster Contrast 等模型，在 Market-1501、DukeMTMC-reID 和 MSMT17 数据集上开展实验，并使用 mAP 和 Rank-1 指标评估模型性能。':'Experiments combine models including DCAC and Cluster Contrast across Market-1501, DukeMTMC-reID and MSMT17, with performance evaluated using mAP and Rank-1.',
'深度学习':'Deep learning', '扩散模型':'Diffusion models', '在 GitHub 探索项目':'Explore on GitHub',
'视频链接自动打开':'Open video links', '审核结果记录':'Record review results',
'拒绝原因分类':'Classify rejections', '审核进度恢复':'Resume progress',
'Excel 数据读取':'Read Excel data', '视频审核':'Video review', '自动保存':'Auto-save',
'功能流程示意':'WORKFLOW ILLUSTRATION', '实习实践 / 02':'INTERNSHIP PROJECT / 02',
'自动化助手':'automation assistant',
'在 Python 自动化实习期间，使用 Python、Tkinter 和 openpyxl 开发视频审核桌面工具，优化实际业务中的视频审核流程。':'During a Python automation internship, I developed a desktop video review tool using Python, Tkinter and openpyxl to improve a real business review workflow.',
'实现 Excel 数据读取、视频链接自动打开、审核结果记录与拒绝原因分类，并支持数据自动保存及审核进度恢复。':'The tool reads Excel data, opens video links, records review results and categorizes rejection reasons. It also saves data automatically and restores review progress.',
'流程自动化':'Workflow automation', '下一次探索，':'The next discovery', '或许':' might ',
'从一次交流开始。':'start with a conversation.',
'正在寻找软件开发或 AI 相关的实习及工作机会。':'Seeking internship and job opportunities in software development or AI.',
'也欢迎聊聊技术、项目与新的想法。':'Let’s talk about technology, projects and new ideas.',
'给我发邮件':'Email me', '复制邮箱':'Copy email', '小红书':'Xiaohongshu',
'回到顶部':'Back to top',
'庞博仁 首页':'Boren Pang — Home', '主导航':'Main navigation',
'访问 GitHub（新窗口）':'Visit GitHub (opens in a new tab)',
'可拖动旋转的三维点阵地球，标记杨凌与悉尼':'Interactive rotating dot globe marking Yangling and Sydney',
'视频审核工具功能流程示意':'Illustration of the video review workflow',

'返回顶部':'Back to top', '点阵地球':'Dot globe',
'EDUCATION / 学习经历':'EDUCATION / ACADEMIC BACKGROUND', '教育背景':'Education',
'本科':'Bachelor’s degree', '硕士':'Master’s degree',
'西北农林科技大学':'Northwest A&F University', '数据科学与大数据技术':'Data Science and Big Data Technology',
'信息技术硕士':'Master of Information Technology',
'世界大学排名 · 全球第 19':'World University Rankings · #19 globally',
'硕士在读':'Currently studying'
}));
const metadata={zh:{title:'庞博仁 · 个人主页',description:'庞博仁的个人主页。UNSW Sydney 信息技术硕士在读，关注软件开发、人工智能、行人重识别研究与 Python 自动化实践。',ogTitle:'庞博仁 · 探索代码与智能的可能',ogDescription:'UNSW 信息技术硕士在读 · 数据科学与大数据技术 · Python · 软件开发与人工智能'},en:{title:'Boren Pang · Portfolio',description:'Boren Pang’s portfolio. Master of Information Technology student at UNSW Sydney, exploring software development, AI, person re-identification and Python automation.',ogTitle:'Boren Pang · Exploring code and AI',ogDescription:'UNSW IT master’s student · Data Science and Big Data Technology · Python · Software development & AI'}};
const nodes=[];const walker=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT);let node;
while((node=walker.nextNode())){const key=node.textContent.trim();if(translations.has(key)){const raw=node.textContent;nodes.push({node,zh:raw,en:raw.replace(key,translations.get(key))})}}
const attributes=[];document.querySelectorAll('[aria-label]').forEach(el=>{const zh=el.getAttribute('aria-label');if(translations.has(zh))attributes.push({el,zh,en:translations.get(zh)})});
let language='zh';
export function currentLanguage(){return language}
export function localized(zh,en){return language==='en'?en:zh}
export function setLanguage(next,{persist=true}={}){
 language=next==='en'?'en':'zh';document.documentElement.lang=language==='en'?'en':'zh-CN';
 nodes.forEach(item=>item.node.textContent=item[language]);attributes.forEach(item=>item.el.setAttribute('aria-label',item[language]));
 document.querySelectorAll('[data-language]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.language===language)));
 const m=metadata[language];document.title=m.title;document.querySelector('meta[name="description"]').content=m.description;document.querySelector('meta[property="og:title"]').content=m.ogTitle;document.querySelector('meta[property="og:description"]').content=m.ogDescription;
 document.querySelector('#language-status').textContent=language==='en'?'Language: English':'当前语言：中文';
 document.querySelector('#toast').classList.remove('show');document.querySelector('#toast').textContent='';
 if(persist){try{localStorage.setItem('boren-language',language)}catch{}}
 document.dispatchEvent(new CustomEvent('languagechange',{detail:{language}}));
}
let initial='zh';try{initial=localStorage.getItem('boren-language')==='en'?'en':'zh'}catch{}
const requested=new URLSearchParams(location.search).get('lang');if(requested==='en'||requested==='zh')initial=requested;
setLanguage(initial,{persist:false});
document.querySelectorAll('[data-language]').forEach(button=>button.addEventListener('click',()=>setLanguage(button.dataset.language)));
