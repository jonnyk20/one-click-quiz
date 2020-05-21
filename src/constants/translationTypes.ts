export enum LanguageCodes {
  fr = 'fr',
  sp = 'sp',
  ja = 'ja',
  en = 'en',
}

export type SentenceType = {
  sentence: string;
  sourceUrl: string;
  sourceName: string;
};

export type SentenceExampleType = {
  targetLanguage: SentenceType;
  translation: SentenceType;
};

export type VocabItemType = {
  word: string;
  translations: string[];
  examples: SentenceExampleType[];
};

/*
  word: '意地悪',
  translations: ['ill-tempered', 'unkind', 'malicious'],
  examples: [
    {
      targetLanguage: {
        sentence:
          '分離不安の子犬は、行儀が悪いわけでも、飼い主に意地悪をしているわけでもありません。',
        sourceUrl:
          'http://www.eukanuba.jp/ja-JP/puppy-guide/easing-your-puppys-separation-anxiety.jspx',
        sourceName: 'eukanuba.jp',
      },
      translation: {
        sentence:
          'Pups who suffer from separation anxiety are not misbehaving or being spiteful.',
        sourceUrl:
          'http://www.eukanuba.cz/en-US/puppy-guide/easing-your-puppys-separation-anxiety.jspx',
        sourceName: 'eukanuba.cz',
      },
    },
  ],


*/