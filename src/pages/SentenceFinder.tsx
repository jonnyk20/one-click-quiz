import React, { useState, useEffect } from 'react';
import socketIOClient from 'socket.io-client';
import { uniq } from 'ramda';
import { isNotNilOrEmpty } from '../utils/utils';
import ProgressIndicator, {
  BuilderProgress,
} from '../components/ProgressIndicator';
import Button from '../components/Button';
import { BuilderState } from '../constants/states';

import './SentenceFinder.scss';
import ChipsInput from '../components/ChipsInput/ChipsInput';
import SelectionList from '../components/SelectionList/SelectionList';

const convertItemsToInput = (arr: string[]): string => arr.join('\n');
const convertInputToItems = (input: string): string[] =>
  input.split('\n').slice(0, 12);

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

const defaultItems = ['友達'];

type CompletedSentencesPayload = {
  url: string;
};

enum LanguageCodes {
  fr = 'fr',
  sp = 'sp',
  ja = 'ja',
  en = 'en',
}

const languageOtions: { [code in LanguageCodes]: string } = {
  [LanguageCodes.fr]: 'French',
  [LanguageCodes.sp]: 'Spanish',
  [LanguageCodes.ja]: 'Japanese',
  [LanguageCodes.en]: 'English',
};

const languageOptionsArray = Object.entries(
  languageOtions
).map(([key, label]) => ({ key, label }));

const Builder = () => {
  const [items, setItems] = useState<string[]>(defaultItems);
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

  const validItems = items.filter(isNotNilOrEmpty);

  const handleSubmit = async (event: any) => {
    event.preventDefault();
    socket?.emit(`translate-words`, {
      words: uniq(validItems),
      targetLang: targetLanguage,
      translationLang: nativeLanguage,
    });

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
    socket.on('word-translated', (update: any) => {
      console.log('Word Translated', update);
    });

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
      <div className="mb-10 text-light-color text-medium">
        Automatic sentence cards for language learners
      </div>
      <div className="mv-5 text-small">1. Choose your language</div>
      <div className="mv-5 text-small">1. Choose your words</div>
      <div className="mt-5 mb-20 text-small">
        3. Click 'Find Sentences' and we'll find translations and sentences for
        you
      </div>
      {isInputting && (
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
              {`Enter ${languageOtions[targetLanguage]} words below and then click 'Find Sentences'`}
            </div>
            <Button onClick={handleSubmit}>Find Sentences</Button>
          </div>
          <div className="sentence-finder__form__input">
            <ChipsInput />
          </div>
        </div>
      )}
      {isPreparing && <ProgressIndicator {...progress} />}
      {isComplete && (
        <div>
          Your sentences are ready at
          <br />
          <div className="sentence-finder__sentences-link">
            <a
              href={formattedSentencesUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              {formattedSentencesUrl}
            </a>
          </div>
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
