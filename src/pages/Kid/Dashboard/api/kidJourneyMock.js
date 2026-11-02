// Demo progress only. Never submit these values as learner progress.
export function journeyDemoProgress(chapter) {
  return chapter <= 2
    ? { status: "completed", progress: 100, lessonsCompleted: 5 }
    : chapter === 3
      ? { status: "current", progress: 40, lessonsCompleted: 2 }
      : { status: "available", progress: 0, lessonsCompleted: 0 };
}
