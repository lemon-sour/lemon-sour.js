import { Workflows } from '../interface/yml-interface';

/**
 * Workflow
 */
class Workflow {
  // アプリケーションの実行順番
  workflows: Workflows;

  constructor(workflows: Workflows) {
    this.workflows = workflows;
  }

  workSetup() {
    console.log(this.workflows.main.jobs.length);
  }
}

export { Workflow };
