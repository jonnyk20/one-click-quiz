export const fetchQuiz = async (slug: string) => {
    const response = await fetch(`${window.location.origin}/api/quiz/${slug}`);
    const json = await response.json();
  
    return json;
  };
  