// Get DOM elements
const fileInput = document.getElementById('fileInput');
const fileName = document.getElementById('fileName');
const resultSection = document.getElementById('resultSection');
const displayFileName = document.getElementById('displayFileName');
const fileType = document.getElementById('fileType');
const fileSizeBytes = document.getElementById('fileSizeBytes');
const fileSizeReadable = document.getElementById('fileSizeReadable');
const lastModified = document.getElementById('lastModified');
const textLength = document.getElementById('textLength');
const lineCount = document.getElementById('lineCount');
const wordCount = document.getElementById('wordCount');

// Add event listener for file selection
fileInput.addEventListener('change', handleFileSelect);

/**
 * Handle file selection event
 * @param {Event} event - The change event from file input
 */
function handleFileSelect(event) {
    const file = event.target.files[0];
    
    if (file) {
        // Update the file label
        fileName.textContent = file.name;
        
        // Display file information
        displayFileInfo(file);
        
        // Show the result section
        resultSection.classList.remove('hidden');
    }
}

/**
 * Display file information
 * @param {File} file - The selected file object
 */
function displayFileInfo(file) {
    // File name
    displayFileName.textContent = file.name;
    
    // File type
    fileType.textContent = file.type || 'Unknown';
    
    // File size in bytes
    fileSizeBytes.textContent = file.size.toLocaleString() + ' bytes';
    
    // File size in readable format
    fileSizeReadable.textContent = formatFileSize(file.size);
    
    // Last modified date
    lastModified.textContent = new Date(file.lastModified).toLocaleString();
    
    // Read file content to get text length
    readFileContent(file);
}

/**
 * Read file content and display text statistics
 * @param {File} file - The selected file object
 */
function readFileContent(file) {
    const reader = new FileReader();
    
    reader.onload = function(e) {
        const content = e.target.result;
        
        // Calculate text length
        const charCount = content.length;
        textLength.textContent = charCount.toLocaleString() + ' characters';
        
        // Calculate line count
        const lines = content.split('\n').length;
        lineCount.textContent = lines.toLocaleString() + ' lines';
        
        // Calculate word count (split by whitespace and filter empty strings)
        const words = content.split(/\s+/).filter(word => word.length > 0).length;
        wordCount.textContent = words.toLocaleString() + ' words';
    };
    
    reader.onerror = function() {
        textLength.textContent = 'Unable to read (binary file)';
        lineCount.textContent = 'N/A';
        wordCount.textContent = 'N/A';
    };
    
    // Try to read as text
    reader.readAsText(file);
}

/**
 * Format file size to human-readable format
 * @param {number} bytes - File size in bytes
 * @returns {string} Formatted file size
 */
function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
}
