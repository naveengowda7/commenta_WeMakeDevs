# Commenta

*Commenta* is a project designed to help *content creators* better understand their audience through the comments they receive on their videos. By leveraging AI-powered analysis and natural language interaction, Commenta provides insights into user feedback, questions, and discussions, making audience engagement easier and smarter.

---

## 🚀 Features

* *YouTube Comment Fetching*: Automatically fetches comments from YouTube videos.
* *Cerebras Fast Inference API*: Analyzes the fetched comments to generate insights and structured data.
* *Comment Categorization*: Enables filtering of comments such as:

  * Only relevant feedback
  * Questions asked by users
  * Suggestions and more
* *Interactive Dashboard*: Allows content creators to explore analyzed comments in a user-friendly way.
* *Natural Language Querying (via Docker MCP Gateway)*:

  * Creators can ask questions in plain English (e.g., “Show me all the questions my viewers asked last week”).
  * Cerebras AI responds in plain English with real values stored in the database.

---

## 🛠 Tech Stack

* *Cerebras Fast Inference API* – For AI-powered comment analysis
* *Docker MCP Gateway* – For natural language interaction with AI and database
* *Database* – To store analyzed comments and insights
* *YouTube API* – For fetching video comments

---

## ⚙ How It Works

1. Fetch comments from YouTube using the *YouTube API*.
2. Send the comments to *Cerebras Fast Inference API* for analysis.
3. Store the analyzed results in the *database*.
4. Provide an *interactive interface* where content creators can:

   * View comments by category (feedback, questions, suggestions, etc.)
   * Search, filter, and explore insights easily
5. Allow creators to interact with stored data in *plain English* via *Docker MCP Gateway*.

   * Example:

     * Input: “How many people asked questions in my latest video?”
     * Output: “There were 54 user questions in your latest video.”

---

## 📦 Installation & Setup

### Prerequisites

* Docker
* Node.js / Python (depending on backend implementation)
* API keys for YouTube and Cerebras

### Steps

1. Clone the repository:

   bash
   git clone https://github.com/your-repo/commenta.git
   cd commenta
   

2. Set up environment variables (.env file):

   env
   YOUTUBE_API_KEY=your_youtube_api_key
   CEREBRAS_API_KEY=your_cerebras_api_key
   DB_CONNECTION=your_database_connection_string
   

3. Run Docker MCP Gateway:

   bash
   docker-compose up
   

4. Start the application:

   bash
   npm install   # or pip install -r requirements.txt
   npm start     # or python app.py
   

---

## 🖥 Usage

* Fetch comments from a YouTube video by providing the video ID.
* Let Cerebras AI analyze the comments automatically.
* Access the dashboard to filter/view insights.
* Use natural language to query the database through Docker MCP Gateway.

---

## 📊 Example Queries

* “Show me all positive feedback from my last 3 videos.”
* “List all questions asked by users in September.”
* “How many negative comments did I get last week?”

---

## 📌 Future Enhancements

* Support for multiple platforms (Instagram, Twitter, TikTok).
* Advanced sentiment analysis with trend visualization.
* Integration with creator dashboards like YouTube Studio.

---

## 🤝 Contributing

Contributions are welcome! Please fork the repo, create a branch, and submit a pull request.

---

## 📜 License

This project is licensed under the MIT License.

---

## 🙌 Acknowledgments

* [Cerebras](https://www.cerebras.net/) for AI inference APIs
* [Docker](https://www.docker.com/) for MCP Gateway support
* [YouTube API](https://developers.google.com/youtube) for comment fetching

---

*Commenta – Making audience feedback smarter for content creators.*
