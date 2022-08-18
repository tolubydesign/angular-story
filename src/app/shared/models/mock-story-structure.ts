export class MockStoryStructure {
  id!: number;
  summary: string | undefined;
  title: string | undefined;
  story: string | undefined;
  options:
    | {
        decisions: number[];
        summary: string[];
      }
    | undefined;
}
