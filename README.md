<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/14atHRY7aHZ7kSbhXZgBSZgv1oDTrtwf3

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the OpenAI API configuration in [.env.local](.env.local):
   - `OPENAI_API_KEY` - Your OpenAI API Key (required)
   - `OPENAI_BASE_URL` - API Base URL (optional, defaults to https://api.openai.com/v1)
   - `OPENAI_MODEL` - Model name (optional, defaults to gpt-4o-mini)
3. Run the app:
   `npm run dev`
