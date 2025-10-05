// MoodMate - Enhanced Frontend JavaScript for Actionable Steps

// Store the last analysis result for regenerating different steps
let lastAnalysisResult = null;

// Wait for the DOM to load before running any code
document.addEventListener('DOMContentLoaded', function() {
    console.log('MoodMate AI Mood Enhancer loaded successfully! 🤖');

    // Initialize character counter
    updateCharacterCount();

    // Add event listener for character counting
    const moodInput = document.getElementById('moodInput');
    moodInput.addEventListener('input', updateCharacterCount);

    // Add enter key support (Shift+Enter for new line, Enter to analyze)
    moodInput.addEventListener('keypress', function(event) {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            analyzeMood();
        }
    });
});

/**
 * Update the character count display
 */
function updateCharacterCount() {
    const input = document.getElementById('moodInput');
    const charCount = document.getElementById('charCount');
    const currentLength = input.value.length;

    charCount.textContent = currentLength;

    // Change color based on character limit
    if (currentLength > 400) {
        charCount.style.color = '#dc3545'; // Red
    } else if (currentLength > 300) {
        charCount.style.color = '#ffc107'; // Yellow
    } else {
        charCount.style.color = '#6c757d'; // Gray
    }
}

/**
 * Main function to analyze mood - called when user clicks the button
 */
async function analyzeMood() {
    console.log('Starting mood analysis for actionable steps...');

    // Get user input
    const inputText = document.getElementById('moodInput').value.trim();

    // Validate input
    if (!inputText) {
        showError('Please describe your current mood to get personalized enhancement steps! 📝');
        return;
    }

    if (inputText.length < 3) {
        showError('Please provide more details about your mood for better recommendations. 🔍');
        return;
    }

    // Show loading state
    setLoadingState(true);

    try {
        // Make API call to Flask backend
        const response = await fetch('/analyze', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                text: inputText
            })
        });

        // Parse the response
        const data = await response.json();

        if (response.ok && data.success) {
            // Store result for potential regeneration
            lastAnalysisResult = data;

            // Display successful result with actionable steps
            displayMoodEnhancementSteps(data);
            hideError();
        } else {
            // Handle API error
            showError(data.error || 'Failed to analyze mood. Please try again! 🔄');
        }

    } catch (error) {
        console.error('Error analyzing mood:', error);
        showError('Network error. Please check your connection and try again! 🌐');
    } finally {
        // Hide loading state
        setLoadingState(false);
    }
}

/**
 * Display the mood analysis results with actionable enhancement steps
 * @param {Object} data - Response data from the API
 */
function displayMoodEnhancementSteps(data) {
    console.log('Displaying mood enhancement steps:', data);

    // Get result elements
    const resultCard = document.getElementById('resultCard');
    const moodEmoji = document.getElementById('moodEmoji');
    const moodText = document.getElementById('moodText');
    const enhancementHeader = document.getElementById('enhancementHeader');
    const enhancementSteps = document.getElementById('enhancementSteps');
    const confidenceScore = document.getElementById('confidenceScore');
    const analyzedText = document.getElementById('analyzedText');

    // Update mood display
    moodEmoji.textContent = data.emoji;
    moodText.textContent = data.mood;
    confidenceScore.textContent = data.confidence;
    analyzedText.textContent = truncateText(data.text, 50);

    // Update enhancement section
    enhancementHeader.textContent = data.enhancement_header;

    // Create step list HTML
    let stepsHTML = '<div class="steps-container">';
    data.enhancement_steps.forEach((step, index) => {
        stepsHTML += `
            <div class="step-item" style="animation-delay: ${index * 0.2}s">
                <div class="step-number">${index + 1}</div>
                <div class="step-content">${step}</div>
            </div>
        `;
    });
    stepsHTML += '</div>';

    enhancementSteps.innerHTML = stepsHTML;

    // Update card styling based on mood
    resultCard.className = 'mood-result-card';
    if (data.mood.toLowerCase() === 'positive') {
        resultCard.classList.add('positive');
    } else if (data.mood.toLowerCase() === 'negative') {
        resultCard.classList.add('negative');
    } else {
        resultCard.classList.add('neutral');
    }

    // Show the result card with animation
    resultCard.classList.remove('d-none');
    resultCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

    // Add celebration effect for positive moods
    if (data.mood.toLowerCase() === 'positive') {
        createCelebrationEffect();
    }
}

/**
 * Get new steps for the same mood analysis
 */
async function getNewSteps() {
    if (!lastAnalysisResult) {
        showError('Please analyze your mood first to get alternative steps! 📝');
        return;
    }

    console.log('Getting new enhancement steps...');
    setLoadingState(true, 'Getting new steps...');

    try {
        // Re-analyze to get different random steps
        const response = await fetch('/analyze', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                text: lastAnalysisResult.text
            })
        });

        const data = await response.json();

        if (response.ok && data.success) {
            lastAnalysisResult = data;
            displayMoodEnhancementSteps(data);
            hideError();
        } else {
            showError(data.error || 'Failed to get new steps. Please try again! 🔄');
        }

    } catch (error) {
        console.error('Error getting new steps:', error);
        showError('Network error. Please try again! 🌐');
    } finally {
        setLoadingState(false);
    }
}

