
export interface UserReport {
  userId: string;
  taskStats: {
    total:     number;
    byStatus:  {
      todo:          number;
      "in-progress": number;
      review:        number;
      done:          number;
    };
    completed: number;
    remaining: number;
  };
  totalHoursLogged: number;
}

export interface ProjectReport {
  projectId:        string;
  totalTasks:       number;
  tasksByStatus: {
    todo:       number;
    inProgress: number;
    review:     number;
    done:       number;
  };
  percentComplete:  number;
  totalHoursLogged: number;
  totalSprints:     number;
}