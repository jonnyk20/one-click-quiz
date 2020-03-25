import React, { useState, useEffect } from 'react';

import {
  getSuggestedProjects,
  INaturalistProjectType,
  fetchTaxaAndBuildQuiz,
  TaxaQuizOptions
} from '../services/InaturalistService';
import { isNotNilOrEmpty } from '../utils/utils';
import { FormattedQuiz } from '../utils/formatQuiz';
import Button from '../components/Button';
import ProgressBar from '../components/ProgressBar';
import ProjectInfo from '../components/ProjectInfo';
import { QUIZ_TAGS } from '../constants/quizProperties';
import MoreFeaturesCTA from '../components/MoreFeaturesCTA';
import TaxaQuizInstructions from '../components/TaxaQuizInstructions/TaxaQuizInstructions';

import './INatProjects.scss';

enum QuizBuildingState {
  INITIAL,
  BUILDING,
  COMPLETE
}

const BASE_CLASS = `taxa-challenge`;

const INatProjects = () => {
  const [inputValue, setInputValue] = useState<string>('');
  const [suggestedProjects, setSuggestedProjects] = useState<
    INaturalistProjectType[]
  >([]);
  const [noProjectsFound, setNoProjectsFound] = useState<boolean>(false);
  const [searchedValue, setSearchedValue] = useState<string>('');
  const [project, setProject] = useState<INaturalistProjectType | null>(null);

  const [quizBuildingState, setQuizBuildingState] = useState<QuizBuildingState>(
    QuizBuildingState.INITIAL
  );
  const [quiz, setQuiz] = useState<FormattedQuiz | null>(null);

  useEffect(() => {
    const buildQuiz = async () => {
      setQuizBuildingState(QuizBuildingState.BUILDING);
      const options: TaxaQuizOptions = {
        projectId: project!.slug,
        name: `(Project) ${project!.title}`,
        tags: [QUIZ_TAGS.PROJECT]
      };

      const quiz: FormattedQuiz | null = await fetchTaxaAndBuildQuiz(options);

      if (quiz) {
        setQuiz(quiz);
        setQuizBuildingState(QuizBuildingState.COMPLETE);
      }
    };

    if (isNotNilOrEmpty(project)) {
      buildQuiz();
    }
  }, [project]);

  const handleChange = (event: React.FormEvent<HTMLInputElement>): void => {
    const element = event.currentTarget as HTMLInputElement;
    setInputValue(element.value);
  };

  const clearResuts = () => {
    setSuggestedProjects([]);
    setInputValue('');
  };

  const onSearch = async (e?: React.FormEvent<HTMLFormElement>) => {
    e?.preventDefault();

    setSearchedValue(inputValue);
    const projects: INaturalistProjectType[] = await getSuggestedProjects(
      inputValue
    );
    if (isNotNilOrEmpty(projects)) {
      setSuggestedProjects(projects);
      setNoProjectsFound(false);
    } else {
      setNoProjectsFound(true);
    }
  };

  const onSelectProject = (project: INaturalistProjectType) => {
    clearResuts();
    setProject(project);
  };

  const showQuizBuildingProgress =
    quizBuildingState === QuizBuildingState.BUILDING;

  const isProjectReady = isNotNilOrEmpty(project);

  return (
    <div className={`${BASE_CLASS} container`}>
      <div>
        <h3>iNaturalist Project</h3>
        <div>Test yourself on Taxa from a specific project</div>
      </div>
      {!isProjectReady && (
        <div className={`${BASE_CLASS}__search mv-20`}>
          <form
            onSubmit={onSearch}
            className={`${BASE_CLASS}__search__form mt-10`}
          >
            <input
              value={inputValue}
              onChange={handleChange}
              placeholder="Find a project"
              className={`${BASE_CLASS}__search__form__input`}
            />
            <Button onClick={onSearch}>Search</Button>
          </form>
          {isNotNilOrEmpty(suggestedProjects) && (
            <div className={`${BASE_CLASS}__search__suggestions padding-10`}>
              {suggestedProjects.map(project => (
                <div
                  key={project.id}
                  onClick={() => onSelectProject(project)}
                  className={`${BASE_CLASS}__search__suggestions__suggestion`}
                >
                  {project.title}
                </div>
              ))}
              {noProjectsFound && (
                <div>{`No Projects Found for "${searchedValue}"`}</div>
              )}
            </div>
          )}
        </div>
      )}

      {showQuizBuildingProgress && (
        <div className={`${BASE_CLASS}__progress mv-10`}>
          <div className="mv-10">Building Quiz...</div>
          <ProgressBar progress={0} />
        </div>
      )}
      {isNotNilOrEmpty(quiz) && (
        <>
          <h2>{project?.title}</h2>
          <TaxaQuizInstructions quiz={quiz!} />
        </>
      )}
      {!isProjectReady && (
        <>
          <MoreFeaturesCTA />
          <ProjectInfo />
        </>
      )}
    </div>
  );
};

export default INatProjects;
