# **App Name**: Sentimatic

## Core Features:

- Text Input: A multiline text box for users to paste or type the text to be analyzed.
- Sentiment Analysis: Use Hugging Face inference API or Firebase Extensions to analyze the sentiment of the input text and return a sentiment label (Positive, Negative, or Neutral) and confidence score.
- Result Display: Display the predicted sentiment label (Positive / Neutral / Negative), the confidence score (0–100%), and a color indicator (green = positive, yellow = neutral, red = negative) in a clear results card. there should be graphical representation of the results.
- Error Handling: Display user-friendly error messages for empty text input and API call failures.
- Analysis History Storage: Store past analysis results in Firestore with fields: input_text, sentiment, timestamp, confidence.
- History Page: Display previous analyses.
- File Upload: Users should be able to input file upload.

## Style Guidelines:

- Primary color: Calm blue (#64B5F6) to provide a clean and trustworthy feel.
- Background color: Light gray (#F0F4F7), close to white to keep focus on the app content.
- Accent color: Soft purple (#9575CD) for a modern contrast in UI elements and sentiment color indicators (green = positive, yellow = neutral, red = negative).
- Body and headline font: 'Inter' for a modern, clean, and readable design.