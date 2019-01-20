"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Workflow
 */
class Workflow {
    constructor(workflows) {
        this.workflows = workflows;
    }
    workSetup() {
        console.log(this.workflows.main.jobs.length);
    }
}
exports.Workflow = Workflow;
