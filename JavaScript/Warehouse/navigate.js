export default async function navigate(pageName = null) {
    const container = document.querySelector('.container');
    container.innerHTML = '';
    switch (pageName) {
        case 'newEntry':            
            const styleLinkNewEntry = document.createElement('link');
            styleLinkNewEntry.rel = 'stylesheet';
            styleLinkNewEntry.href = './style/forms.css';

            // Почему не работает?
            // const justValidate = document.createElement('script');
            // justValidate.src = 'https://unpkg.com/just-validate@latest/dist/just-validate.production.min.js';
            // justValidate.defer = true;
            // document.body.appendChild(justValidate);

            document.head.appendChild(styleLinkNewEntry);
            const newEntry = await import('./forms/createNewEntryPage.js');
            newEntry.default(container);
            break;
        case 'editEntry':
            const styleLinkEditEntry = document.createElement('link');
            styleLinkEditEntry.rel = 'stylesheet';
            styleLinkEditEntry.href = './style/forms.css';
            document.head.appendChild(styleLinkEditEntry);
            const editEntry = await import('./forms/createEditEntryPage.js');
            editEntry.default(container);
            break;
        default:
            const styleLinkWarehouse = document.createElement('link');
            styleLinkWarehouse.rel = 'stylesheet';
            styleLinkWarehouse.href = './style/warehouse.css';
            document.head.append(styleLinkWarehouse);
            const table = await import('./warehouse/createWarehousePage.js');
            table.default(container);
    }
}