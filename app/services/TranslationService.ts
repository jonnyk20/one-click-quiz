import request, { RequestPromiseOptions } from 'request-promise';
import cheerio from 'cheerio';
import { Socket } from 'socket.io';
import { wait } from '../utils/utils';

enum LanguageCodeType {
  EN = 'en',
  FR = 'fr',
  SP = 'sp',
  JA = 'ja',
}

const languageStrings: { [code in LanguageCodeType]: string } = {
  [LanguageCodeType.EN]: 'english',
  [LanguageCodeType.FR]: 'french',
  [LanguageCodeType.SP]: 'spanish',
  [LanguageCodeType.JA]: 'japanese',
};

const languageSecificFormatters: {
  [code in LanguageCodeType]: (s: string) => string;
} = {
  [LanguageCodeType.EN]: (str: string) => str,
  [LanguageCodeType.FR]: (str: string) => str,
  [LanguageCodeType.SP]: (str: string) => str,
  [LanguageCodeType.JA]: (str: string) => str.replace(/(?<!(。|、))(\s)/gm, ''),
};

type SentenceType = {
  sentence: string;
  sourceUrl: string;
};

type SentenceExampleType = {
  targetLanguage: SentenceType;
  translation: SentenceType;
};

type TranslationResonseType = {
  translations: string[];
  examples: CheerioElement[];
};

const formatSentence = (s: string, textToRemove: string) => {
  const urlRegex = new RegExp(textToRemove, 'gmi');

  return s.replace(/\s+/gm, ' ').replace(urlRegex, '').trim();
};

const parseSentenceAndSource = (
  $: CheerioStatic,
  sentenceElement: CheerioElement,
  languageCode: LanguageCodeType
) => {
  const sentenceText = $(sentenceElement).text();
  const sentenceSourceElement = $(sentenceElement).find('.source_url a');
  const sourceName = sentenceSourceElement.text();
  const sourceUrl = sentenceSourceElement.prop('href');
  const sentence = languageSecificFormatters[languageCode](
    formatSentence(sentenceText, sourceName)
  );

  return {
    sentence,
    sourceUrl,
    sourceName,
  };
};

const parseHTML = (
  response: string,
  targetLang: LanguageCodeType,
  translationLang: LanguageCodeType
): TranslationResonseType | {} => {
  const $ = cheerio.load(response);
  const translationElements = $(
    '.exact .lemma.featured .translation .dictLink'
  );

  const translations = translationElements.toArray().map((el) => $(el).text());

  const exampleElements = $('.examples tr');
  const examples = exampleElements
    .slice(0, 10)
    .map((i, el) => {
      const targetLanguageElement = $(el).find('.sentence.left')[0];
      const targetLanguage = parseSentenceAndSource(
        $,
        targetLanguageElement,
        targetLang
      );

      const translationElement = $(el).find('.sentence.right2')[0];
      const translation = parseSentenceAndSource(
        $,
        translationElement,
        translationLang
      );

      const example = {
        targetLanguage,
        translation,
      };

      return example;
    })
    .toArray();

  return {
    translations,
    examples,
  };
};

/*

{ 
  word
  translations: [ 'ill-tempered', 'unkind', 'malicious' ],
  examples:
   [ { targetLanguage:
        { sentence: '分離不安の子犬は、行儀が悪いわけでも、飼い主に意地悪をしているわけでもありません。',
          sourceUrl:
           'http://www.eukanuba.jp/ja-JP/puppy-guide/easing-your-puppys-separation-anxiety.jspx',
          sourceName: 'eukanuba.jp' },
       translation:
        { sentence:
           'Pups who suffer from separation anxiety are not misbehaving or being spiteful.',
          sourceUrl:
           'http://www.eukanuba.cz/en-US/puppy-guide/easing-your-puppys-separation-anxiety.jspx',
          sourceName: 'eukanuba.cz' } } ] }

*/

