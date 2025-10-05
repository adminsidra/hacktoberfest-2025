from flask import Flask, render_template, request, jsonify
from nltk.sentiment.vader import SentimentIntensityAnalyzer
import nltk
import random

# Initialize Flask app
app = Flask(__name__)

# Download VADER lexicon if not already present
try:
    nltk.data.find('vader_lexicon')
except LookupError:
    nltk.download('vader_lexicon')

# Initialize VADER sentiment analyzer
analyzer = SentimentIntensityAnalyzer()

def get_mood_enhancement_steps(mood, confidence_level):
    """
    Get specific actionable steps based on mood and confidence level
    Returns personalized recommendations for mood improvement
    """

    # Define actionable steps for different moods
    positive_steps = [
        "🌟 Share your positive energy - call a friend or family member to brighten their day",
        "📝 Write down 3 things you're grateful for today to amplify your good mood", 
        "🎵 Create a playlist of your favorite upbeat songs to maintain this energy",
        "🏃‍♀️ Go for a 10-minute walk outside to boost endorphins naturally",
        "🎨 Channel this positive energy into a creative activity like drawing or writing",
        "🤝 Do a small act of kindness - compliment someone or help a neighbor",
        "📚 Learn something new for 15 minutes to keep your mind engaged positively",
        "🧘‍♀️ Practice 5 minutes of gratitude meditation to solidify this good feeling"
    ]

    negative_steps = [
        "🫁 Take 5 deep breaths: inhale for 4 counts, hold for 4, exhale for 6",
        "💧 Drink a full glass of water - dehydration can worsen mood",
        "🚶‍♀️ Take a 5-minute walk, even if it's just around your room",
        "📱 Reach out to one supportive person - text or call someone who cares about you",
        "🎵 Listen to one song that usually makes you feel better",
        "✍️ Write down what's bothering you for 3 minutes, then tear up the paper",
        "🛁 Take a warm shower or splash cold water on your face",
        "🍎 Eat something nutritious - low blood sugar can affect mood",
        "😴 If tired, take a 20-minute power nap to reset your energy",
        "🌱 Step outside for 2 minutes and get some natural light"
    ]

    neutral_steps = [
        "🎯 Set one small, achievable goal for the next hour",
        "🧹 Organize your immediate space - clean your desk or make your bed", 
        "📞 Connect with someone - send a text to check in on a friend",
        "🌿 Do 5 minutes of light stretching or yoga poses",
        "📖 Read something interesting for 10 minutes - news, article, or book",
        "🎨 Engage in a creative activity for 15 minutes - doodle, write, or craft",
        "🍵 Make yourself a warm beverage and savor it mindfully",
        "🎵 Listen to music that matches your current energy level",
        "📝 Plan one thing you're looking forward to this week",
        "🌅 Look out a window and observe nature or surroundings for 2 minutes"
    ]

    if mood == "Positive":
        steps = random.sample(positive_steps, min(3, len(positive_steps)))
        header = "✨ Great vibes! Here's how to amplify your positive mood:"
    elif mood == "Negative":
        # For negative moods, provide more steps based on confidence level
        num_steps = 4 if confidence_level > 0.5 else 3
        steps = random.sample(negative_steps, min(num_steps, len(negative_steps)))
        header = "💙 It's okay to feel down. Here are gentle steps to help you feel better:"
    else:  # Neutral
        steps = random.sample(neutral_steps, min(3, len(neutral_steps)))
        header = "⚖️ You're in a balanced state. Here's how to add some positive momentum:"

    return {
        "header": header,
        "steps": steps
    }

def analyze_mood(text):
    """
    Analyze the mood of the given text using VADER sentiment analysis
    Returns: mood, emoji, and actionable enhancement steps
    """
    # Get sentiment scores from VADER
    scores = analyzer.polarity_scores(text)

    # Extract the compound score (overall sentiment)
    compound_score = scores['compound']

    # Determine mood based on compound score
    if compound_score >= 0.05:
        mood = "Positive"
        emoji = "🙂"
    elif compound_score <= -0.05:
        mood = "Negative" 
        emoji = "🙁"
    else:
        mood = "Neutral"
        emoji = "😐"

    # Get actionable steps based on mood and confidence
    confidence_level = abs(compound_score)
    enhancement_data = get_mood_enhancement_steps(mood, confidence_level)

    return {
        "mood": mood,
        "emoji": emoji, 
        "enhancement_header": enhancement_data["header"],
        "enhancement_steps": enhancement_data["steps"],
        "confidence": confidence_level,
        "scores": scores
    }

@app.route('/')
def index():
    """Render the main page"""
    return render_template('index.html')

@app.route('/analyze', methods=['POST'])
def analyze():
    """API endpoint to analyze mood from user input"""
    try:
        # Get the text from the request
        data = request.get_json()
        user_text = data.get('text', '').strip()

        # Check if text is empty
        if not user_text:
            return jsonify({
                "error": "Please enter some text to analyze!"
            }), 400

        # Analyze the mood
        result = analyze_mood(user_text)

        return jsonify({
            "success": True,
            "mood": result["mood"],
            "emoji": result["emoji"],
            "enhancement_header": result["enhancement_header"],
            "enhancement_steps": result["enhancement_steps"],
            "confidence": round(result["confidence"], 2),
            "text": user_text
        })

    except Exception as e:
        return jsonify({
            "error": f"An error occurred: {str(e)}"
        }), 500

if __name__ == '__main__':
    # Run the Flask app in debug mode
    print("Starting MoodMate AI Web App with Actionable Mood Enhancement...")
    print("Open your browser and go to: http://127.0.0.1:5000")
    app.run(debug=True, host='127.0.0.1', port=5000)