/**
 * Show error message to user
 * @param {string} message - Error message to display
 */
function showError(message) {
    console.error('Showing error:', message);

    const errorCard = document.getElementById('errorCard');
    const errorMessage = document.getElementById('errorMessage');

    errorMessage.textContent = message;
    errorCard.classList.remove('d-none');

    // Auto-hide error after 5 seconds
    setTimeout(hideError, 5000);

    // Scroll to error
    errorCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

/**
 * Hide error message
 */
function hideError() {
    const errorCard = document.getElementById('errorCard');
    errorCard.classList.add('d-none');
}

/**
 * Set loading state for the analyze button
 * @param {boolean} loading - Whether to show loading state
 * @param {string} customText - Custom loading text
 */
function setLoadingState(loading, customText = null) {
    const analyzeBtn = document.getElementById('analyzeBtn');
    const btnText = document.getElementById('btnText');
    const loadingSpinner = document.getElementById('loadingSpinner');

    if (loading) {
        analyzeBtn.disabled = true;
        btnText.textContent = customText || '🧠 Analyzing mood...';
        loadingSpinner.classList.remove('d-none');
        document.body.classList.add('loading');
    } else {
        analyzeBtn.disabled = false;
        btnText.textContent = '🔍 Get Mood Enhancement Steps';
        loadingSpinner.classList.add('d-none');
        document.body.classList.remove('loading');
    }
}

/**
 * Reset form for another analysis
 */
function analyzeAnother() {
    console.log('Resetting for another analysis...');

    // Clear the input
    const moodInput = document.getElementById('moodInput');
    moodInput.value = '';
    moodInput.focus();

    // Hide result and error cards
    document.getElementById('resultCard').classList.add('d-none');
    hideError();

    // Clear stored result
    lastAnalysisResult = null;

    // Update character count
    updateCharacterCount();

    // Smooth scroll back to input
    moodInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

/**
 * Truncate text for display
 * @param {string} text - Text to truncate
 * @param {number} maxLength - Maximum length
 * @returns {string} Truncated text
 */
function truncateText(text, maxLength) {
    if (text.length <= maxLength) {
        return text;
    }
    return text.substring(0, maxLength) + '...';
}

/**
 * Create celebration effect for positive moods
 */
function createCelebrationEffect() {
    // Simple celebration with emoji rain
    const celebration = ['🎉', '✨', '🌟', '💫', '🎊'];

    for (let i = 0; i < 5; i++) {
        setTimeout(() => {
            createFloatingEmoji(celebration[Math.floor(Math.random() * celebration.length)]);
        }, i * 200);
    }
}

/**
 * Create floating emoji effect
 * @param {string} emoji - Emoji to float
 */
function createFloatingEmoji(emoji) {
    const floatingEmoji = document.createElement('div');
    floatingEmoji.textContent = emoji;
    floatingEmoji.style.position = 'fixed';
    floatingEmoji.style.fontSize = '2rem';
    floatingEmoji.style.zIndex = '9999';
    floatingEmoji.style.pointerEvents = 'none';
    floatingEmoji.style.left = Math.random() * window.innerWidth + 'px';
    floatingEmoji.style.top = window.innerHeight + 'px';
    floatingEmoji.style.animation = 'floatUp 3s ease-out forwards';

    // Add CSS animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes floatUp {
            0% {
                transform: translateY(0) rotate(0deg);
                opacity: 1;
            }
            100% {
                transform: translateY(-${window.innerHeight + 100}px) rotate(360deg);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);

    document.body.appendChild(floatingEmoji);

    // Remove element after animation
    setTimeout(() => {
        if (floatingEmoji.parentNode) {
            floatingEmoji.parentNode.removeChild(floatingEmoji);
        }
        if (style.parentNode) {
            style.parentNode.removeChild(style);
        }
    }, 3000);
}

/**
 * Handle keyboard shortcuts
 */
document.addEventListener('keydown', function(event) {
    // Ctrl/Cmd + Enter to analyze
    if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') {
        event.preventDefault();
        analyzeMood();
    }

    // Escape to clear
    if (event.key === 'Escape') {
        analyzeAnother();
    }

    // R key to get new steps (if analysis exists)
    if (event.key.toLowerCase() === 'r' && lastAnalysisResult) {
        event.preventDefault();
        getNewSteps();
    }
});

// Enhanced console messages for developers
console.log(`
🤖 MoodMate AI Mood Enhancer
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✨ Built with Flask & VADER AI
🎯 Actionable Mood Enhancement
💝 Made for practical wellness
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Keyboard Shortcuts:
• Enter: Analyze mood
• Ctrl/Cmd + Enter: Quick analyze
• R: Get different steps (after analysis)
• Escape: Clear and reset

Features:
• Personalized action steps
• Mood-specific recommendations
• Confidence-based step quantity
• Alternative step generation

Happy enhancing! 🚀
`);