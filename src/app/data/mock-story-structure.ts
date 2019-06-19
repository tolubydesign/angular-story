export class MockStoryStructure {
  id: number;
  title: string;
  story: string;
  options: {
    option_one?: string;
    option_two?: string;
    option_three?: string;
    option_four?: string;
  };
  decisions: {
    decision_1?: number;
    decision_2?: number;
    decision_3?: number;
    decision_4?: number;
  };
}
