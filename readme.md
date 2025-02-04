# WhatsApp LLM Chatbot: Your Privacy-First AI Assistant

> Transform your WhatsApp experience with a locally-deployed intelligent AI powered by DeepSeek-R1, ensuring 100% data privacy while delivering state-of-the-art conversational intelligence.

[WhatsApp Chat Interface](assets/chat-demo.png)

## 🔒 Privacy-First Architecture

- **Local LLM Deployment**: All processing happens on your hardware - no data leaves your system
- **Zero Cloud Dependencies**: No connections to DeepSeek servers or third-party services
- **Complete Data Control**: You own and control all conversation data
- **Open Source Transparency**: Fully auditable codebase

## 🧠 Powered by DeepSeek-R1

Our solution leverages the latest DeepSeek-R1 model, offering:
- Advanced natural language understanding
- Context-aware responses
- Multi-turn conversation capabilities
- Customizable knowledge domains based on your data input

## 🌟 Vision & Use Cases

Transform your business communications with privacy-preserving AI technology. This versatile solution enables:

### Customer Service
- 24/7 instant customer support
- Intelligent query handling
- Automated ticket creation and tracking
- Multi-language support

### Business Operations
- Meeting scheduling and calendar management
- Order tracking and updates
- Product recommendations
- Invoice generation and processing

### Educational Support
- Interactive tutoring
- Course information delivery
- Assignment assistance
- Study planning

### Healthcare Assistance
- Appointment scheduling
- Medication reminders
- Basic health inquiries
- Wellness tips and tracking

### Personal Assistant
- Task management
- Event planning
- Travel booking assistance
- Restaurant recommendations

[Feature Overview](assets/features.png) <!-- Add an infographic showing key features -->

## 🚀 Features

- Real-time conversation with local LLM models
- Webhook integration for instant message processing
- Media message support (images, documents, audio)
- Encrypted media handling
- Message status tracking

## 🛠️ Technical Stack

- Node.js
- Express.js
- Ollama (Local LLM)
- WhatsApp Business API
- Webhook Integration

## 🔧 Installation & Setup

### Prerequisites
- **Node.js** installed
- **Ngrok** account
- **Meta Developer** account
- **Ollama** installed locally

### Clone the Repository
```bash
git clone https://github.com/yourusername/whatsapp_ollama_bot.git
cd whatsapp_ollama_bot
```

### Install Dependencies
```bash
npm install express axios ollama-node dotenv
```

### Configure Environment Variables
Create a `.env` file in the root directory with the following content:
```env
WHATSAPP_TOKEN=your_whatsapp_token
VERIFY_TOKEN=your_verify_token
PHONE_NUMBER_ID=your_phone_number_id
```

### Set Up Ngrok
1. Download Ngrok from the [official website](https://ngrok.com/).
2. Extract and run:
    ```bash
    ./ngrok http 5001
    ```
3. Copy the generated HTTPS URL.

### Configure Meta Webhook
1. Go to the [Meta Developers Portal](https://developers.facebook.com/).
2. Navigate to **WhatsApp > Configuration**.
3. Set **Callback URL** to: `your_ngrok_url/webhook`
4. Enter your **Verify Token**.

### Set Up Ollama
1. Start the Ollama service:
    ```bash
    ollama serve
    ```
2. Pull and run the DeepSeek-R1 model:
    ```bash
    ollama run deepseek-r1
    ```
3. Verify the model is running:
    ```bash
    ollama ps
    ```

### Start the Application
```bash
node index.js
```

---

## 📋 Development Roadmap

### Current Features
- Real-time WhatsApp message processing
- Local LLM integration
- Basic conversation handling
- Webhook implementation

### Upcoming Features
- Web search integration
- Vector-DB/MongoDB for RAG search
- Multi-modal processing (image/video/voice)
- Enhanced RAG capabilities
- Performance optimization
- Admin dashboard

---

## 📚 Documentation
- [WhatsApp Cloud API Documentation](https://developers.facebook.com/docs/whatsapp)
- [Ollama Documentation](https://ollama.com/docs)
- [DeepSeek-R1 Model Details](https://example.com/deepseek-r1)

---

## 📄 License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
```

## 📊 Performance Optimization

### Hardware Requirements
- GPU: 12GB+ VRAM recommended
- Optimal performance with RTX 4070/4080/4090
- M1/M2 Macs with 16GB+ RAM supported

### Model Selection
- Currently using deepseek-r1 7B model
- Optimized for performance/quality balance

[Performance Metrics](assets/performance.png) <!-- Add a graph showing response times -->
