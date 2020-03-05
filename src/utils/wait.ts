export default async (delay: number) => {
  return new Promise(function(resolve) {
    setTimeout(resolve, delay);
  });
};
