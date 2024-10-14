// 保存数据到 localStorage
function saveData() {
    localStorage.setItem('categories', JSON.stringify(categories));
    localStorage.setItem('prompts', JSON.stringify(prompts));
}

// 从 localStorage 加载数据
function loadData() {
    const savedCategories = localStorage.getItem('categories');
    const savedPrompts = localStorage.getItem('prompts');

    if (savedCategories) {
        categories = JSON.parse(savedCategories);
    }

    if (savedPrompts) {
        prompts = JSON.parse(savedPrompts);
    }
}

function parseTemplate() {
    const template = document.getElementById('template').value;
    const regex = /\{\{(\w+)\}\}/g;
    const variables = [];
    let match;

    while ((match = regex.exec(template)) !== null) {
        if (!variables.includes(match[1])) {
            variables.push(match[1]);
        }
    }

    return variables;
}

function createInputFields() {
    const variables = parseTemplate();
    const inputFieldsContainer = document.getElementById('inputFields');
    inputFieldsContainer.innerHTML = '<h2 class="text-xl font-semibold mb-4 text-gray-700">输入变量</h2>';

    variables.forEach(variable => {
        const div = document.createElement('div');
        div.className = 'mb-4';
        
        const label = document.createElement('label');
        label.className = 'block text-sm font-medium text-gray-700 mb-1';
        label.textContent = variable + ':';
        label.setAttribute('for', variable);
        
        const input = document.createElement('input');
        input.type = 'text';
        input.id = variable;
        input.className = 'w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500';
        
        div.appendChild(label);
        div.appendChild(input);
        inputFieldsContainer.appendChild(div);
    });
}

function generatePrompt() {
    const template = document.getElementById('template').value;
    const variables = parseTemplate();
    let generatedPrompt = template;

    variables.forEach(variable => {
        const value = document.getElementById(variable).value;
        generatedPrompt = generatedPrompt.replace(new RegExp(`\\{\\{${variable}\\}\\}`, 'g'), value);
    });

    document.getElementById('generatedPrompt').textContent = generatedPrompt;

    // 复制生成的提示词到剪贴板
    navigator.clipboard.writeText(generatedPrompt).then(() => {
        showNotification('提已复制到剪贴板！');
    }).catch(err => {
        console.error('无法复制到剪贴板:', err);
        showNotification('无法复制到剪贴板，请手动复制。', 'error');
    });
}

function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `fixed bottom-4 right-4 px-6 py-3 rounded-md text-white ${type === 'success' ? 'bg-green-500' : 'bg-red-500'} transition-opacity duration-300`;
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.opacity = '0';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// 全局变量
let categories = ['写作', '编程', '创意', '商业', '学习', '生活'];

