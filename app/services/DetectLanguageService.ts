import request, { RequestPromiseOptions } from 'request-promise';

const BASE_URL = 'https://ws.detectlanguage.com/0.2/detect';

const options: RequestPromiseOptions = {
  auth: {
    bearer: process.env.DETECT_LANGUAGE_API_KEY
  }
};

type LanguageDetectionType = {
  language: string;
  isReliable: boolean;
  confidence: number;
};

type DetectLanguageResponseType = {
  data: {
    detections: LanguageDetectionType[];
  };
};

const DEFAULT_LANGUAGE = 'en';

const supportedLanguages = ['en', 'ja', 'fr', 'es'];

export const detectLanguage = async (words: string[]): Promise<string> => {
  const wordsString = words.join(' ');
  const encodedWordString = encodeURI(wordsString);

  const requestUrl = `${BASE_URL}?q=${encodedWordString}`;

  try {
    const res = await request(requestUrl, options);
    const json: DetectLanguageResponseType = JSON.parse(res);

    const language = json.data.detections[0].language;
    const isSupported = supportedLanguages.includes(language);

    return isSupported ? language : DEFAULT_LANGUAGE;
  } catch (error) {
    console.log('Error detecting language', error);
    return DEFAULT_LANGUAGE;
  }
};
