export const fetchCategories = async () => {
  const response = await fetch('https://opentdb.com/api_category.php');
  const data = await response.json();
  return data.trivia_categories.map((category: { name: string; id: number; }) => ({
    label: category.name,
    value: category.id,
  }));
}