let prompts = [
    {
        id: 1,
        title: 'Wikipedia 页面生成器',
        category: '写作',
        template: 'Act as a Wikipedia page for {{topic}}. Provide a comprehensive summary of {{topic}}, covering its history, significance, and key aspects. Start with an introductory paragraph that gives an overview of {{topic}}.',
        usage: 50,
        placeholders: {
            topic: {
                description: '你想要生成 Wikipedia 页面的主题',
                example: '人工智能',
                restrictions: '应该是一个名词或短语，不要太长'
            }
        }
    },
    {
        id: 2,
        title: '代码注释生成器',
        category: '编程',
        template: 'Generate comprehensive comments for the following {{language}} code:\n\n```{{language}}\n{{code}}\n```\n\nProvide detailed explanations for each section, function, or important line of code.',
        usage: 30,
        placeholders: {
            language: {
                description: '编程语言',
                example: 'Python',
                restrictions: '应该是一个有效编程语言名称'
            },
            code: {
                description: '需要注释的代码',
                example: 'def fibonacci(n):\n    if n <= 1:\n        return n\n    else:\n        return fibonacci(n-1) + fibonacci(n-2)',
                restrictions: '应该是有效的代码片段'
            }
        }
    },
    {
        id: 3,
        title: '创意故事开头生成器',
        category: '创意',
        template: 'Write a creative and engaging opening paragraph for a {{genre}} story set in {{setting}}. The main character is {{character}}.',
        usage: 40,
        placeholders: {
            genre: {
                description: '事类型',
                example: '科幻',
                restrictions: '应该是一个文学类型'
            },
            setting: {
                description: '故事的背景设定',
                example: '未来的火星殖民地',
                restrictions: '可以是任何地点或时间'
            },
            character: {
                description: '主角的简要描述',
                example: '一个失忆的机器人工程师',
                restrictions: '应该包含角色的关键特征'
            }
        }
    },
    {
        id: 4,
        title: '商业计划书概要生成器',
        category: '商业',
        template: 'Create an executive summary for a business plan for a {{business_type}} startup. The company\'s unique selling proposition is {{USP}}. The target market is {{target_market}}.',
        usage: 25,
        placeholders: {
            business_type: {
                description: '企业类型',
                example: '人工智能驱动的健康科技',
                restrictions: '应该是一个具体的业务领域'
            },
            USP: {
                description: '独特卖点',
                example: '使用机器学习算法个性化的营养建议',
                restrictions: '应该是公司的核心竞争优'
            },
            target_market: {
                description: '目标市场',
                example: '注重健康的千禧一代专业人士',
                restrictions: '应该描述主要客户群'
            }
        }
    },
    {
        id: 5,
        title: '学习主题概述生成器',
        category: '学习',
        template: 'Create a comprehensive overview of {{subject}} for a {{level}} student. Include key concepts, important theories, and practical applications.',
        usage: 35,
        placeholders: {
            subject: {
                description: '学习主题',
                example: '量子力学',
                restrictions: '应该是一个具体的学科或主题'
            },
            level: {
                description: '学习者的水平',
                example: '大学本科',
                restrictions: '可以是任何教育阶段或难度级别'
            }
        }
    },
    {
        id: 6,
        title: '日常习惯培养计划',
        category: '生活',
        template: 'Design a 30-day plan to develop a habit of {{habit}}. Include daily tasks, milestones, and tips to stay motivated. The plan should be suitable for a person with {{lifestyle}}.',
        usage: 20,
        placeholders: {
            habit: {
                description: '想习惯',
                example: '每天阅读30分钟',
                restrictions: '应该是一个具体的、可衡量的习惯'
            },
            lifestyle: {
                description: '目标人群的生活方式',
                example: '繁忙的上班族',
                restrictions: '应该描述目标人群的主要特征和时间限制'
            }
        }
    }
];

// 初始化函数
function init() {
    loadData(); // 加载保存的数据

    if (document.body.classList.contains('home')) {
        renderCategories();
        renderPopularPrompts();
        setupSearch();
    } else if (document.body.classList.contains('browse')) {
        setupBrowsePage();
    } else if (document.body.classList.contains('prompt-detail')) {
        setupPromptDetailPage();
    } else if (document.body.classList.contains('prompt-edit')) {
        setupPromptEditPage();
    } else if (document.body.classList.contains('admin')) {
        setupAdminPage();
    }
}

// 确保在页面加载完成后调用 init 函数
document.addEventListener('DOMContentLoaded', init);

// 渲染分类
function renderCategories() {
    const categoryList = document.getElementById('categoryList');
    if (categoryList) {
        categoryList.innerHTML = categories.map(category => `
            <a href="browse.html?category=${encodeURIComponent(category)}" 
               class="bg-white p-4 rounded-md shadow hover:shadow-md transition-shadow text-center">
                ${category}
            </a>
        `).join('');
    } else {
        console.error('Category list element not found');
    }
}

