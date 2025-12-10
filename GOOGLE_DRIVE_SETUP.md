# Автоматическая загрузка фото из Google Drive

## 🎯 Цель
Галерея автоматически загружает все изображения из твоей Google Drive папки и обновляется при добавлении новых фото.

## 📋 Шаги установки

### 1. Создай Google Apps Script

1. Перейди на https://script.google.com
2. Создай новый проект (New project)
3. Удали код по умолчанию и замени на код ниже:

```javascript
const FOLDER_ID = '1O80bKI8kkLTebMtfeXXaizVeurvNkuAV'; // ID твоей папки

function doGet(e) {
  try {
    const folder = DriveApp.getFolderById(FOLDER_ID);
    const files = folder.getFilesByType(MimeType.JPEG);
    const images = [];

    while (files.hasNext()) {
      const file = files.next();
      images.push({
        url: `https://drive.google.com/uc?export=view&id=${file.getId()}`,
        title: file.getName(),
        id: file.getId()
      });
    }

    const jsonOutput = ContentService.createTextOutput(JSON.stringify(images));
    jsonOutput.setMimeType(ContentService.MimeType.JSON);
    return jsonOutput;
  } catch (e) {
    return ContentService.createTextOutput(JSON.stringify({ error: e.toString() }));
  }
}
```

### 2. Получи URL скрипта

1. Нажми "Deploy" → "New deployment"
2. Выбери тип: "Web app"
3. Execute as: твой email
4. Who has access: "Anyone"
5. Deploy и скопируй URL вида: `https://script.google.com/macros/s/AKfycbz_xxxxx/exec`

### 3. Обнови index.html

Замени эту строку в index.html:
```html
<const API_URL = "https://твой-google-apps-script-url/exec";
```

На URL из шага 2.

### 4. Готово! 🎉

Теперь:
- ✅ Все JPEG-фото из папки будут загружаться автоматически
- ✅ При добавлении новых фото галерея обновится автоматически
- ✅ При удалении фото они исчезнут из галереи

## 🔄 Как обновить галерею

Если добавил новые фото - просто обнови страницу (F5). Галерея загрузит все новые изображения.

## ⚠️ Важно

- Скрипт поддерживает JPEG файлы
- Для других форматов (PNG, WebP) - обнови MimeType в скрипте
- Убедись, что папка доступна (можешь делиться с собой)

## 📝 Поддерживаемые форматы

Добавь в скрипт для поддержки других форматов:
```javascript
const files = folder.getFilesByType(MimeType.JPEG)
  .concat(folder.getFilesByType(MimeType.PNG))
  .concat(folder.getFilesByType(MimeType.GIF));
```
