export var ParentCommand;
(function (ParentCommand) {
    ParentCommand[ParentCommand["Completed"] = 0] = "Completed";
    ParentCommand[ParentCommand["Error"] = 1] = "Error";
    ParentCommand[ParentCommand["Failed"] = 2] = "Failed";
    ParentCommand[ParentCommand["InitFailed"] = 3] = "InitFailed";
    ParentCommand[ParentCommand["InitCompleted"] = 4] = "InitCompleted";
    ParentCommand[ParentCommand["Log"] = 5] = "Log";
    ParentCommand[ParentCommand["Progress"] = 6] = "Progress";
    ParentCommand[ParentCommand["Update"] = 7] = "Update";
})(ParentCommand || (ParentCommand = {}));
//# sourceMappingURL=parent-command.js.map