// 渲染热门提示词
function renderPopularPrompts(filteredPrompts = prompts) {
    const popularPromptList = document.getElementById('popularPromptList');
    popularPromptList.innerHTML = filteredPrompts
        .sort((a, b) => b.usage - a.usage)
        .slice(0, 6)
        .map(prompt => `
            <a href="prompt.html?id=${prompt.id}" class="bg-white p-4 rounded-md shadow hover:shadow-md transition-shadow cursor-pointer">
                <h3 class="font-bold text-lg mb-2">${prompt.title}</h3>
                <p class="text-sm text-gray-600">${prompt.category}</p>
                <p class="text-sm text-gray-500 mt-2">使用次数: ${prompt.usage}</p>
            </a>
        `).join('');
}

// 设置搜索功能
function setupSearch() {
    const searchInput = document.getElementById('searchInput');
    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        const filteredPrompts = prompts.filter(prompt => 
            prompt.title.toLowerCase().includes(searchTerm) || 
            prompt.category.toLowerCase().includes(searchTerm)
        );
        renderPopularPrompts(filteredPrompts);
    });
}

// 设置浏览页面
function setupBrowsePage() {
    populateCategoryFilter();
    const urlParams = new URLSearchParams(window.location.search);
    const category = urlParams.get('category');
    if (category) {
        document.getElementById('categoryFilter').value = category;
    }
    renderPromptList();
    setupFilters();
}

// 填充分类筛选下拉菜单
function populateCategoryFilter() {
    const categoryFilter = document.getElementById('categoryFilter');
    categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category;
        option.textContent = category;
        categoryFilter.appendChild(option);
    });
}

// 渲染提示词列表
function renderPromptList() {
    const categoryFilter = document.getElementById('categoryFilter');
    const selectedCategory = categoryFilter.value;
    const sortOrder = document.getElementById('sortOrder');
    const selectedSort = sortOrder.value;

    let filteredPrompts = prompts;

    if (selectedCategory) {
        filteredPrompts = filteredPrompts.filter(prompt => prompt.category === selectedCategory);
    }

    if (selectedSort === 'newest') {
        filteredPrompts.sort((a, b) => b.id - a.id);
    } else if (selectedSort === 'popular') {
        filteredPrompts.sort((a, b) => b.usage - a.usage);
    }

    const promptList = document.getElementById('promptList');
    if (filteredPrompts.length === 0) {
        promptList.innerHTML = '<p class="col-span-full text-center text-gray-500">没有找到匹配的提示词</p>';
    } else {
        promptList.innerHTML = filteredPrompts.map(prompt => `
            <a href="prompt.html?id=${prompt.id}" class="bg-white p-4 rounded-md shadow hover:shadow-md transition-shadow cursor-pointer">
                <h3 class="font-bold text-lg mb-2">${prompt.title}</h3>
                <p class="text-sm text-gray-600 mb-2">${prompt.category}</p>
                <p class="text-sm mb-4">${prompt.template.substring(0, 100)}...</p>
            </a>
        `).join('');
    }
}

// 设置筛选和排序功能
function setupFilters() {
    const categoryFilter = document.getElementById('categoryFilter');
    const sortOrder = document.getElementById('sortOrder');

    categoryFilter.addEventListener('change', renderPromptList);
    sortOrder.addEventListener('change', renderPromptList);
}

// 设置提示词详情页面
function setupPromptDetailPage() {
    const urlParams = new URLSearchParams(window.location.search);
    const promptId = parseInt(urlParams.get('id'));
    const prompt = prompts.find(p => p.id === promptId);

    if (prompt) {
        renderPromptDetail(prompt);
        if (Object.keys(prompt.placeholders).length > 0) {
            setupCustomizeSection(prompt);
            document.getElementById('resultSection').classList.add('hidden');
        } else {
            displayFinalPrompt(prompt.template);
            document.getElementById('customizeSection').classList.add('hidden');
        }
        setupCopyButton();
        setupEditButton(promptId);
    } else {
        document.getElementById('promptDetail').innerHTML = '<p class="text-red-500">提示词未找到</p>';
    }
}

