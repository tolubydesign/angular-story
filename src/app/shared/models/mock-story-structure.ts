export class MockStoryStructure {
  id: number;
  summary: string;
  title: string;
  story: string;
  options: {
    decisions: number[],
    summary: string[],
  };
}