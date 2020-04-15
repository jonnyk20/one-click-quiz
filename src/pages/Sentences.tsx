import React, { useState, useEffect } from 'react';
import { useLocation, useParams, useHistory } from 'react-router-dom';

import formatQuiz, { FormattedQuiz } from '../utils/formatQuiz';
import { fetchQuiz } from '../services/OneClickQuizService';
import { QUIZ_TYPES } from '../constants/quizProperties';
import { isNilOrEmpty } from '../utils/utils';
import { sampleSentenceQuiz } from '../utils/sampleQuiz';
import { isEmpty } from 'ramda';
import WordsExport from '../components/WordList/WordsExport';

import './FinishScreen.scss';


interface State {
  quiz: FormattedQuiz;
  user: string;
  modSelections: any;
  correctAnswerCount: number;
  maxCorrectAnswers: number;
  score: number;
  usedRedemption: boolean;
}

type Location = {
  state: State;
};

const FinishScreen: React.SFC = () => {
  const location: Location = useLocation();
  const history = useHistory();
  const { slug = '' } = useParams();
  const isTesting = slug === 'testing';

  const [quiz, setQuiz] = useState<FormattedQuiz>({
    name: '',
    quizType: QUIZ_TYPES.SENTENCE_QUIZ,
    questions: [],
    tags: []
  });

  useEffect(() => {
    const prepareQuiz = async () => {
      const data = await fetchQuiz(slug);
      if (data?.quiz?.id) {
        const formattedQuiz = formatQuiz(data.quiz);
        setQuiz(formattedQuiz);
      } else {
        history.push('/');
      }
    };

    if (!isNilOrEmpty(location?.state?.quiz)) {
      const { quiz } = location.state;
      setQuiz(quiz);
      return;
    }

    if (isTesting) {
      setQuiz(sampleSentenceQuiz);
      return;
    }

    if (!isEmpty(slug)) {
      prepareQuiz();
    }
  }, [history, isTesting, location, slug]);


  return (
    <div className="sentences container">
        <WordsExport quiz={quiz} />
    </div>
  );
};

export default FinishScreen;