// 设置编辑按钮
function setupEditButton(promptId) {
    const editButton = document.getElementById('editPromptButton');
    editButton.addEventListener('click', () => {
        window.location.href = `edit.html?id=${promptId}`;
    });
}

// 渲染提示词详情
function renderPromptDetail(prompt) {
    const promptDetail = document.getElementById('promptDetail');
    const promptTitle = document.getElementById('promptTitle');
    
    promptTitle.textContent = prompt.title;
    
    const detailContent = document.createElement('div');
    detailContent.innerHTML = `
        <p class="text-gray-600 mb-4">分类：${prompt.category}</p>
        <p class="mb-2">模板：</p>
        <pre class="bg-gray-100 p-4 rounded-md whitespace-pre-wrap mb-4">${prompt.template}</pre>
        ${Object.keys(prompt.placeholders).length > 0 ? `
            <div class="bg-yellow-50 border-l-4 border-yellow-400 p-4">
                <p class="font-bold">占位符说明：</p>
                <ul class="list-disc list-inside">
                    ${Object.entries(prompt.placeholders).map(([key, info]) => `
                        <li><span class="font-semibold">${key}:</span> ${info.description} (示例: ${info.example})</li>
                    `).join('')}
                </ul>
            </div>
        ` : ''}
    `;
    
    promptDetail.appendChild(detailContent);
}

// 设置自定义部分
function setupCustomizeSection(prompt) {
    const customizeSection = document.getElementById('customizeSection');
    customizeSection.classList.remove('hidden');
    
    createInputFields(prompt);
    setupGenerateButton(prompt);
}

// 创建输入字段
function createInputFields(prompt) {
    const inputFieldsContainer = document.getElementById('inputFields');
    inputFieldsContainer.innerHTML = '';
    
    for (const [placeholder, info] of Object.entries(prompt.placeholders)) {
        const div = document.createElement('div');
        div.className = 'mb-4';
        
        const label = document.createElement('label');
        label.className = 'block text-sm font-medium text-gray-700 mb-1';
        label.textContent = `${placeholder}:`;
        label.setAttribute('for', placeholder);
        
        const input = document.createElement('input');
        input.type = 'text';
        input.id = placeholder;
        input.className = 'w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500';
        input.placeholder = info.example;
        
        const hint = document.createElement('p');
        hint.className = 'text-xs text-gray-500 mt-1';
        hint.textContent = info.restrictions;
        
        div.appendChild(label);
        div.appendChild(input);
        div.appendChild(hint);
        inputFieldsContainer.appendChild(div);
    }
}

// 设置生成按钮
function setupGenerateButton(prompt) {
    const generateButton = document.getElementById('generateButton');
    generateButton.addEventListener('click', () => {
        let generatedPrompt = prompt.template;
        for (const placeholder of Object.keys(prompt.placeholders)) {
            const value = document.getElementById(placeholder).value;
            generatedPrompt = generatedPrompt.replace(new RegExp(`\\{\\{${placeholder}\\}\\}`, 'g'), value);
        }
        displayFinalPrompt(generatedPrompt);
    });
}

// 显示最终提示词
function displayFinalPrompt(promptText) {
    const finalPromptText = document.getElementById('finalPromptText');
    finalPromptText.textContent = promptText;
    document.getElementById('resultSection').classList.remove('hidden');
}

// 设置复制按钮
function setupCopyButton() {
    const copyButton = document.getElementById('copyButton');
    copyButton.addEventListener('click', () => {
        const finalPromptText = document.getElementById('finalPromptText').textContent;
        navigator.clipboard.writeText(finalPromptText).then(() => {
            showNotification('提示词已复制到剪贴板！');
        }).catch(err => {
            console.error('无法复制到剪贴板:', err);
            showNotification('无法复制到剪贴板，请手动复制。', 'error');
        });
    });
}

