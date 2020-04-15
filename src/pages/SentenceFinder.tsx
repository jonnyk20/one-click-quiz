import React, { useState, useEffect } from 'react';
import socketIOClient from 'socket.io-client';
import { uniq } from 'ramda';
import { isNotNilOrEmpty } from '../utils/utils';
import ProgressIndicator, {
  BuilderProgress
} from '../components/ProgressIndicator';
import Button from '../components/Button';
import { BuilderState } from '../constants/states';

import './SentenceFinder.scss';

const convertItemsToInput = (arr: string[]): string => arr.join('\n');
const convertInputToItems = (input: string): string[] =>
  input.split('\n').slice(0, 12);

const defaultItems = [
  'divant',
  'coeur',
  'sourcil',
  'briser',
  'livre',
  'thé',
  'poursuivre',
  'chauve',
  'lumière',
  'boisson',
  'robinet',
  'peau'
];

type CompletedSentencesPayload = {
  url: string;
};

const Builder = () => {
  const [items, setItems] = useState<string[]>(defaultItems);
  const [socket, setSocket] = useState<SocketIOClient.Socket | null>(null);
  const [sentencesUrl, setSentencesUrl] = useState<string>('my-sentences');
  const [progress, setProgress] = useState<BuilderProgress>({
    completed: 0,
    total: 0
  });
  const [builderState, setBuilderState] = useState<BuilderState>(
    BuilderState.INPUTTING
  );

  const validItems = items.filter(isNotNilOrEmpty);



  const handleChange = (event: React.FormEvent<HTMLTextAreaElement>) => {
    const element = event.currentTarget as HTMLTextAreaElement;

    setItems(convertInputToItems(element.value));
  };

  const handleSubmit = async (event: any) => {
    event.preventDefault();
    socket?.emit(`submit-sentence-quiz`, uniq(validItems));
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

  useEffect(() => {
    const socket = socketIOClient();
    socket.on('builder-progress-update', (progress: BuilderProgress) => {
      console.log('progress update received', progress);
      setProgress(progress);
    });
    socket.on('builder-fail', (error: string) => {
      console.log('Sentences Building Failed', error);
      handleFail();
    });
    socket.on('completed', (payload: CompletedSentencesPayload) => {
      console.log('Sentences comleted', payload);
      handleComplete(payload);
    });
    socket.on('update', (update: any) => console.log('UPDATE', update));
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
  const inputValue = convertItemsToInput(items);

  return (
    <div className="sentence-miner container">
      <div className="padding-20">
        <h1>Sentences Finder</h1>
        <p className="text-medium text-light-color">
          Automatically finds sentences for the vocabulary words you enter
        </p>
        <p className="text-medium">
          1. Add words to the box below (up to 12 for now)
        </p>
        <p className="text-medium">
          2. Click&nbsp;<span className="text-light-color">'Find Sentences'</span>
        </p>
        <p className="text-medium">3. Pick from the the sentences and save them as a spreadsheet</p>
      </div>
      {isInputting && (
        <div className="sentence-miner__form">
          <div className="sentence-miner__form__submit-button mb-20">
            <Button onClick={handleSubmit}>Find Sentences</Button>
          </div>
          <textarea
            className="sentence-miner__form__input"
            value={inputValue}
            onChange={handleChange}
          />
          <div className="sentence-miner__form__preview">
            {validItems.map((item, i) => (
              <div
                key={item}
                className="sentence-miner__form__preview__item"
              >
                {`${i + 1}. ${item}`}
              </div>
            ))}
          </div>
        </div>
      )}
      {isPreparing && <ProgressIndicator {...progress} />}
      {isComplete && (
        <div>
          Your sentences are ready at
          <br />
          <div className="sentence-miner__sentences-link">
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
