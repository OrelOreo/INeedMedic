export type AvailabilityFormState = {
  errors?: {
    startTime?: string[];
    endTime?: string[];
    dayOfWeek?: string[];
    globalErrors?: string[];
  };
  message?: string | null;
};