// 设置提示词编辑页面
function setupPromptEditPage() {
    populateCategorySelect();
    setupPlaceholderEditor();
    setupPreview();
    const urlParams = new URLSearchParams(window.location.search);
    const promptId = urlParams.get('id');

    if (promptId) {
        // 编辑现有提示词
        const prompt = prompts.find(p => p.id === parseInt(promptId));
        if (prompt) {
            document.getElementById('pageTitle').textContent = '编辑提示词';
            document.getElementById('promptTitle').value = prompt.title;
            document.getElementById('promptCategory').value = prompt.category;
            document.getElementById('promptTemplate').value = prompt.template;
            loadPlaceholders(prompt.placeholders);
            updatePreview();
        } else {
            showNotification('提示词未找到', 'error');
        }
    } else {
        // 创建新提示词
        document.getElementById('pageTitle').textContent = '创建新提示词';
    }

    // 使用 addEventListener 而不是直接赋值
    const form = document.getElementById('promptForm');
    if (form) {
        form.addEventListener('submit', handlePromptSubmit);
    }

    // 添加输入事件监听器
    const titleInput = document.getElementById('promptTitle');
    const templateInput = document.getElementById('promptTemplate');
    if (titleInput) {
        titleInput.addEventListener('input', updatePreview);
    }
    if (templateInput) {
        templateInput.addEventListener('input', () => {
            detectPlaceholders();
            updatePreview();
        });
    }
}

// 填充分类选择下拉菜单
function populateCategorySelect() {
    const categorySelect = document.getElementById('promptCategory');
    categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category;
        option.textContent = category;
        categorySelect.appendChild(option);
    });
}

// 设置占位符编辑器
function setupPlaceholderEditor() {
    const addPlaceholderButton = document.getElementById('addPlaceholder');
    addPlaceholderButton.addEventListener('click', addPlaceholderField);

    // 监听模板输入，自动检测新的占位符
    const templateInput = document.getElementById('promptTemplate');
    templateInput.addEventListener('input', detectPlaceholders);
}

// 添加占位符输入字段
function addPlaceholderField(name = '', description = '', example = '', restrictions = '') {
    const placeholders = document.getElementById('placeholders');
    const placeholderIndex = placeholders.children.length;
    
    const placeholderField = document.createElement('div');
    placeholderField.className = 'mb-4 p-4 border border-gray-300 rounded-md';
    placeholderField.innerHTML = `
        <div class="mb-2">
            <label class="block text-sm font-medium text-gray-700 mb-1">占位符名称：</label>
            <input type="text" name="placeholderName_${placeholderIndex}" value="${name}" required
                class="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500">
        </div>
        <div class="mb-2">
            <label class="block text-sm font-medium text-gray-700 mb-1">描述：</label>
            <input type="text" name="placeholderDescription_${placeholderIndex}" value="${description}"
                class="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500">
        </div>
        <div class="mb-2">
            <label class="block text-sm font-medium text-gray-700 mb-1">示例：</label>
            <input type="text" name="placeholderExample_${placeholderIndex}" value="${example}"
                class="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500">
        </div>
        <div class="mb-2">
            <label class="block text-sm font-medium text-gray-700 mb-1">限制：</label>
            <input type="text" name="placeholderRestrictions_${placeholderIndex}" value="${restrictions}"
                class="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500">
        </div>
        <button type="button" class="text-red-600 hover:text-red-800" onclick="removePlaceholderField(this)">删除</button>
    `;
    
    placeholders.appendChild(placeholderField);
    updatePreview();
}

// 删除占位符输入字段
function removePlaceholderField(button) {
    const placeholderField = button.parentElement;
    placeholderField.remove();
    updatePreview();
}

