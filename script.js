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
        showNotification('提示词已复制到剪贴板！');
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

// 页面加载时创建输入字段
window.onload = createInputFields;