type TranslationType = {
  translations: string[];
  examples: SentenceExampleType[];
  word: string;
};

export const translate = async (
  word: string,
  targetLang: LanguageCodeType,
  translationLang: LanguageCodeType
): Promise<TranslationType | {}> => {
  try {
    const lingueeUrl = `https://www.linguee.com/${
      languageStrings[targetLang]
    }-${
      languageStrings[translationLang]
    }/search?source=ja&query=${encodeURIComponent(word)}`;

    const scrapingBeeUrl = `https://app.scrapingbee.com/api/v1/?api_key=${
      process.env.SCRAPING_BEE_KEY
    }&render_js=false&url=${encodeURIComponent(lingueeUrl)}`;

    const scraperUrl = `http://api.scraperapi.com/?api_key=${
      process.env.SCRAPER_API_KEY
    }&url=${encodeURIComponent(lingueeUrl)}`;

    const res = await request(scrapingBeeUrl, {});

    const results = { word, ...parseHTML(res, targetLang, translationLang) };

    return results;
  } catch (error) {
    console.log('Error Translating', error);
    return {};
  }
};

export const getTranslations = async (
  words: string[],
  targetLang: LanguageCodeType,
  translationLang: LanguageCodeType,
  socket: Socket
) => {
  for (let word of words) {
    console.log('WORD', word);
    const translation = await translate(word, targetLang, translationLang);
    // const translation = {
    //   word,
    //   translations: ['ill-tempered', 'unkind', 'malicious'],
    //   examples: [
    //     {
    //       targetLanguage: {
    //         sentence:
    //           '分離不安の子犬は、行儀が悪いわけでも、飼い主に意地悪をしているわけでもありません。',
    //         sourceUrl:
    //           'http://www.eukanuba.jp/ja-JP/puppy-guide/easing-your-puppys-separation-anxiety.jspx',
    //         sourceName: 'eukanuba.jp',
    //       },
    //       translation: {
    //         sentence:
    //           'Pups who suffer from separation anxiety are not misbehaving or being spiteful.',
    //         sourceUrl:
    //           'http://www.eukanuba.cz/en-US/puppy-guide/easing-your-puppys-separation-anxiety.jspx',
    //         sourceName: 'eukanuba.cz',
    //       },
    //     },
    //     {
    //       targetLanguage: {
    //         sentence:
    //           '2. 分離不安の子犬は、行儀が悪いわけでも、飼い主に意地悪をしているわけでもありません。',
    //         sourceUrl:
    //           'http://www.eukanuba.jp/ja-JP/puppy-guide/easing-your-puppys-separation-anxiety.jspx',
    //         sourceName: 'eukanuba.jp',
    //       },
    //       translation: {
    //         sentence:
    //           '2. Pups who suffer from separation anxiety are not misbehaving or being spiteful.',
    //         sourceUrl:
    //           'http://www.eukanuba.cz/en-US/puppy-guide/easing-your-puppys-separation-anxiety.jspx',
    //         sourceName: 'eukanuba.cz',
    //       },
    //     },
    //     {
    //       targetLanguage: {
    //         sentence:
    //           '3. 分離不安の子犬は、行儀が悪いわけでも、飼い主に意地悪をしているわけでもありません。',
    //         sourceUrl:
    //           'http://www.eukanuba.jp/ja-JP/puppy-guide/easing-your-puppys-separation-anxiety.jspx',
    //         sourceName: 'eukanuba.jp',
    //       },
    //       translation: {
    //         sentence:
    //           '3. Pups who suffer from separation anxiety are not misbehaving or being spiteful.',
    //         sourceUrl:
    //           'http://www.eukanuba.cz/en-US/puppy-guide/easing-your-puppys-separation-anxiety.jspx',
    //         sourceName: 'eukanuba.cz',
    //       },
    //     },
    //   ],
    // };

    // await wait(2000);

    console.log('TRANSLATION', translation);
    socket.emit('word-translated', translation);
  }
};