// 检测模板中的占位符
function detectPlaceholders() {
    const templateInput = document.getElementById('promptTemplate');
    const placeholdersContainer = document.getElementById('placeholders');
    if (!templateInput || !placeholdersContainer) return;

    const template = templateInput.value;
    const placeholderRegex = /\{\{(\w+)\}\}/g;
    const detectedPlaceholders = new Set();
    let match;

    while ((match = placeholderRegex.exec(template)) !== null) {
        detectedPlaceholders.add(match[1]);
    }

    const existingPlaceholders = new Set(Array.from(placeholdersContainer.children).map(
        child => {
            const input = child.querySelector('input[name^="placeholderName_"]');
            return input ? input.value : null;
        }
    ).filter(Boolean));

    // 添加新检测到的占位符
    for (const placeholder of detectedPlaceholders) {
        if (!existingPlaceholders.has(placeholder)) {
            addPlaceholderField(placeholder);
        }
    }

    // 移除不再使用的占位符
    for (const placeholder of existingPlaceholders) {
        if (!detectedPlaceholders.has(placeholder)) {
            const placeholderField = Array.from(placeholdersContainer.children).find(
                child => {
                    const input = child.querySelector('input[name^="placeholderName_"]');
                    return input && input.value === placeholder;
                }
            );
            if (placeholderField) {
                placeholderField.remove();
            }
        }
    }
}

// 加载现有占位符
function loadPlaceholders(placeholders) {
    for (const [name, info] of Object.entries(placeholders)) {
        addPlaceholderField(name, info.description, info.example, info.restrictions);
    }
}

// 处理提示词表单提交
function handlePromptSubmit(event) {
    event.preventDefault(); // 阻止表单的默认提交行为

    const title = document.getElementById('promptTitle').value;
    const category = document.getElementById('promptCategory').value;
    const template = document.getElementById('promptTemplate').value;
    const placeholders = getPlaceholdersData();

    const urlParams = new URLSearchParams(window.location.search);
    const promptId = urlParams.get('id');

    if (promptId) {
        // 更新现有提示词
        const promptIndex = prompts.findIndex(p => p.id === parseInt(promptId));
        if (promptIndex !== -1) {
            prompts[promptIndex] = { ...prompts[promptIndex], title, category, template, placeholders };
            showNotification('提示词已更新');
        }
    } else {
        // 创建新提示词
        const newPrompt = {
            id: prompts.length + 1,
            title,
            category,
            template,
            placeholders,
            usage: 0
        };
        prompts.push(newPrompt);
        showNotification('新提示词已创建');
    }

    saveData(); // 保存数据
    
    // 使用 setTimeout 来确保通知显示后再跳转
    setTimeout(() => {
        window.location.href = 'browse.html';
    }, 1500);
}

// 获取占位符数据
function getPlaceholdersData() {
    const placeholdersContainer = document.getElementById('placeholders');
    if (!placeholdersContainer) return {};

    const placeholderFields = placeholdersContainer.children;
    const placeholders = {};

    for (const field of placeholderFields) {
        const nameInput = field.querySelector('input[name^="placeholderName_"]');
        const descriptionInput = field.querySelector('input[name^="placeholderDescription_"]');
        const exampleInput = field.querySelector('input[name^="placeholderExample_"]');
        const restrictionsInput = field.querySelector('input[name^="placeholderRestrictions_"]');

        if (nameInput && nameInput.value) {
            placeholders[nameInput.value] = {
                description: descriptionInput ? descriptionInput.value : '',
                example: exampleInput ? exampleInput.value : '',
                restrictions: restrictionsInput ? restrictionsInput.value : ''
            };
        }
    }

    return placeholders;
}

// 设置管理页面
function setupAdminPage() {
    renderAdminPromptList();
    renderAdminCategoryList();
    setupAddCategory();
}

