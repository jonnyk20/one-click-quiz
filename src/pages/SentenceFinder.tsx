import React, { useState, useEffect } from 'react';
import socketIOClient from 'socket.io-client';
import { uniq } from 'ramda';
import { isNotNilOrEmpty } from '../utils/utils';
import sampleTranslations from '../utils/sampleTranslations';
import ProgressIndicator, {
  BuilderProgress,
} from '../components/ProgressIndicator';
import Button from '../components/Button';
import { BuilderState } from '../constants/states';
import { LanguageCodes, VocabItemType } from '../constants/translationTypes';

import './SentenceFinder.scss';
import ChipsInput from '../components/ChipsInput/ChipsInput';
import SelectionList from '../components/SelectionList/SelectionList';
import WordsExport from '../components/WordList/WordsExport';

const convertItemsToInput = (arr: string[]): string => arr.join('\n');
const convertInputToItems = (input: string): string[] =>
  input.split('\n').slice(0, 12);

type TranslationOptionsType = {
  words: string[];
  targetLang: LanguageCodes;
  translationLang: LanguageCodes;
};

// const sampleMap: Map<string, VocabItemType | null> = new Map();
// sampleMap.set('word 1', sampleTranslations[0]);
// sampleMap.set('word 2', sampleTranslations[0]);
// sampleMap.set('word 3', null);

// console.log('sampleMap.size', sampleMap.size);

// const defaultItems = [
//   'divant',
//   'coeur',
//   'sourcil',
//   'briser',
//   'livre',
//   'thé',
//   'poursuivre',
//   'chauve',
//   'lumière',
//   'boisson',
//   'robinet',
//   'peau',
// ];

const defaultItems = new Set(['意地悪']);

type CompletedSentencesPayload = {
  url: string;
};

const languageOptions: { [code in LanguageCodes]: string } = {
  [LanguageCodes.fr]: 'French',
  [LanguageCodes.sp]: 'Spanish',
  [LanguageCodes.ja]: 'Japanese',
  [LanguageCodes.en]: 'English',
};

const languageOptionsArray = Object.entries(
  languageOptions
).map(([key, label]) => ({ key, label }));

const Builder = () => {
  const [items, setItems] = useState<Set<string>>(defaultItems);
  const [vocabMap, setVocabMap] = useState<Map<string, VocabItemType | null>>(
    new Map()
  );
  const [socket, setSocket] = useState<SocketIOClient.Socket | null>(null);
  const [sentencesUrl, setSentencesUrl] = useState<string>('my-sentences');
  const [nativeLanguage, setNativeLanguage] = useState<LanguageCodes>(
    LanguageCodes.en
  );
  const [targetLanguage, setTargetLanguage] = useState<LanguageCodes>(
    LanguageCodes.ja
  );
  const [progress, setProgress] = useState<BuilderProgress>({
    completed: 0,
    total: 0,
  });
  const [builderState, setBuilderState] = useState<BuilderState>(
    BuilderState.INPUTTING
  );

  const validItems = Array.from(items).filter(isNotNilOrEmpty);

  const handleSubmit = async (event: any) => {
    event.preventDefault();
    socket?.off('word-translated');
    socket?.on('word-translated', (vocabItem: VocabItemType) => {
      console.log('why', vocabItem);
      setVocabMap((prevMap) => {
        const newVocabMap = new Map(prevMap);
        newVocabMap.set(vocabItem.word, vocabItem);
        return newVocabMap;
      });
    });

    const options: TranslationOptionsType = {
      words: uniq(validItems),
      targetLang: targetLanguage,
      translationLang: nativeLanguage,
    };
    socket?.emit(`translate-words`, options);

    const newVocabMap = new Map();
    validItems.forEach((item) => newVocabMap.set(item, null));
    setVocabMap(newVocabMap);

    setBuilderState(BuilderState.PREPARING);
  };

  const handleFail = () => {
    setBuilderState(BuilderState.FAILED);
  };

  const handleComplete = (payload: CompletedSentencesPayload) => {
    setSentencesUrl(payload.url);
    setBuilderState(BuilderState.READY);
  };

  const reset = () => {
    setItems(defaultItems);
    setBuilderState(BuilderState.INPUTTING);
  };

  const onChangeNativeLanguage = (value: string) => {
    const languageCode = value as LanguageCodes;
    setNativeLanguage(languageCode);
  };

  const onChangeTargetLanguage = (value: string) => {
    const languageCode = value as LanguageCodes;
    setTargetLanguage(languageCode);
  };

  useEffect(() => {
    const socket = socketIOClient();

    setSocket(socket);

    return () => {
      socket.close();
    };
  }, []);

  const isInputting = builderState === BuilderState.INPUTTING;
  const isPreparing = builderState === BuilderState.PREPARING;
  const isComplete = builderState === BuilderState.READY;
  const isFailed = builderState === BuilderState.FAILED;
  const formattedSentencesUrl = `${window.location.origin}/sentences/${sentencesUrl}`;

  return (
    <div className="sentence-finder container">
      <div className="padding-10">
        <h2>Sentences Finder</h2>
      </div>
      {isInputting && (
        <>
          <div className="mb-10 text-light-color text-medium">
            Automatic sentence cards for language learners
          </div>
          <div className="mv-5 text-small">1. Choose your language</div>
          <div className="mv-5 text-small">1. Choose your words</div>
          <div className="mt-5 mb-20 text-small">
            3. Click 'Find Sentences' and we'll find translations and sentences
            for you
          </div>

          <div className="sentence-finder__form">
            <div className="sentence-finder__form__language-selection">
              <div>Native Language</div>
              <SelectionList
                options={languageOptionsArray}
                onChange={onChangeNativeLanguage}
                initialValue={nativeLanguage}
              />
            </div>
            <div className="sentence-finder__form__language-selection">
              <div>Target Language</div>
              <SelectionList
                options={languageOptionsArray}
                defaultText="e.g. Reptiles"
                onChange={onChangeTargetLanguage}
                initialValue={targetLanguage}
              />
            </div>
            <div className="sentence-finder__form__submission mv-20">
              <div className="mr-10">
                {`Enter ${languageOptions[targetLanguage]} words below and then click 'Find Sentences'`}
              </div>
              <Button onClick={handleSubmit}>Find Sentences</Button>
            </div>
            <div className="sentence-finder__form__input">
              <ChipsInput items={items} setItems={setItems} />
            </div>
          </div>
        </>
      )}
      {isPreparing && (
        <div>
          <ProgressIndicator {...progress} />
          <WordsExport
            vocabItems={vocabMap}
            sourceLang={targetLanguage}
            translationLang={nativeLanguage}
          />
        </div>
      )}

      {isFailed && (
        <div className="mv-20">
          <div className="mb-20">Failed to Find Sentences</div>
          <Button onClick={reset}>Try again</Button>
        </div>
      )}
    </div>
  );
};

export default Builder;