// 渲染管理页面的提示列表
function renderAdminPromptList() {
    const promptList = document.getElementById('promptList');
    promptList.innerHTML = prompts.map(prompt => `
        <div class="flex justify-between items-center">
            <span>${prompt.title}</span>
            <div>
                <a href="edit.html?id=${prompt.id}" class="text-blue-600 hover:underline mr-2">编辑</a>
                <button onclick="deletePrompt(${prompt.id})" class="text-red-600 hover:underline">删除</button>
            </div>
        </div>
    `).join('');
}

// 删除提示词
function deletePrompt(id) {
    if (confirm('确定要删除这个提示词吗？')) {
        prompts = prompts.filter(prompt => prompt.id !== id);
        renderAdminPromptList();
        showNotification('提示词已删除');
        saveData(); // 保存数据
    }
}

// 渲染管理页面的类别列表
function renderAdminCategoryList() {
    const categoryList = document.getElementById('categoryList');
    categoryList.innerHTML = categories.map(category => `
        <div class="flex justify-between items-center">
            <span>${category}</span>
            <button onclick="deleteCategory('${category}')" class="text-red-600 hover:underline">删除</button>
        </div>
    `).join('');
}

// 删除类别
function deleteCategory(category) {
    if (confirm('确定要删除这个类别吗？相关的提示词将被设为"未分类"。')) {
        categories = categories.filter(c => c !== category);
        prompts = prompts.map(prompt => {
            if (prompt.category === category) {
                return { ...prompt, category: '未分类' };
            }
            return prompt;
        });
        renderAdminCategoryList();
        showNotification('类别已删除');
        saveData(); // 保存数据
    }
}

// 设置添加类别功能
function setupAddCategory() {
    const addCategoryButton = document.getElementById('addCategory');
    const newCategoryInput = document.getElementById('newCategory');

    addCategoryButton.addEventListener('click', () => {
        const newCategory = newCategoryInput.value.trim();
        if (newCategory && !categories.includes(newCategory)) {
            categories.push(newCategory);
            renderAdminCategoryList();
            newCategoryInput.value = '';
            showNotification('新类别已添加');
            saveData(); // 保存数据
        } else if (categories.includes(newCategory)) {
            showNotification('该类别已存在', 'error');
        } else {
            showNotification('请输入有效的类别名称', 'error');
        }
    });
}

// 设置预览功能
function setupPreview() {
    const titleInput = document.getElementById('promptTitle');
    const templateInput = document.getElementById('promptTemplate');
    const placeholdersContainer = document.getElementById('placeholders');

    titleInput.addEventListener('input', updatePreview);
    templateInput.addEventListener('input', updatePreview);
    placeholdersContainer.addEventListener('input', updatePreview);
}

// 更新预览
function updatePreview() {
    const previewArea = document.getElementById('previewArea');
    const titleInput = document.getElementById('promptTitle');
    const templateInput = document.getElementById('promptTemplate');
    const placeholdersContainer = document.getElementById('placeholders');

    if (!previewArea || !titleInput || !templateInput || !placeholdersContainer) return;

    const title = titleInput.value || '';
    const template = templateInput.value || '';
    const placeholders = getPlaceholdersData();

    let previewHtml = `<h4 class="font-bold mb-2">${title}</h4>`;
    previewHtml += `<p class="mb-4">${template}</p>`;

    if (Object.keys(placeholders).length > 0) {
        previewHtml += '<h5 class="font-bold mb-2">占位符：</h5>';
        for (const [name, info] of Object.entries(placeholders)) {
            previewHtml += `
                <div class="mb-2">
                    <strong>${name}:</strong>
                    <ul class="list-disc list-inside pl-4">
                        <li>描述：${info.description || ''}</li>
                        <li>示例：${info.example || ''}</li>
                        <li>限制：${info.restrictions || ''}</li>
                    </ul>
                </div>
            `;
        }
    }

    previewArea.innerHTML = previewHtml;
}

// 确保在页面加载完成后调用 init 函数
document.addEventListener('DOMContentLoaded', init);